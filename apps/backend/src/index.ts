import cors from "cors";
import express from "express";
import helmet from "helmet";

import { healthcheckSchema } from "@repo/api-contracts";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler";
import { dbRouter } from "./modules/db/db.routes";

const app = express();
const BASE_PATH = env.BACKEND_API_BASE_PATH;

app.use(helmet());
app.use(
  cors({
    origin: env.BACKEND_CORS_ORIGINS,
  })
);
app.use(express.json());

app.get(`${BASE_PATH}/health`, (_req, res) => {
  const payload = healthcheckSchema.parse({
    status: "ok",
    service: "backend",
  });

  res.status(200).json(payload);
});

app.use(`${BASE_PATH}/db`, dbRouter);

app.use(errorHandler);

app.listen(env.BACKEND_PORT, env.BACKEND_HOST, () => {
  console.log(
    `Backend listening on http://${env.BACKEND_HOST}:${env.BACKEND_PORT}${env.BACKEND_API_BASE_PATH}`
  );
  console.log(`Uploads path: ${env.BACKEND_UPLOADS_PATH}`);
  console.log(`Public path: ${env.BACKEND_PUBLIC_PATH}`);
});
