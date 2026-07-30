import { z } from "zod";

import { categorySchema, productCardSchema } from "./product.js";

export const getCategoryBySlugParamsSchema = z.object({
  slug: z.string().trim().min(1, "Category slug is required"),
});

export type GetCategoryBySlugParams = z.infer<
  typeof getCategoryBySlugParamsSchema
>;

export const categoriesResponseSchema = z.array(categorySchema);

export type Category = z.infer<typeof categorySchema>;
export type CategoriesResponse = z.infer<typeof categoriesResponseSchema>;

/** Products belonging to a category, shaped for listing cards. */
export const categoryProductsResponseSchema = z.array(productCardSchema);

export type CategoryProductsResponse = z.infer<
  typeof categoryProductsResponseSchema
>;
