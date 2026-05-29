import { z } from "zod";

export const getProductsQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(100).default(20),
  page: z.coerce.number().int().positive().default(1),
});

export type GetProductsQueryParams = z.infer<typeof getProductsQuerySchema>;
