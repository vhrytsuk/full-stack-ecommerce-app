import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import dotenv from "dotenv";
import { defineConfig, env } from "prisma/config";

const currentDir = dirname(fileURLToPath(import.meta.url));
const repoRootDir = resolve(currentDir, "../..");

const envFromFiles: Record<string, string> = {};

for (const fileName of [".env", ".env.development"]) {
  const filePath = resolve(repoRootDir, fileName);

  if (existsSync(filePath)) {
    Object.assign(envFromFiles, dotenv.parse(readFileSync(filePath)));
  }
}

for (const [key, value] of Object.entries(envFromFiles)) {
  process.env[key] ??= value;
}

export default defineConfig({
  schema: "prisma",
  migrations: {
    path: "prisma/migrations",
    // seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
