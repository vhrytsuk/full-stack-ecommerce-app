import "server-only";

import { cache } from "react";

import {
  categoryProductsResponseSchema,
  type CategoryProductsResponse,
} from "@repo/api-contracts";

import { parseJson, serverFetch } from "@/shared/api";

/**
 * Fetches the products that belong to a category by slug, shaped as listing
 * cards (`ProductCard[]`). Returns `null` when the category is not found.
 */
export const getCategoryProducts = cache(
  async (slug: string): Promise<CategoryProductsResponse | null> => {
    const response = await serverFetch(
      `/categories/${encodeURIComponent(slug)}/products`,
      {
        auth: false,
        next: { revalidate: 60, tags: [`category:${slug}:products`] },
      }
    );

    if (response.status === 404) return null;

    const data = await parseJson<unknown>(response);

    return categoryProductsResponseSchema.parse(data);
  }
);
