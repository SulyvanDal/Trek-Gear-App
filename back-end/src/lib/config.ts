import { configSchema } from "../schema/config.schema.ts";

export const config = configSchema.parse(process.env);