import { createClient } from "redis";
import { env } from "../config/env";
import { logger } from "../config/logger";

export const redis = createClient({
  url: env.REDIS_URL,
  commandOptions: {
    timeout: env.REDIS_COMMAND_TIMEOUT_MS,
  },
  socket: {
    connectTimeout: env.REDIS_CONNECT_TIMEOUT_MS,
    reconnectStrategy: (retries) => {
      const delay = Math.min(50 * 2 ** retries, 2_000);
      return delay + Math.floor(Math.random() * 200);
    },
  },
});

redis.on("error", (error) => logger.error({ error }, "Redis error"));
redis.on("ready", () => logger.info("Redis ready"));
redis.on("reconnecting", () => logger.warn("Redis reconnecting"));

export async function connectRedis(): Promise<void> {
  if (!redis.isOpen) {
    await redis.connect();
  }
}

export async function disconnectRedis(): Promise<void> {
  if (redis.isOpen) {
    await redis.close();
  }
}
