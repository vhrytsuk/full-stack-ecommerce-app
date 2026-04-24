import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

import dotenv from "dotenv";

const rootDir = process.cwd();

for (const fileName of [".env", ".env.development"]) {
  const filePath = resolve(rootDir, fileName);

  if (existsSync(filePath)) {
    dotenv.config({
      path: filePath,
      quiet: true,
      override: true,
    });
  }
}

const appName = process.argv[2];

const commands = {
  backend: {
    args: ["--filter", "@repo/backend", "dev"],
  },
  "web-client": {
    args: [
      "--filter",
      "@repo/web-client",
      "exec",
      "next",
      "dev",
      "--hostname",
      process.env.WEB_CLIENT_HOST ?? "0.0.0.0",
      "--port",
      process.env.WEB_CLIENT_PORT ?? "3000",
    ],
  },
  "web-admin": {
    args: [
      "--filter",
      "@repo/web-admin",
      "exec",
      "vite",
      "--host",
      process.env.WEB_ADMIN_HOST ?? "0.0.0.0",
      "--port",
      process.env.WEB_ADMIN_PORT ?? "5173",
    ],
  },
};

const command = commands[appName];

if (!command) {
  console.error(`Unknown app "${appName}"`);
  process.exit(1);
}

const child = spawn("pnpm", command.args, {
  cwd: rootDir,
  env: process.env,
  stdio: "inherit",
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
