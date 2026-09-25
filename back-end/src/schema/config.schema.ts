import z from "zod";

export const configSchema = z.object({
    JWT_SECRET : z.string().min(1),
    DATABASE_URL : z.string().min(1),
    PORT : z.coerce.number().min(1),
    FRONTEND_URL : z.url()
})

export type Config = z.infer<typeof configSchema>;