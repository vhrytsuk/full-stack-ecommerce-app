import Image from "next/image";

import { cn } from "@ui/lib/utils";

import type { ProductCardImage } from "../model/productTypes";

/**
 * Square product image with a graceful fallback when no image is available.
 * Owned by the product entity so every card/detail view renders images the
 * same way.
 */
export function ProductImage({
  image,
  name,
  className,
  sizes = "(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw",
}: {
  image: ProductCardImage | null;
  name: string;
  className?: string;
  sizes?: string;
}) {
  return (
    <div
      className={cn(
        "relative aspect-square w-full overflow-hidden bg-muted",
        className
      )}
    >
      {image ? (
        <Image
          src={image.url}
          alt={image.altText ?? name}
          fill
          sizes={sizes}
          className='object-cover transition-transform duration-300 group-hover/card:scale-105'
        />
      ) : (
        <div className='flex h-full w-full items-center justify-center text-xs text-muted-foreground'>
          No image
        </div>
      )}
    </div>
  );
}
