import cors from "cors";
import express from "express";
import helmet from "helmet";

import { healthcheckSchema } from "@repo/api-contracts";
import { env } from "./config/env.js";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.BACKEND_CORS_ORIGINS,
  }),
);
app.use(express.json());

app.get(`${env.BACKEND_API_BASE_PATH}/health`, (_req, res) => {
  const payload = healthcheckSchema.parse({
    status: "ok",
    service: "backend",
  });

  res.status(200).json(payload);
});

app.listen(env.BACKEND_PORT, env.BACKEND_HOST, () => {
  console.log(
    `Backend listening on http://${env.BACKEND_HOST}:${env.BACKEND_PORT}${env.BACKEND_API_BASE_PATH}`,
  );
  console.log(`Uploads path: ${env.BACKEND_UPLOADS_PATH}`);
  console.log(`Public path: ${env.BACKEND_PUBLIC_PATH}`);
});
