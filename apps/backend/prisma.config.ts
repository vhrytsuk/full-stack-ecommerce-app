import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import dotenv from "dotenv";
import { defineConfig, env } from "prisma/config";

const currentDir = dirname(fileURLToPath(import.meta.url));
const repoRootDir = resolve(currentDir, "../..");

for (const fileName of [".env", ".env.development"]) {
  const filePath = resolve(repoRootDir, fileName);

  if (existsSync(filePath)) {
    dotenv.config({
      path: filePath,
      quiet: true,
      override: true,
    });
  }
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
