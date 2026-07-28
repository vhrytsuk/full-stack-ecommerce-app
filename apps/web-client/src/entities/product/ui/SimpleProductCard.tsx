import { Button } from "@ui/components/button";

import type { SimpleProductCardData } from "../model/productTypes";
import { ProductCardShell } from "./ProductCardShell";

/**
 * Listing card for a simple product (single default variant). It can be added
 * to the cart directly, so it renders an "Add to cart" button in the footer.
 *
 * NOTE: The add-to-cart action is intentionally not wired up yet — the button
 * is a placeholder until the addToCart feature is implemented.
 */
export function SimpleProductCard({
  product,
}: {
  product: SimpleProductCardData;
}) {
  return (
    <ProductCardShell
      product={product}
      footer={
        <Button
          type='button'
          className='w-full'
          disabled={!product.inStock}
          // TODO: wire up features/product/addToCart
        >
          {product.inStock ? "Add to cart" : "Out of stock"}
        </Button>
      }
    />
  );
}
