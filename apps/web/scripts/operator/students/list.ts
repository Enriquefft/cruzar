import { asc, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db/client";
import { englishCerts, intakes, profiles, students } from "@/db/schema";
import { parseFlags } from "../_shared/args";
import { logDone, logError, type LogPayloadValue } from "../_shared/logger";

// Non-terminal states are everything that still needs operator action. `ready`
// and `gap` are included in the default output because Miura still drives the
// run-cohort + email flows against them — they are terminal for assess, not
// for the pipeline. Only the `--state` filter narrows further.
const pipelineStateValues = [
  "pending_onboard",
  "pending_intake",
  "pending_assess",
  "ready",
  "gap",
] as const;
type PipelineState = (typeof pipelineStateValues)[number];

const flagsSchema = z.object({
  state: z.enum(pipelineStateValues).optional(),
  q: z.string().min(1).optional(),
});

type StudentRow = {
  id: string;
  email: string;
  name: string;
  public_slug: string;
  onboarded_at: Date | null;
  created_at: Date;
  has_english_cert: boolean;
  intake_finalized_at: Date | null;
  profile_verdict: "ready" | "presentation_gap" | "experience_gap" | null;
};

function deriveState(row: StudentRow): PipelineState | null {
  if (row.profile_verdict === "ready") return "ready";
  if (row.profile_verdict === "presentation_gap" || row.profile_verdict === "experience_gap") {
    return "gap";
  }
  if (row.intake_finalized_at !== null) return "pending_assess";
  if (row.onboarded_at !== null) return "pending_intake";
  if (row.has_english_cert) return "pending_onboard";
  return null;
}

function maskEmail(email: string): string {
  const at = email.indexOf("@");
  if (at <= 0) return "***";
  const local = email.slice(0, at);
  const domain = email.slice(at + 1);
  const head = local.slice(0, 1);
  return `${head}${"*".repeat(Math.max(local.length - 1, 1))}@${domain}`;
}

function firstName(name: string): string {
  const trimmed = name.trim();
  const spaceIdx = trimmed.indexOf(" ");
  return spaceIdx === -1 ? trimmed : trimmed.slice(0, spaceIdx);
}

function formatCreatedAt(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function matchesQuery(row: StudentRow, q: string): boolean {
  const needle = q.toLowerCase();
  return (
    row.name.toLowerCase().includes(needle) ||
    row.email.toLowerCase().includes(needle) ||
    row.public_slug.toLowerCase().includes(needle) ||
    row.id.toLowerCase().includes(needle)
  );
}

async function loadStudents(): Promise<StudentRow[]> {
  const rows = await db
    .select({
      id: students.id,
      email: students.email,
      name: students.name,
      public_slug: students.public_slug,
      onboarded_at: students.onboarded_at,
      created_at: students.created_at,
      cert_id: englishCerts.id,
      intake_finalized_at: intakes.finalized_at,
      profile_verdict: profiles.readiness_verdict,
    })
    .from(students)
    .leftJoin(englishCerts, eq(englishCerts.student_id, students.id))
    .leftJoin(intakes, eq(intakes.student_id, students.id))
    .leftJoin(profiles, eq(profiles.student_id, students.id))
    .orderBy(asc(students.created_at));

  return rows.map((r) => ({
    id: r.id,
    email: r.email,
    name: r.name,
    public_slug: r.public_slug,
    onboarded_at: r.onboarded_at,
    created_at: r.created_at,
    has_english_cert: r.cert_id !== null,
    intake_finalized_at: r.intake_finalized_at,
    profile_verdict: r.profile_verdict,
  }));
}

function renderTable(
  rows: Array<{
    state: PipelineState;
    first: string;
    email_masked: string;
    slug: string;
    created_at: string;
    id: string;
  }>,
): string {
  if (rows.length === 0) return "(no students match)\n";
  const headers = ["state", "first", "email", "slug", "created", "id"] as const;
  const widths: Record<(typeof headers)[number], number> = {
    state: headers[0].length,
    first: headers[1].length,
    email: headers[2].length,
    slug: headers[3].length,
    created: headers[4].length,
    id: headers[5].length,
  };
  for (const r of rows) {
    widths.state = Math.max(widths.state, r.state.length);
    widths.first = Math.max(widths.first, r.first.length);
    widths.email = Math.max(widths.email, r.email_masked.length);
    widths.slug = Math.max(widths.slug, r.slug.length);
    widths.created = Math.max(widths.created, r.created_at.length);
    widths.id = Math.max(widths.id, r.id.length);
  }
  const pad = (s: string, w: number): string => s + " ".repeat(Math.max(w - s.length, 0));
  const headerLine = `${pad("state", widths.state)}  ${pad("first", widths.first)}  ${pad("email", widths.email)}  ${pad("slug", widths.slug)}  ${pad("created", widths.created)}  ${pad("id", widths.id)}\n`;
  const divider = `${"-".repeat(widths.state)}  ${"-".repeat(widths.first)}  ${"-".repeat(widths.email)}  ${"-".repeat(widths.slug)}  ${"-".repeat(widths.created)}  ${"-".repeat(widths.id)}\n`;
  const body = rows
    .map(
      (r) =>
        `${pad(r.state, widths.state)}  ${pad(r.first, widths.first)}  ${pad(r.email_masked, widths.email)}  ${pad(r.slug, widths.slug)}  ${pad(r.created_at, widths.created)}  ${pad(r.id, widths.id)}`,
    )
    .join("\n");
  return `${headerLine}${divider}${body}\n`;
}

export async function listStudentsByState(filter?: {
  state?: PipelineState;
  q?: string;
}): Promise<
  Array<{
    id: string;
    state: PipelineState;
    first: string;
    email_masked: string;
    slug: string;
    created_at: string;
  }>
> {
  const all = await loadStudents();
  const matched: Array<{
    id: string;
    state: PipelineState;
    first: string;
    email_masked: string;
    slug: string;
    created_at: string;
  }> = [];
  for (const row of all) {
    const state = deriveState(row);
    if (state === null) continue;
    if (filter?.state && state !== filter.state) continue;
    if (filter?.q && !matchesQuery(row, filter.q)) continue;
    matched.push({
      id: row.id,
      state,
      first: firstName(row.name),
      email_masked: maskEmail(row.email),
      slug: row.public_slug,
      created_at: formatCreatedAt(row.created_at),
    });
  }
  return matched;
}

/**
 * Render the stderr picker block for a given state. Used by sibling operator
 * scripts when their required `--student` flag is missing, so CC can surface a
 * typed list to Miura without running SQL.
 */
export async function renderCandidatesForStderr(state: PipelineState): Promise<string> {
  const rows = await listStudentsByState({ state });
  return `\nCandidates in state=${state} (${rows.length}):\n${renderTable(rows)}`;
}

async function main(): Promise<void> {
  const flags = parseFlags(flagsSchema);

  const filter: { state?: PipelineState; q?: string } = {};
  if (flags.state !== undefined) filter.state = flags.state;
  if (flags.q !== undefined) filter.q = flags.q;
  const matched = await listStudentsByState(filter);

  process.stderr.write(
    `\nStudents${flags.state ? ` (state=${flags.state})` : ""}${flags.q ? ` (q=${flags.q})` : ""}: ${matched.length} matched\n`,
  );
  process.stderr.write(renderTable(matched));
  process.stderr.write(
    "\nPick an id from the rightmost column and re-invoke the relevant skill.\n",
  );

  // stdout envelope: ids only per PII rule (no name, email, slug, whatsapp).
  const ids: string[] = matched.map((m) => m.id);
  const payload: Record<string, LogPayloadValue> = {
    count: matched.length,
    student_ids: ids,
    state_filter: flags.state ?? "",
    query: flags.q ?? "",
  };
  logDone(payload);
}

// Only run when invoked directly as a script. Importers (e.g. onboard.ts
// listing candidates on a missing flag) use the named exports above. The
// fileURLToPath compare avoids the bun-only `import.meta.main` typing.
import { fileURLToPath } from "node:url";

const invokedDirectly =
  process.argv[1] !== undefined && process.argv[1] === fileURLToPath(import.meta.url);

if (invokedDirectly) {
  main().catch((cause: unknown) => {
    const message = cause instanceof Error ? cause.message : String(cause);
    logError("unhandled", message);
  });
}

