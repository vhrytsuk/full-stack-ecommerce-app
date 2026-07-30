import type { ProductCard } from "@repo/api-contracts";
import type { Prisma } from "../../generated/prisma-client/client";

const DEFAULT_CURRENCY = "USD";

/**
 * The category → products query shape. Kept in sync with
 * `CategoryRepository.getCategoryBySlug`'s `include`.
 */
export type CategoryProductWithRelations = Prisma.ProductGetPayload<{
  include: {
    images: true;
    optionTypes: true;
    variants: true;
  };
}>;

/**
 * Maps a persisted product (with its images, option types, and variants) to the
 * denormalized listing-card shape.
 *
 * A product is `configurable` when it has option types (Size, Color, …) and the
 * customer must pick a variant before buying; otherwise it is `simple` and can
 * be added to the cart directly via its default variant.
 */
export const mapProductToCard = (
  product: CategoryProductWithRelations
): ProductCard => {
  const isConfigurable = product.optionTypes.length > 0;

  const prices = product.variants.map((variant) => Number(variant.price));
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

  const defaultVariant =
    product.variants.find((variant) => variant.isDefault) ??
    product.variants[0] ??
    null;

  // Only surface a "was" price for single-price (non-ranged) products.
  const compareAtPrice =
    !isConfigurable && defaultVariant?.comparePrice != null
      ? defaultVariant.comparePrice.toString()
      : null;

  const inStock = product.variants.some(
    (variant) => !variant.trackStock || variant.stock > 0
  );

  const primaryImage = product.images[0] ?? null;

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    kind: isConfigurable ? "configurable" : "simple",
    image: primaryImage
      ? { url: primaryImage.url, altText: primaryImage.altText }
      : null,
    minPrice: minPrice.toFixed(2),
    maxPrice: maxPrice.toFixed(2),
    compareAtPrice,
    currency: DEFAULT_CURRENCY,
    optionTypes: product.optionTypes.map((optionType) => optionType.name),
    inStock,
    defaultVariantId: isConfigurable ? null : defaultVariant?.id ?? null,
  };
};
