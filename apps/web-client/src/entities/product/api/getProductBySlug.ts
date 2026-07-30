import "server-only";

import { cache } from "react";

import {
  productDetailSchema,
  type GetProductBySlugResponse,
} from "@repo/api-contracts";

import { parseJson, serverFetch } from "@/shared/api";

/**
 * Fetches a single product's full detail by slug. Returns `null` when no
 * product matches the slug (backend responds 404).
 */
export const getProductBySlug = cache(
  async (slug: string): Promise<GetProductBySlugResponse | null> => {
    const response = await serverFetch(
      `/products/slug/${encodeURIComponent(slug)}`,
      {
        auth: false,
        next: { revalidate: 60, tags: [`product:${slug}`] },
      }
    );

    if (response.status === 404) return null;

    const data = await parseJson<unknown>(response);

    return productDetailSchema.parse(data);
  }
);
