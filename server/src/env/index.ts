import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  SERVER_PORT: z.coerce.number().default(3333),
  SERVER_HOST: z.string().default("0.0.0.0"),
  SERVER_SECRET: z.string(),
  DATABASE_URL: z.string(),
  GITHUB_CLIENT_ID: z.string(),
  GITHUB_CLIENT_SECRET: z.string(),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error(_env.error.format());
  throw new Error("Invalid environment variables.");
}

export const env = _env.data;