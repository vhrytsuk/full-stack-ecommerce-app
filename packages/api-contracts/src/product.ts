import { z } from "zod";

export const productStatusSchema = z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]);

export const getProductsQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(100).default(20),
  page: z.coerce.number().int().positive().default(1),
});

export const getProductByIdParamsSchema = z.object({
  id: z.string().trim().min(1, "Product ID is required"),
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

export type ProductVariant = z.infer<typeof productVariantSchema>;

export type ProductDetail = z.infer<typeof productDetailSchema>;

export type GetProductsQueryParams = z.infer<typeof getProductsQuerySchema>;
export type GetProductByIdParams = z.infer<typeof getProductByIdParamsSchema>;
export type GetProductByIdResponse = ProductDetail;
export type GetProductsResponse = z.infer<typeof getProductsResponseSchema>;

export type CreateProductInput = z.infer<typeof createProductSchema>;
