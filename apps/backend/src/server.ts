import { app } from "./app.js";
import { env } from "./config/env.js";
import { connectRedis, disconnectRedis } from "./lib/redis.js";

// app.listen(env.BACKEND_PORT, env.BACKEND_HOST, () => {
//   console.log(
//     `Backend listening on http://${env.BACKEND_HOST}:${env.BACKEND_PORT}${env.BACKEND_API_BASE_PATH}`
//   );
//   console.log(`Uploads path: ${env.BACKEND_UPLOADS_PATH}`);
//   console.log(`Public path: ${env.BACKEND_PUBLIC_PATH}`);
// });

async function startServer(): Promise<void> {
  await connectRedis();

  const server = app.listen(env.BACKEND_PORT, env.BACKEND_HOST, () => {
    console.log(
      `Backend listening on http://${env.BACKEND_HOST}:${env.BACKEND_PORT}`
    );
    console.log(`Uploads path: ${env.BACKEND_UPLOADS_PATH}`);
    console.log(`Public path: ${env.BACKEND_PUBLIC_PATH}`);
  });

  async function shutdown(): Promise<void> {
    server.close(async (error) => {
      await disconnectRedis();
      process.exit(error ? 1 : 0);
    });
  }

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

startServer().catch((error) => {
  console.error("Backend startup failed", error);
  process.exit(1);
});
