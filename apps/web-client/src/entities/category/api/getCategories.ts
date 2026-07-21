import "server-only";

import { cache } from "react";

import { categoriesResponseSchema, type Category } from "@repo/api-contracts";

import { parseJson, serverFetch } from "@/shared/api";

/**
 * Fetches all categories from the backend.
 *
 * Wrapped in `React.cache` so multiple callers within the same request (e.g.
 * the header menu and a page) share a single fetch. Next.js also caches the
 * underlying `fetch`, revalidating periodically.
 */
export const getCategories = cache(async (): Promise<Category[]> => {
  const response = await serverFetch("/categories", {
    auth: false,
    next: { revalidate: 300, tags: ["categories"] },
  });

  const data = await parseJson<unknown>(response);
  return categoriesResponseSchema.parse(data);
});
