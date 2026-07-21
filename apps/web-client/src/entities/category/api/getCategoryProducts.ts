import "server-only";

import { cache } from "react";

import { parseJson, serverFetch } from "@/shared/api";

/**
 * Fetches the products that belong to a category by slug.
 *
 * The backend currently returns raw product records, so the shape is kept
 * loose (`unknown[]`) until a product response contract exists in
 * `@repo/api-contracts`. Returns `null` when the category is not found.
 */
export const getCategoryProducts = cache(
  async (slug: string): Promise<unknown[] | null> => {
    const response = await serverFetch(
      `/categories/${encodeURIComponent(slug)}/products`,
      {
        auth: false,
        next: { revalidate: 60, tags: [`category:${slug}:products`] },
      }
    );

    if (response.status === 404) return null;

    return parseJson<unknown[]>(response);
  }
);
