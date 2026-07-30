"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@ui/lib/utils";
import { Button } from "@ui/components/button";

export type GalleryImage = {
  id: string;
  url: string;
  altText: string | null;
};

/**
 * Client-side product image gallery with a large main image, prev/next
 * carousel controls, and a thumbnail strip. Selection state is local — this is
 * a display-only component (no cart/business logic).
 */
export function ProductGallery({
  images,
  productName,
}: {
  images: GalleryImage[];
  productName: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className='flex aspect-square w-full items-center justify-center rounded-xl bg-muted text-sm text-muted-foreground'>
        No image
      </div>
    );
  }

  const activeImage = images[Math.min(activeIndex, images.length - 1)]!;
  const hasMultiple = images.length > 1;

  const goTo = (index: number) => {
    const count = images.length;
    setActiveIndex(((index % count) + count) % count);
  };

  return (
    <div className='flex flex-col gap-4'>
      <div className='group relative aspect-square w-full overflow-hidden rounded-xl bg-muted'>
        <Image
          key={activeImage.id}
          src={activeImage.url}
          alt={activeImage.altText ?? productName}
          fill
          priority
          sizes='(min-width: 1024px) 50vw, 100vw'
          className='object-cover'
        />

        {hasMultiple ? (
          <>
            <Button
              type='button'
              variant='outline'
              size='icon'
              aria-label='Previous image'
              onClick={() => goTo(activeIndex - 1)}
              className='absolute top-1/2 left-2 -translate-y-1/2 rounded-full bg-background/80 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100'
            >
              <ChevronLeft />
            </Button>
            <Button
              type='button'
              variant='outline'
              size='icon'
              aria-label='Next image'
              onClick={() => goTo(activeIndex + 1)}
              className='absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-background/80 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100'
            >
              <ChevronRight />
            </Button>
          </>
        ) : null}
      </div>

      {hasMultiple ? (
        <ul className='flex flex-wrap gap-2'>
          {images.map((image, index) => (
            <li key={image.id}>
              <button
                type='button'
                aria-label={`View image ${index + 1}`}
                aria-current={index === activeIndex}
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "relative size-16 overflow-hidden rounded-lg ring-1 ring-foreground/10 transition-all",
                  index === activeIndex
                    ? "ring-2 ring-primary"
                    : "hover:ring-foreground/30"
                )}
              >
                <Image
                  src={image.url}
                  alt={image.altText ?? productName}
                  fill
                  sizes='64px'
                  className='object-cover'
                />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
