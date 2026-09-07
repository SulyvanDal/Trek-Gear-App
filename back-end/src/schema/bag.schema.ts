import { z } from "zod";

export const createBagSchema = z
  .object({
    name: z.string().min(1).max(120),
  })
  .strict();
export type CreateBagInput = z.infer<typeof createBagSchema>;

export const updateBagSchema = createBagSchema.partial();
export type UpdateBagInput = z.infer<typeof updateBagSchema>;
