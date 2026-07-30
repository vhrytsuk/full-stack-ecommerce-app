"use client";

import { createContext, useContext } from "react";

import type { ProductVariant } from "@/entities/product";

import type { OptionSelections } from "../lib/findMatchingVariant";

export type SelectVariantContextValue = {
  /** Current option selections, keyed by option type name. */
  selections: OptionSelections;
  /** Select a value for one option type. */
  selectOption: (optionTypeName: string, value: string) => void;
  /** The variant matching the current selections, or `null` if incomplete. */
  selectedVariant: ProductVariant | null;
  /** True when every option type has a selected value that resolves a variant. */
  isComplete: boolean;
};

export const SelectVariantContext =
  createContext<SelectVariantContextValue | null>(null);

/**
 * Reads the current variant selection. Must be used inside a
 * `SelectVariantProvider`.
 */
export function useSelectVariant(): SelectVariantContextValue {
  const context = useContext(SelectVariantContext);

  if (!context) {
    throw new Error(
      "useSelectVariant must be used within a SelectVariantProvider"
    );
  }

  return context;
}
