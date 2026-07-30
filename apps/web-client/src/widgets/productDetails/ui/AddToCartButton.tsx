import { Button } from "@ui/components/button";

/**
 * Placeholder add-to-cart button for the product page. Rendering only — no cart
 * logic yet. Replace with the `features/product/addToCart` action later.
 */
export function AddToCartButton({ inStock }: { inStock: boolean }) {
  return (
    <Button
      type='button'
      size='lg'
      className='w-full sm:w-auto'
      disabled={!inStock}
    >
      {inStock ? "Add to cart" : "Out of stock"}
    </Button>
  );
}
