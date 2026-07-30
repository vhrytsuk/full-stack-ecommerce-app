import {
  ProductGallery,
  ProductPrice,
  type ProductDetail,
} from "@/entities/product";
import {
  SelectVariantProvider,
  VariantSelector,
} from "@/features/product/selectVariant";
import { AddToCartButton } from "@/features/product/addToCart";

const DEFAULT_CURRENCY = "USD";

function getPricerange(product: ProductDetail) {
  const prices = product.variants.map((variant) => Number(variant.price));
  const min = prices.length > 0 ? Math.min(...prices) : 0;
  const max = prices.length > 0 ? Math.max(...prices) : 0;

  return { minPrice: min.toFixed(2), maxPrice: max.toFixed(2) };
}

/**
 * Product detail layout: image gallery on the left, and title, price,
 * description, options, and the add-to-cart action on the right.
 *
 * This is a display-only widget — the add-to-cart button is a placeholder until
 * the cart feature exists.
 */
export function ProductDetails({ product }: { product: ProductDetail }) {
  const { minPrice, maxPrice } = getPricerange(product);
  const defaultVariant =
    product.variants.find((variant) => variant.isDefault) ??
    product.variants[0] ??
    null;

  const compareAtPrice =
    product.optionTypes.length === 0
      ? defaultVariant?.comparePrice ?? null
      : null;

  return (
    <SelectVariantProvider product={product}>
      <div className='grid gap-8 lg:grid-cols-2 lg:gap-12'>
        <ProductGallery images={product.images} productName={product.name} />

        <div className='flex flex-col gap-6'>
          <div className='flex flex-col gap-3'>
            <h1 className='text-2xl font-semibold tracking-tight text-foreground sm:text-3xl'>
              {product.name}
            </h1>

            <ProductPrice
              minPrice={minPrice}
              maxPrice={maxPrice}
              compareAtPrice={compareAtPrice}
              currency={DEFAULT_CURRENCY}
              className='text-lg'
            />
          </div>

          {product.description ? (
            <p className='max-w-prose text-sm leading-relaxed text-muted-foreground'>
              {product.description}
            </p>
          ) : null}

          <VariantSelector optionTypes={product.optionTypes} />

          <AddToCartButton />
        </div>
      </div>
    </SelectVariantProvider>
  );
}
