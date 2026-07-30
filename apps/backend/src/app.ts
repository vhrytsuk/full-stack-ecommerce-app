import cookieParser from "cookie-parser";
import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";

import { healthcheckSchema } from "@repo/api-contracts";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler";
import { notFoundHandler } from "./middleware/notFoundHandler";
import { authRouter } from "./modules/auth/auth.routes";
import { dbRouter } from "./modules/db/db.routes";
import { productRoute } from "./modules/product/product.routes";
import { categoryRoute } from "./modules/category/category.routes";
import { redisRoute } from "./modules/redis/redis.route.js";

const app: Express = express();
const BASE_PATH = env.BACKEND_API_BASE_PATH;

app.use(helmet());
app.use(
  cors({
    origin: env.BACKEND_CORS_ORIGINS,
  })
);
app.use(cookieParser());
app.use(express.json());

app.get(`${BASE_PATH}/health`, (_req, res) => {
  const payload = healthcheckSchema.parse({
    status: "ok",
    service: "backend",
  });

  res.status(200).json(payload);
});

app.use(`${BASE_PATH}/redis`, redisRoute);

app.use(`${BASE_PATH}/auth`, authRouter);
app.use(`${BASE_PATH}/db`, dbRouter);
app.use(`${BASE_PATH}/products`, productRoute);
app.use(`${BASE_PATH}/categories`, categoryRoute);

app.use(notFoundHandler);
app.use(errorHandler);

export { app };
