import { z } from "zod";

export const healthcheckSchema = z.object({
  status: z.literal("ok"),
  service: z.string().min(1),
});

export type Healthcheck = z.infer<typeof healthcheckSchema>;
