import Link from "next/link";

import { Button } from "@ui/components/button";
import { Badge } from "@ui/components/badge";

import type { ConfigurableProductCardData } from "../model/productTypes";
import { ProductCardShell } from "./ProductCardShell";

/**
 * Listing card for a configurable product (has option types such as Size or
 * Color). The customer must choose a variant on the product page before adding
 * to the cart, so the footer surfaces the available options and a "Choose
 * options" link instead of a direct add-to-cart button.
 */
export function ConfigurableProductCard({
  product,
}: {
  product: ConfigurableProductCardData;
}) {
  return (
    <ProductCardShell
      product={product}
      footer={
        <div className='flex w-full flex-col gap-2 py-2'>
          {product.optionTypes.length > 0 ? (
            <div className='flex flex-wrap gap-1'>
              {product.optionTypes.map((optionType) => (
                <Badge key={optionType} variant='outline'>
                  {optionType}
                </Badge>
              ))}
            </div>
          ) : null}

          <Button
            asChild
            variant='outline'
            className='w-full'
            aria-disabled={!product.inStock}
          >
            <Link href={`/products/${product.slug}`}>
              {product.inStock ? "Choose options" : "Out of stock"}
            </Link>
          </Button>
        </div>
      }
    />
  );
}
