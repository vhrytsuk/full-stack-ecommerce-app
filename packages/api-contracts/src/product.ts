import { z } from "zod";

export const productStatusSchema = z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]);

export const getProductsQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(100).default(20),
  page: z.coerce.number().int().positive().default(1),
  search: z
    .string()
    .trim()
    .max(100)
    .transform((value) => (value.length > 0 ? value : undefined))
    .optional(),
  categorySlug: z
    .string()
    .trim()
    .min(1)
    .transform((value) => (value.length > 0 ? value : undefined))
    .optional(),
  sort: z
    .enum(["price_asc", "price_desc", "createdAt_asc", "createdAt_desc"])
    .default("createdAt_desc"),
});

export const getProductByIdParamsSchema = z.object({
  id: z.string().trim().min(1, "Product ID is required"),
});

export const getProductBySlugParamsSchema = z.object({
  slug: z.string().trim().min(1, "Product slug is required"),
});

const decimalStringSchema = z.string().min(1);
const dateTimeSchema = z.iso.datetime();
const createDecimalSchema = z
  .union([z.string(), z.number()])
  .transform((value) => String(value).trim())
  .pipe(
    z
      .string()
      .regex(
        /^\d+(\.\d{1,2})?$/,
        "Expected a positive decimal with up to 2 decimal places"
      )
      .refine((value) => Number(value) > 0, "Expected a positive decimal")
  );

const createWeightSchema = z
  .union([z.string(), z.number()])
  .transform((value) => String(value).trim())
  .pipe(
    z
      .string()
      .regex(
        /^\d+(\.\d{1,2})?$/,
        "Expected a non-negative decimal with up to 2 decimal places"
      )
  );

export const createProductImageSchema = z.object({
  url: z.url(),
  altText: z.string().trim().min(1).max(200).nullable().optional(),
  position: z.number().int().nonnegative().default(0),
});

export const createProductTagSchema = z.object({
  name: z.string().trim().min(1).max(80),
});

export const createProductOptionValueSchema = z.object({
  value: z.string().trim().min(1).max(100),
  position: z.number().int().nonnegative().default(0),
});

export const createProductOptionTypeSchema = z.object({
  name: z.string().trim().min(1).max(100),
  position: z.number().int().nonnegative().default(0),
  values: z.array(createProductOptionValueSchema).min(1),
});

export const createVariantOptionSchema = z.object({
  optionTypeName: z.string().trim().min(1).max(100),
  value: z.string().trim().min(1).max(100),
});

export const createVariantImageSchema = z.object({
  url: z.url(),
  altText: z.string().trim().min(1).max(200).nullable().optional(),
  position: z.number().int().nonnegative().default(0),
});

export const createProductVariantSchema = z.object({
  sku: z.string().trim().min(1).max(100),
  price: createDecimalSchema,
  comparePrice: createDecimalSchema.nullable().optional(),
  costPrice: createDecimalSchema.nullable().optional(),
  stock: z.number().int().nonnegative().default(0),
  lowStockAt: z.number().int().nonnegative().default(5),
  trackStock: z.boolean().default(true),
  weight: createWeightSchema.nullable().optional(),
  isDefault: z.boolean().default(false),
  options: z.array(createVariantOptionSchema).default([]),
  images: z.array(createVariantImageSchema).default([]),
});

