import { z } from "zod";

export const roleMatchSchema = z.object({
  id: z.uuid(),
  profile_id: z.uuid(),
  role_id: z.uuid(),
  rank: z.number().int().min(1).max(3),
  rationale: z.string().min(1),
});
export type RoleMatch = z.infer<typeof roleMatchSchema>;
