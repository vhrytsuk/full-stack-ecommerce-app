"use client";

import { Button } from "@ui/components/button";

import { useSelectVariant } from "@/features/product/selectVariant";

/**
 * Add-to-cart trigger for the product page. It is only enabled once a complete
 * variant is selected (and in stock).
 *
 * NOTE: The actual cart mutation is not implemented yet — clicking is a no-op
 * placeholder until the cart API exists.
 */
export function AddToCartButton() {
  const { selectedVariant, isComplete } = useSelectVariant();

  const outOfStock =
    selectedVariant != null &&
    selectedVariant.trackStock &&
    selectedVariant.stock <= 0;

  const disabled = !isComplete || outOfStock;

  const label = outOfStock
    ? "Out of stock"
    : isComplete
    ? "Add to cart"
    : "Select options";

  return (
    <Button
      type='button'
      size='lg'
      className='w-full sm:w-auto'
      disabled={disabled}
      // TODO: wire up the cart mutation once the cart API exists.
    >
      {label}
    </Button>
  );
}
