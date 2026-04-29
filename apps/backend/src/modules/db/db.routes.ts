import { Router, type Router as ExpressRouter } from "express";

import { HTTPSTATUS } from "../../config/http.config";
import { prisma } from "../../lib/prisma";
import { asyncHandler } from "../../middleware/asyncHandler";

const dbRouter: ExpressRouter = Router();

dbRouter.get(
  "/health",
  asyncHandler(async (_req, res) => {
    const connectionCheck =
      await prisma.$queryRaw<[{ ok: number }]>`SELECT 1::int AS ok`;

    res.status(HTTPSTATUS.OK).json({
      status: connectionCheck[0]?.ok === 1 ? "ok" : "error",
      database: "postgresql",
      prisma: "ok",
      checks: {
        query: connectionCheck[0]?.ok === 1,
      },
    });
  })
);

export { dbRouter };
