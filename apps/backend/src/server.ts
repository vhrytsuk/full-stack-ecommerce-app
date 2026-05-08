import { app } from "./app.js";
import { env } from "./config/env.js";

app.listen(env.BACKEND_PORT, env.BACKEND_HOST, () => {
  console.log(
    `Backend listening on http://${env.BACKEND_HOST}:${env.BACKEND_PORT}${env.BACKEND_API_BASE_PATH}`,
  );
  console.log(`Uploads path: ${env.BACKEND_UPLOADS_PATH}`);
  console.log(`Public path: ${env.BACKEND_PUBLIC_PATH}`);
});
