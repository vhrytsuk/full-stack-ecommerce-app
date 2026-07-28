import type { ReactNode } from "react";
import Link from "next/link";

import { Card, CardContent, CardFooter } from "@ui/components/card";
import { Badge } from "@ui/components/badge";
import { cn } from "@ui/lib/utils";

import type { ProductCard } from "../model/productTypes";
import { ProductImage } from "./ProductImage";
import { ProductPrice } from "./ProductPrice";

/**
 * Shared visual layout for product listing cards. Renders the image, name,
 * price, and an out-of-stock badge, and exposes a `footer` slot for the
 * variant-specific action area (add-to-cart button or option selector).
 *
 * The simple and configurable cards compose this shell so the two stay visually
 * consistent while owning their own footer behavior.
 */
export function ProductCardShell({
  product,
  footer,
  className,
}: {
  product: ProductCard;
  footer?: ReactNode;
  className?: string;
}) {
  const productHref = `/products/${product.slug}`;

  return (
    <Card className={cn("h-full", className)}>
      <Link
        href={productHref}
        className='block focus-visible:outline-none'
        aria-label={product.name}
      >
        <div className='relative'>
          <ProductImage image={product.image} name={product.name} />
          {!product.inStock ? (
            <Badge
              variant='secondary'
              className='absolute top-2 left-2 bg-background/90'
            >
              Out of stock
            </Badge>
          ) : null}
        </div>
      </Link>

      <CardContent className='flex flex-1 flex-col gap-2'>
        <Link
          href={productHref}
          className='line-clamp-2 font-medium text-foreground hover:underline focus-visible:underline focus-visible:outline-none'
        >
          {product.name}
        </Link>

        <ProductPrice
          minPrice={product.minPrice}
          maxPrice={product.maxPrice}
          compareAtPrice={product.compareAtPrice}
          currency={product.currency}
          className='mt-auto'
        />
      </CardContent>

      {footer ? <CardFooter className='pt-0 py-2'>{footer}</CardFooter> : null}
    </Card>
  );
}
