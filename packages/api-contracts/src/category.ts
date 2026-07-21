import { z } from "zod";

import { categorySchema } from "./product.js";

export const getCategoryBySlugParamsSchema = z.object({
  slug: z.string().trim().min(1, "Category slug is required"),
});

export type GetCategoryBySlugParams = z.infer<
  typeof getCategoryBySlugParamsSchema
>;

export const categoriesResponseSchema = z.array(categorySchema);

export type Category = z.infer<typeof categorySchema>;
export type CategoriesResponse = z.infer<typeof categoriesResponseSchema>;
