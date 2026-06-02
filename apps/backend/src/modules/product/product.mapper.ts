import type {
  CreateProductInput,
  UpdateProductInput,
} from "@repo/api-contracts";
import type {
  ProductCreateInput,
  ProductUpdateInput,
  VariantUncheckedCreateInput,
} from "../../generated/prisma-client/models";

type CreateProductVariantData = Omit<
  VariantUncheckedCreateInput,
  "id" | "productId" | "createdAt" | "updatedAt" | "options"
> & {
  options: CreateProductInput["variants"][number]["options"];
};

export type CreateProductData = {
  product: ProductCreateInput;
  variants: CreateProductVariantData[];
};

export type UpdateProductData = {
  product: ProductUpdateInput;
};

export const mapCreateProductInputToData = (
  input: CreateProductInput
): CreateProductData => ({
  product: {
    name: input.name,
    slug: input.slug,
    description: input.description ?? null,
    status: input.status,
    category: {
      connect: {
        id: input.categoryId,
      },
    },
    images: {
      create: input.images,
    },
    tags: {
      create: input.tags.map((tag) => ({
        tag: {
          connectOrCreate: {
            where: {
              name: tag.name,
            },
            create: {
              name: tag.name,
            },
          },
        },
      })),
    },
    optionTypes: {
      create: input.optionTypes.map((optionType) => ({
        ...optionType,
        values: {
          create: optionType.values.map((optionValue) => ({
            value: optionValue.value,
            position: optionValue.position,
          })),
        },
      })),
    },
  },
  variants: input.variants.map((variant) => ({
    sku: variant.sku,
    price: variant.price,
    comparePrice: variant.comparePrice ?? null,
    costPrice: variant.costPrice ?? null,
    stock: variant.stock,
    lowStockAt: variant.lowStockAt,
    trackStock: variant.trackStock,
    weight: variant.weight ?? null,
    isDefault: variant.isDefault,
    images: {
      create: variant.images,
    },
    options: variant.options,
  })),
});

export const mapUpdateProductInputToData = (
  input: UpdateProductInput
): UpdateProductData => {
  const product: ProductUpdateInput = {};

  if (input.name !== undefined) {
    product.name = input.name;
  }

  if (input.slug !== undefined) {
    product.slug = input.slug;
  }

  if (input.description !== undefined) {
    product.description = input.description;
  }

  if (input.status !== undefined) {
    product.status = input.status;
  }

  if (input.categoryId !== undefined) {
    product.category = {
      connect: {
        id: input.categoryId,
      },
    };
  }

  return {
    product,
  };
};
