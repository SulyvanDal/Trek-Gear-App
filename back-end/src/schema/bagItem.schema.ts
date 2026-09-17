import { z } from "zod";

export const addBagItemSchema = z
  .object({
    itemId: z.number().int().min(1),
    bagQuantity: z.number().int().min(1).default(1),
    isRequired: z.boolean().default(false),
  })
  .strict();
export type AddBagItemInput = z.infer<typeof addBagItemSchema>;

export type BagItemLine = {
  itemId: number;
  name: string;
  category: string;
  isRequired: boolean;
  quantity: number;
  weightGrams: number;
};

export const updateBagItemSchema = z.object({
  bagQuantity : z.number().int().min(1).optional(),
  isRequired : z.boolean().optional(),
}).strict();
export type UpdateBagItemInput = z.infer<typeof updateBagItemSchema>
