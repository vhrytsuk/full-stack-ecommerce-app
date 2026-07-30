import { Router, type Router as ExpressRouter } from "express";

import { redis } from "../../lib/redis.js";

const redisRoute: ExpressRouter = Router();

redisRoute.get("/redis-health", async (_req, res, next) => {
  try {
    const response = await redis.ping();

    res.json({
      status: response === "PONG" ? "ok" : "error",
    });
  } catch (error) {
    next(error);
  }
});

export { redisRoute };
