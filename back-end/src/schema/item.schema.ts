import { z } from "zod";

export const createItemSchema = z
  .object({
    name: z.string().min(1).max(120),
    weightGrams: z.number().int().min(0).default(0),
    category: z.enum([
      "Couchage",
      "Cuisine",
      "Electronique",
      "Photo",
      "Hygiène",
      "Nourriture",
      "Premiers secours",
      "Activité",
      "Vêtement",
      "Rangement",
      "Sac",
    ]),
    ownedQuantity: z.number().int().min(1).default(1),
  })
  .strict();
export type CreateItemInput = z.infer<typeof createItemSchema>;

export const updateItemSchema = createItemSchema.partial();
export type UpdateItemInput = z.infer<typeof updateItemSchema>;