export const createProductSchema = z
  .object({
    name: z.string().trim().min(1).max(200),
    slug: z
      .string()
      .trim()
      .min(1)
      .max(220)
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Slug must use lowercase letters, numbers, and hyphens"
      ),

    description: z.string().trim().min(1).max(5_000).nullable().optional(),
    status: productStatusSchema.default("DRAFT"),
    categoryId: z.string().trim().min(1, "Category is required"),
    images: z.array(createProductImageSchema).default([]),
    tags: z.array(createProductTagSchema).default([]),
    optionTypes: z.array(createProductOptionTypeSchema).default([]),
    variants: z
      .array(createProductVariantSchema)
      .min(1, "At least one variant is required"),
  })
  .superRefine((product, ctx) => {
    const optionValueMap = new Map(
      product.optionTypes.map((optionType) => [
        optionType.name,
        new Set(optionType.values.map((optionValue) => optionValue.value)),
      ])
    );

    const defaultVariants = product.variants.filter(
      (variant) => variant.isDefault
    );

    if (defaultVariants.length !== 1) {
      ctx.addIssue({
        code: "custom",
        path: ["variants"],
        message: "Exactly one variant must be marked as default",
      });
    }

    product.variants.forEach((variant, variantIndex) => {
      if (product.optionTypes.length === 0 && variant.options.length > 0) {
        ctx.addIssue({
          code: "custom",
          path: ["variants", variantIndex, "options"],
          message: "Simple products cannot have variant options",
        });
      }

      if (
        product.optionTypes.length > 0 &&
        variant.options.length !== product.optionTypes.length
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["variants", variantIndex, "options"],
          message:
            "Variant must include one value for each product option type",
        });
      }

      variant.options.forEach((option, optionIndex) => {
        const values = optionValueMap.get(option.optionTypeName);

        if (!values) {
          ctx.addIssue({
            code: "custom",
            path: [
              "variants",
              variantIndex,
              "options",
              optionIndex,
              "optionTypeName",
            ],
            message: "Variant option type is not defined on the product",
          });
          return;
        }

        if (!values.has(option.value)) {
          ctx.addIssue({
            code: "custom",
            path: ["variants", variantIndex, "options", optionIndex, "value"],
            message:
              "Variant option value is not defined on the product option type",
          });
        }
      });
    });
  });

export const updateProductSchema = z
  .object({
    name: z.string().trim().min(1).max(200).optional(),
    slug: z
      .string()
      .trim()
      .min(1)
      .max(220)
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Slug must use lowercase letters, numbers, and hyphens"
      )
      .optional(),
    description: z.string().trim().min(1).max(5_000).nullable().optional(),
    status: productStatusSchema.optional(),
    categoryId: z.string().trim().min(1, "Category is required").optional(),
    images: z.array(createProductImageSchema).optional(),
    tags: z.array(createProductTagSchema).optional(),
    optionTypes: z.array(createProductOptionTypeSchema).optional(),
    variants: z
      .array(createProductVariantSchema)
      .min(1, "At least one variant is required")
      .optional(),
  })
  .refine((product) => Object.keys(product).length > 0, {
    message: "At least one product field is required",
  })
  .superRefine((product, ctx) => {
    if (!product.variants) {
      return;
    }

    const defaultVariants = product.variants.filter(
      (variant) => variant.isDefault
    );

    if (defaultVariants.length !== 1) {
      ctx.addIssue({
        code: "custom",
        path: ["variants"],
        message: "Exactly one variant must be marked as default",
      });
    }

    if (!product.optionTypes) {
      return;
    }

    const optionValueMap = new Map(
      product.optionTypes.map((optionType) => [
        optionType.name,
        new Set(optionType.values.map((optionValue) => optionValue.value)),
      ])
    );

    product.variants.forEach((variant, variantIndex) => {
      if (product.optionTypes?.length === 0 && variant.options.length > 0) {
        ctx.addIssue({
          code: "custom",
          path: ["variants", variantIndex, "options"],
          message: "Simple products cannot have variant options",
        });
      }

      if (
        product.optionTypes &&
        product.optionTypes.length > 0 &&
        variant.options.length !== product.optionTypes.length
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["variants", variantIndex, "options"],
          message:
            "Variant must include one value for each product option type",
        });
      }

      variant.options.forEach((option, optionIndex) => {
        const values = optionValueMap.get(option.optionTypeName);

        if (!values) {
          ctx.addIssue({
            code: "custom",
            path: [
              "variants",
              variantIndex,
              "options",
              optionIndex,
              "optionTypeName",
            ],
            message: "Variant option type is not defined on the product",
          });
          return;
        }

        if (!values.has(option.value)) {
          ctx.addIssue({
            code: "custom",
            path: ["variants", variantIndex, "options", optionIndex, "value"],
            message:
              "Variant option value is not defined on the product option type",
          });
        }
      });
    });
  });

export const categorySchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  parentId: z.string().nullable(),
  description: z.string().nullable(),
  createdAt: dateTimeSchema,
  updatedAt: dateTimeSchema,
});

export const productImageSchema = z.object({
  id: z.string(),
  productId: z.string(),
  url: z.string(),
  altText: z.string().nullable(),
  position: z.number().int(),
});

