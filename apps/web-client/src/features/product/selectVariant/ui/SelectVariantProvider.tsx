"use client";

import { useMemo, useState, type PropsWithChildren } from "react";

import type { ProductDetail } from "@/entities/product";

import {
  findMatchingVariant,
  type OptionSelections,
} from "../lib/findMatchingVariant";
import {
  SelectVariantContext,
  type SelectVariantContextValue,
} from "../model/selectVariantContext";

/**
 * Holds the customer's variant selection for a single product and shares it
 * with any interested UI (the option selector and the add-to-cart button).
 *
 * For simple products (no option types) the default variant is resolved
 * immediately, so `isComplete` is `true` from the start.
 */
export function SelectVariantProvider({
  product,
  children,
}: PropsWithChildren<{ product: ProductDetail }>) {
  const [selections, setSelections] = useState<OptionSelections>({});

  const value = useMemo<SelectVariantContextValue>(() => {
    const isSimple = product.optionTypes.length === 0;

    const defaultVariant =
      product.variants.find((variant) => variant.isDefault) ??
      product.variants[0] ??
      null;

    const selectedVariant = isSimple
      ? defaultVariant
      : findMatchingVariant(product, selections);

    return {
      selections,
      selectOption: (optionTypeName, optionValue) =>
        setSelections((prev) => ({ ...prev, [optionTypeName]: optionValue })),
      selectedVariant,
      isComplete: selectedVariant !== null,
    };
  }, [product, selections]);

  return (
    <SelectVariantContext.Provider value={value}>
      {children}
    </SelectVariantContext.Provider>
  );
}
