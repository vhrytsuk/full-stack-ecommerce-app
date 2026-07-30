import type { ProductDetail, ProductVariant } from "@/entities/product";

/** Map of option type name (e.g. "Size") to the chosen value (e.g. "M"). */
export type OptionSelections = Record<string, string>;

/**
 * Finds the variant whose options exactly match the current selections. Returns
 * `null` until every option type has a selected value that resolves to a real
 * variant.
 */
export function findMatchingVariant(
  product: Pick<ProductDetail, "optionTypes" | "variants">,
  selections: OptionSelections
): ProductVariant | null {
  const optionTypeNames = product.optionTypes.map(
    (optionType) => optionType.name
  );

  const allSelected = optionTypeNames.every((name) =>
    Boolean(selections[name])
  );

  if (!allSelected) {
    return null;
  }

  return (
    product.variants.find((variant) => {
      const variantSelections: OptionSelections = Object.fromEntries(
        variant.options.map((option) => [
          option.optionValue.optionType.name,
          option.optionValue.value,
        ])
      );

      return optionTypeNames.every(
        (name) => variantSelections[name] === selections[name]
      );
    }) ?? null
  );
}
