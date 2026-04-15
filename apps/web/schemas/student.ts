import { z } from "zod";

// `id` is `string` (not `uuid`) because it FKs to Better Auth's `user.id`, which
// is `text`. All student-scoped FKs in the other entities must also use `string`.
export const studentSchema = z.object({
  id: z.string().min(1),
  email: z.email(),
  name: z.string().min(1),
  whatsapp: z.string().min(5),
  local_salary_usd: z.number().int().positive().optional(),
  consent_public_profile: z.boolean(),
  public_slug: z.string().min(3),
  onboarded_at: z.iso.datetime().optional(),
  created_at: z.iso.datetime(),
});
export type Student = z.infer<typeof studentSchema>;
