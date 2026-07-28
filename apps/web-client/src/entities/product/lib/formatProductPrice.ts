/**
 * Formats a decimal-string amount (e.g. "19.99") into a localized currency
 * string. Falls back to a plain formatted number if the currency code is not
 * recognized by `Intl.NumberFormat`.
 */
export function formatPrice(
  amount: string,
  currency: string,
  locale?: string
): string {
  const value = Number(amount);
  const safeValue = Number.isFinite(value) ? value : 0;

  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
    }).format(safeValue);
  } catch {
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(safeValue);
  }
}

/**
 * Formats a product's price for a listing card. When the min and max prices
 * differ (configurable products with variant-specific pricing) it renders a
 * range like "From $19.99"; otherwise a single price.
 */
export function formatPriceRange(
  minPrice: string,
  maxPrice: string,
  currency: string,
  locale?: string
): string {
  const min = formatPrice(minPrice, currency, locale);

  if (minPrice === maxPrice) {
    return min;
  }

  return `From ${min}`;
}
