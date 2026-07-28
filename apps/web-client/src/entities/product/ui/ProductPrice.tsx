import { cn } from "@ui/lib/utils";

import { formatPrice, formatPriceRange } from "../lib/formatProductPrice";

/**
 * Displays a product's price for a listing card. Renders a price range ("From
 * $19.99") when min/max differ, and a crossed-out compare-at price when the
 * product is discounted.
 */
export function ProductPrice({
  minPrice,
  maxPrice,
  compareAtPrice,
  currency,
  className,
}: {
  minPrice: string;
  maxPrice: string;
  compareAtPrice?: string | null;
  currency: string;
  className?: string;
}) {
  const priceLabel = formatPriceRange(minPrice, maxPrice, currency);
  const isSinglePrice = minPrice === maxPrice;
  const showCompareAt =
    isSinglePrice &&
    compareAtPrice != null &&
    Number(compareAtPrice) > Number(minPrice);

  return (
    <div className={cn("flex items-baseline gap-2", className)}>
      <span className='font-semibold text-foreground'>{priceLabel}</span>
      {showCompareAt ? (
        <span className='text-sm text-muted-foreground line-through'>
          {formatPrice(compareAtPrice, currency)}
        </span>
      ) : null}
    </div>
  );
}
