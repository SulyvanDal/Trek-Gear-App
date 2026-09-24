import { z } from "zod";

export const loginSchema = z
  .object({
    email: z.email(),
    password: z.string().min(4),
  })
  .strict();
export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  email: z.email(),
  password: z.string().min(4),
}).strict();
export type RegisterInput = z.infer<typeof registerSchema>