"use client";

import { cn } from "@ui/lib/utils";

import type { ProductDetail } from "@/entities/product";

import { useSelectVariant } from "../model/selectVariantContext";

/**
 * Interactive selector for a configurable product's options. Each value is a
 * button that updates the shared variant selection. Purely selection UI — it
 * does not add anything to the cart.
 */
export function VariantSelector({
  optionTypes,
}: {
  optionTypes: ProductDetail["optionTypes"];
}) {
  const { selections, selectOption } = useSelectVariant();

  if (optionTypes.length === 0) {
    return null;
  }

  return (
    <div className='flex flex-col gap-4'>
      {optionTypes.map((optionType) => {
        const selectedValue = selections[optionType.name];

        return (
          <div key={optionType.id} className='flex flex-col gap-2'>
            <span className='text-sm font-medium text-foreground'>
              {optionType.name}
              {selectedValue ? (
                <span className='ml-1 text-muted-foreground'>
                  {selectedValue}
                </span>
              ) : null}
            </span>

            <div
              role='radiogroup'
              aria-label={optionType.name}
              className='flex flex-wrap gap-2'
            >
              {optionType.values.map((value) => {
                const isSelected = selectedValue === value.value;

                return (
                  <button
                    key={value.id}
                    type='button'
                    role='radio'
                    aria-checked={isSelected}
                    onClick={() => selectOption(optionType.name, value.value)}
                    className={cn(
                      "inline-flex h-9 min-w-9 items-center justify-center rounded-lg border px-3 text-sm transition-colors",
                      isSelected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-foreground hover:border-foreground/40"
                    )}
                  >
                    {value.value}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
