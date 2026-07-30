import type { ProductDetail } from "../model/productTypes";

/**
 * Read-only display of a configurable product's option types and their
 * available values (e.g. Size: S, M, L). Selection/validation belongs to a
 * feature (`features/product/selectVariant`) and is intentionally not wired
 * here — this only presents what options exist.
 */
export function ProductOptions({
  optionTypes,
}: {
  optionTypes: ProductDetail["optionTypes"];
}) {
  if (optionTypes.length === 0) {
    return null;
  }

  return (
    <div className='flex flex-col gap-4'>
      {optionTypes.map((optionType) => (
        <div key={optionType.id} className='flex flex-col gap-2'>
          <span className='text-sm font-medium text-foreground'>
            {optionType.name}
          </span>
          <div className='flex flex-wrap gap-2'>
            {optionType.values.map((value) => (
              <span
                key={value.id}
                className='inline-flex h-9 min-w-9 items-center justify-center rounded-lg border border-border bg-background px-3 text-sm text-foreground'
              >
                {value.value}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
