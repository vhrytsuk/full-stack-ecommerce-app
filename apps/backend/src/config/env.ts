import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

import { z } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  BACKEND_HOST: z.string().default("0.0.0.0"),
  BACKEND_PORT: z.coerce.number().int().positive().default(4000),
  BACKEND_API_BASE_PATH: z.string().default("/api/v1"),
  BACKEND_CORS_ORIGIN: z
    .string()
    .default("http://localhost:3000,http://localhost:5173"),
  BACKEND_UPLOADS_DIR: z.string().default("./storage/uploads"),
  BACKEND_PUBLIC_DIR: z.string().default("./public"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
});

const parsedEnv = EnvSchema.parse(process.env);
const currentDir = dirname(fileURLToPath(import.meta.url));
const repoRootDir = resolve(currentDir, "../../../..");

export const env = {
  ...parsedEnv,
  BACKEND_CORS_ORIGINS: parsedEnv.BACKEND_CORS_ORIGIN.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
  BACKEND_UPLOADS_PATH: resolve(repoRootDir, parsedEnv.BACKEND_UPLOADS_DIR),
  BACKEND_PUBLIC_PATH: resolve(repoRootDir, parsedEnv.BACKEND_PUBLIC_DIR),
};
