import { mkdir, rm, writeFile } from "node:fs/promises";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { asc, desc, eq } from "drizzle-orm";
import { db } from "@/db/client";
import * as schema from "@/db/schema";
import { applications, profiles } from "@/db/schema";

const thisDir = dirname(fileURLToPath(import.meta.url));
const RUNTIME_ROOT = resolve(thisDir, "../../../../../.cruzar-runtime");

function runtimePath(studentId: string): string {
  return join(RUNTIME_ROOT, studentId);
}

interface ProfileYml {
  student_id: string;
  readiness_verdict: string;
  profile_md_version: number;
  role_matches: Array<{
    role_id: string;
    role_title: string;
    rank: number;
    rationale: string;
    comp_min_usd: number;
    comp_max_usd: number;
  }>;
}

/**
 * Generate a disposable runtime directory under `.cruzar-runtime/<studentId>/`.
 * Pure DB-to-filesystem projection: reads profiles, role_matches, roles,
 * and applications then writes:
 *   - profile.md        (the narrative SSOT from profiles.profile_md)
 *   - profile.yml       (structured data for fill-forms consumption)
 *   - data/applications.md (history of prior applications)
 *
 * Returns the absolute path to the runtime directory.
 */
export async function generateRuntimeDir(studentId: string): Promise<string> {
  const dir = runtimePath(studentId);

  // Ensure clean slate
  await rm(dir, { recursive: true, force: true }).catch(() => {});
  await mkdir(join(dir, "data"), { recursive: true });

  // Load profile
  const profileRows = await db
    .select({
      id: profiles.id,
      readiness_verdict: profiles.readiness_verdict,
      profile_md: profiles.profile_md,
      profile_md_version: profiles.profile_md_version,
    })
    .from(profiles)
    .where(eq(profiles.student_id, studentId))
    .limit(1);

  const profile = profileRows[0];
  if (!profile) {
    throw new Error(`No profile found for student ${studentId}`);
  }

  // Write profile.md (narrative SSOT)
  await writeFile(join(dir, "profile.md"), profile.profile_md, "utf-8");

  // Load role matches with role details
  const matchRows = await db
    .select({
      role_id: schema.roleMatches.role_id,
      rank: schema.roleMatches.rank,
      rationale: schema.roleMatches.rationale,
      role_title: schema.roles.title,
      comp_min_usd: schema.roles.comp_min_usd,
      comp_max_usd: schema.roles.comp_max_usd,
    })
    .from(schema.roleMatches)
    .innerJoin(schema.roles, eq(schema.roleMatches.role_id, schema.roles.id))
    .where(eq(schema.roleMatches.profile_id, profile.id))
    .orderBy(asc(schema.roleMatches.rank));

  // Write profile.yml (structured data as YAML-like plain text)
  const profileYml: ProfileYml = {
    student_id: studentId,
    readiness_verdict: profile.readiness_verdict,
    profile_md_version: profile.profile_md_version,
    role_matches: matchRows.map((m) => ({
      role_id: m.role_id,
      role_title: m.role_title,
      rank: m.rank,
      rationale: m.rationale,
      comp_min_usd: m.comp_min_usd,
      comp_max_usd: m.comp_max_usd,
    })),
  };
  await writeFile(
    join(dir, "profile.yml"),
    serializeYml(profileYml),
    "utf-8",
  );

  // Load application history
  const appRows = await db
    .select({
      company_name: applications.company_name,
      role_normalized: applications.role_normalized,
      job_url: applications.job_url,
      platform: applications.platform,
      status: applications.status,
      applied_at: applications.applied_at,
    })
    .from(applications)
    .where(eq(applications.student_id, studentId))
    .orderBy(desc(applications.created_at));

  // Write data/applications.md
  const appsMd = renderApplicationsMd(appRows);
  await writeFile(join(dir, "data", "applications.md"), appsMd, "utf-8");

  return dir;
}

/**
 * Remove the runtime directory for a student.
 * No-op if it does not exist.
 */
export async function cleanupRuntimeDir(studentId: string): Promise<void> {
  const dir = runtimePath(studentId);
  await rm(dir, { recursive: true, force: true }).catch(() => {});
}

// Simple YAML-like serializer for the profile data.
// No external dep needed; fill-forms reads this as structured text.
function serializeYml(data: ProfileYml): string {
  const lines: string[] = [];
  lines.push(`student_id: "${data.student_id}"`);
  lines.push(`readiness_verdict: "${data.readiness_verdict}"`);
  lines.push(`profile_md_version: ${data.profile_md_version}`);
  lines.push("role_matches:");
  for (const match of data.role_matches) {
    lines.push(`  - role_id: "${match.role_id}"`);
    lines.push(`    role_title: "${match.role_title}"`);
    lines.push(`    rank: ${match.rank}`);
    lines.push(`    rationale: "${match.rationale.replace(/"/g, '\\"')}"`);
    lines.push(`    comp_min_usd: ${match.comp_min_usd}`);
    lines.push(`    comp_max_usd: ${match.comp_max_usd}`);
  }
  return lines.join("\n") + "\n";
}

interface AppRow {
  company_name: string;
  role_normalized: string;
  job_url: string;
  platform: string;
  status: string;
  applied_at: Date | null;
}

function renderApplicationsMd(rows: AppRow[]): string {
  if (rows.length === 0) {
    return "# Applications\n\nNo prior applications.\n";
  }

  const lines: string[] = ["# Applications", ""];
  for (const row of rows) {
    const appliedStr = row.applied_at
      ? row.applied_at.toISOString().split("T")[0]
      : "pending";
    lines.push(
      `- **${row.company_name}** | ${row.role_normalized} | ${row.platform} | ${row.status} | ${appliedStr} | ${row.job_url}`,
    );
  }
  return lines.join("\n") + "\n";
}
