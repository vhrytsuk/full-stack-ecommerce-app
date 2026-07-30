import type { ProductCard, ProductCardKind } from "@repo/api-contracts";

export type {
  ProductCard,
  ProductCardKind,
  ProductCardImage,
  ProductDetail,
  ProductVariant,
} from "@repo/api-contracts";

/**
 * Narrowed `ProductCard` for products sold as a single default variant. These
 * can be added to the cart directly from a listing.
 */
export type SimpleProductCardData = ProductCard & {
  kind: Extract<ProductCardKind, "simple">;
};

/**
 * Narrowed `ProductCard` for products with option types (e.g. Size, Color).
 * The customer must pick a variant on the product page before adding to cart.
 */
export type ConfigurableProductCardData = ProductCard & {
  kind: Extract<ProductCardKind, "configurable">;
};

export function isSimpleProductCard(
  product: ProductCard
): product is SimpleProductCardData {
  return product.kind === "simple";
}

export function isConfigurableProductCard(
  product: ProductCard
): product is ConfigurableProductCardData {
  return product.kind === "configurable";
}
