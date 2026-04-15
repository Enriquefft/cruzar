// Role catalog seed. Voice-first remote roles targeting B2+ talent with 1-3yr
// experience per product/cruzar/mvp-0.md §User line 8. Compensation values are
// placeholder LatAm remote ranges — to be curated in Phase 1.
// Idempotent on `roles.title` via `onConflictDoNothing`.

import { db } from "./client";
import { roles } from "./schema";

const catalog = [
  {
    title: "SDR — Inbound",
    comp_min_usd: 16_000,
    comp_max_usd: 32_000,
    english_level: "B2" as const,
    skills_jsonb: ["discovery calls", "CRM hygiene", "qualification", "spoken english"],
    employer_type: "startup" as const,
    entry_level: true,
  },
  {
    title: "SDR — Outbound",
    comp_min_usd: 18_000,
    comp_max_usd: 36_000,
    english_level: "B2" as const,
    skills_jsonb: ["cold outreach", "prospecting", "CRM hygiene", "spoken english"],
    employer_type: "startup" as const,
    entry_level: true,
  },
  {
    title: "Customer Support L1",
    comp_min_usd: 12_000,
    comp_max_usd: 22_000,
    english_level: "B2" as const,
    skills_jsonb: ["written english", "Zendesk/Intercom", "empathy", "triage"],
    employer_type: "smb" as const,
    entry_level: true,
  },
  {
    title: "Customer Support L2",
    comp_min_usd: 18_000,
    comp_max_usd: 32_000,
    english_level: "B2" as const,
    skills_jsonb: ["troubleshooting", "written english", "spoken english", "escalation"],
    employer_type: "smb" as const,
    entry_level: false,
  },
  {
    title: "Account Manager — SMB",
    comp_min_usd: 22_000,
    comp_max_usd: 42_000,
    english_level: "B2" as const,
    skills_jsonb: ["renewals", "expansion", "spoken english", "stakeholder management"],
    employer_type: "smb" as const,
    entry_level: false,
  },
  {
    title: "Executive Assistant",
    comp_min_usd: 14_000,
    comp_max_usd: 28_000,
    english_level: "B2" as const,
    skills_jsonb: ["calendar management", "inbox triage", "travel planning", "discretion"],
    employer_type: "startup" as const,
    entry_level: true,
  },
  {
    title: "Digital Marketing Coordinator",
    comp_min_usd: 16_000,
    comp_max_usd: 32_000,
    english_level: "B2" as const,
    skills_jsonb: ["content calendars", "email marketing", "analytics", "written english"],
    employer_type: "smb" as const,
    entry_level: true,
  },
  {
    title: "Content Ops Coordinator",
    comp_min_usd: 16_000,
    comp_max_usd: 30_000,
    english_level: "B2" as const,
    skills_jsonb: ["CMS workflows", "editorial QA", "written english", "asset handoff"],
    employer_type: "startup" as const,
    entry_level: true,
  },
  {
    title: "Community Manager",
    comp_min_usd: 18_000,
    comp_max_usd: 34_000,
    english_level: "B2" as const,
    skills_jsonb: ["Discord/Slack ops", "written english", "events", "moderation"],
    employer_type: "startup" as const,
    entry_level: true,
  },
  {
    title: "Virtual Assistant — Operations",
    comp_min_usd: 10_000,
    comp_max_usd: 22_000,
    english_level: "B2" as const,
    skills_jsonb: ["calendar management", "data entry", "written english", "async comms"],
    employer_type: "smb" as const,
    entry_level: true,
  },
];

async function main(): Promise<void> {
  const inserted = await db
    .insert(roles)
    .values(catalog)
    .onConflictDoNothing({ target: roles.title })
    .returning({ id: roles.id, title: roles.title });

  console.log(`Seeded ${inserted.length} new role rows. Catalog size: ${catalog.length}.`);
}

main()
  .then(() => process.exit(0))
  .catch((err: unknown) => {
    console.error("seed failed:", err);
    process.exit(1);
  });