export const tagSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const productTagSchema = z.object({
  productId: z.string(),
  tagId: z.string(),
  tag: tagSchema,
});

export const optionTypeSchema = z.object({
  id: z.string(),
  name: z.string(),
  position: z.number().int(),
  productId: z.string(),
});

export const optionValueSchema = z.object({
  id: z.string(),
  value: z.string(),
  position: z.number().int(),
  optionTypeId: z.string(),
});

export const productOptionTypeSchema = optionTypeSchema.extend({
  values: z.array(optionValueSchema),
});

export const variantImageSchema = z.object({
  id: z.string(),
  variantId: z.string(),
  url: z.string(),
  altText: z.string().nullable(),
  position: z.number().int(),
});

export const variantOptionSchema = z.object({
  id: z.string(),
  variantId: z.string(),
  optionValueId: z.string(),
  optionValue: optionValueSchema.extend({
    optionType: optionTypeSchema,
  }),
});

export const productVariantSchema = z.object({
  id: z.string(),
  productId: z.string(),
  sku: z.string(),
  price: decimalStringSchema,
  comparePrice: decimalStringSchema.nullable(),
  stock: z.number().int(),
  lowStockAt: z.number().int(),
  trackStock: z.boolean(),
  weight: decimalStringSchema.nullable(),
  isDefault: z.boolean(),
  images: z.array(variantImageSchema),
  options: z.array(variantOptionSchema),
  createdAt: dateTimeSchema,
  updatedAt: dateTimeSchema,
});

export const productSummarySchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  status: productStatusSchema,
  categoryId: z.string(),
  createdAt: dateTimeSchema,
  updatedAt: dateTimeSchema,
});

export const getProductsResponseSchema = z.object({
  products: z.array(productSummarySchema),
  totalCount: z.number().int().nonnegative(),
  currentPage: z.number().int().positive(),
  totalPages: z.number().int().nonnegative(),
});

export const productDetailSchema = productSummarySchema.extend({
  category: categorySchema,
  images: z.array(productImageSchema),
  tags: z.array(productTagSchema),
  optionTypes: z.array(productOptionTypeSchema),
  variants: z.array(productVariantSchema),
});

/**
 * Kind of product presented on a listing card.
 * - `simple`: no option types, sold as a single default variant. It can be
 *   added to the cart directly.
 * - `configurable`: has option types (e.g. Size, Color); the customer must
 *   choose a variant on the product page before adding to the cart.
 */
export const productCardKindSchema = z.enum(["simple", "configurable"]);

export const productCardImageSchema = z.object({
  url: z.string(),
  altText: z.string().nullable(),
});

/**
 * Denormalized, listing-optimized product shape. The backend precomputes the
 * price range, stock, and default variant so cards never ship full variant
 * trees to the client.
 */
export const productCardSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  kind: productCardKindSchema,
  image: productCardImageSchema.nullable(),
  /** Lowest variant price, as a decimal string (e.g. "19.99"). */
  minPrice: decimalStringSchema,
  /** Highest variant price; equals `minPrice` for single-price products. */
  maxPrice: decimalStringSchema,
  /** Crossed-out "was" price, when a single-price product is discounted. */
  compareAtPrice: decimalStringSchema.nullable(),
  currency: z.string(),
  /** Names of the option types (e.g. ["Size", "Color"]) for configurable products. */
  optionTypes: z.array(z.string()),
  inStock: z.boolean(),
  /** The variant to add to the cart for `simple` products; `null` otherwise. */
  defaultVariantId: z.string().nullable(),
});

export type ProductCardKind = z.infer<typeof productCardKindSchema>;
export type ProductCardImage = z.infer<typeof productCardImageSchema>;
export type ProductCard = z.infer<typeof productCardSchema>;

export type ProductVariant = z.infer<typeof productVariantSchema>;

export type ProductDetail = z.infer<typeof productDetailSchema>;

export type GetProductsQueryParams = z.infer<typeof getProductsQuerySchema>;
export type GetProductByIdParams = z.infer<typeof getProductByIdParamsSchema>;
export type GetProductBySlugParams = z.infer<
  typeof getProductBySlugParamsSchema
>;
export type GetProductByIdResponse = ProductDetail;
export type GetProductBySlugResponse = ProductDetail;
export type GetProductsResponse = z.infer<typeof getProductsResponseSchema>;

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
