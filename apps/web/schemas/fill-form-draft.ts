import { z } from "zod";
import { fillFormDraftStateSchema } from "./_shared";

export const fillFormMissedFieldSchema = z.object({
  key: z.string(),
  label: z.string(),
});
export type FillFormMissedField = z.infer<typeof fillFormMissedFieldSchema>;

export const fillFormNeedsHumanSchema = z.object({
  key: z.string(),
  label: z.string(),
  reason: z.string(),
});
export type FillFormNeedsHuman = z.infer<typeof fillFormNeedsHumanSchema>;

export const fillFormDraftSchema = z.object({
  id: z.uuid(),
  application_id: z.uuid(),
  screenshot_r2_keys_jsonb: z.array(z.string()),
  missed_fields_jsonb: z.array(fillFormMissedFieldSchema),
  needs_human_jsonb: z.array(fillFormNeedsHumanSchema),
  state: fillFormDraftStateSchema,
  created_at: z.iso.datetime(),
});
export type FillFormDraft = z.infer<typeof fillFormDraftSchema>;
