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

export type ProductStatus = z.infer<typeof productStatusSchema>;
export type Category = z.infer<typeof categorySchema>;
export type ProductImage = z.infer<typeof productImageSchema>;
export type Tag = z.infer<typeof tagSchema>;
export type ProductTag = z.infer<typeof productTagSchema>;
export type OptionType = z.infer<typeof optionTypeSchema>;
export type OptionValue = z.infer<typeof optionValueSchema>;
export type ProductOptionType = z.infer<typeof productOptionTypeSchema>;
export type VariantImage = z.infer<typeof variantImageSchema>;
export type VariantOption = z.infer<typeof variantOptionSchema>;
export type ProductVariant = z.infer<typeof productVariantSchema>;
export type ProductSummary = z.infer<typeof productSummarySchema>;
export type ProductDetail = z.infer<typeof productDetailSchema>;

export type GetProductsQueryParams = z.infer<typeof getProductsQuerySchema>;
export type GetProductByIdParams = z.infer<typeof getProductByIdParamsSchema>;

export type GetProductByIdResponse = ProductDetail;
export type GetProductsResponse = z.infer<typeof getProductsResponseSchema>;
