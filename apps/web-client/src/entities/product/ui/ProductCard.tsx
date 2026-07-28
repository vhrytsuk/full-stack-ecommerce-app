import type { ProductCard as ProductCardData } from "../model/productTypes";
import { isSimpleProductCard } from "../model/productTypes";
import { SimpleProductCard } from "./SimpleProductCard";
import { ConfigurableProductCard } from "./ConfigurableProductCard";

/**
 * Renders the correct listing card for a product based on its `kind`. Use this
 * when a list contains a mix of simple and configurable products.
 */
export function ProductCard({ product }: { product: ProductCardData }) {
  return isSimpleProductCard(product) ? (
    <SimpleProductCard product={product} />
  ) : (
    <ConfigurableProductCard product={{ ...product, kind: "configurable" }} />
  );
}
