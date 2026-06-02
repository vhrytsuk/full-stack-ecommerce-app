import { z } from "zod";

export const getCategoryBySlugParamsSchema = z.object({
  slug: z.string().trim().min(1, "Category slug is required"),
});

export type GetCategoryBySlugParams = z.infer<
  typeof getCategoryBySlugParamsSchema
>;
