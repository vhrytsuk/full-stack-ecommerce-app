import { type Prisma } from "../../lib/prisma";
import type { CreateProductData, UpdateProductData } from "./product.mapper";

const productDetailInclude = {
  category: true,
  images: true,
  tags: {
    include: {
      tag: true,
    },
  },
  optionTypes: {
    include: {
      values: true,
    },
  },
  variants: {
    include: {
      images: true,
      options: {
        include: {
          optionValue: {
            include: {
              optionType: true,
            },
          },
        },
      },
    },
  },
} as const;

export class ProductRepository {
  private prisma: Prisma;

  constructor(prismaInstance: Prisma) {
    this.prisma = prismaInstance;
  }

  getProducts(params: { limit: number; offset: number }) {
    return this.prisma.product.findMany({
      take: params.limit,
      skip: params.offset,
    });
  }

  getProductsCount() {
    return this.prisma.product.count();
  }

  getProductById(id: string) {
    return this.prisma.product.findUnique({
      where: { id },
      include: productDetailInclude,
    });
  }

  createProduct(productData: CreateProductData) {
    return this.prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: productData.product,
        include: {
          optionTypes: {
            include: {
              values: true,
            },
          },
        },
      });

      const optionValueIdsByName = new Map<string, string>();

      for (const optionType of product.optionTypes) {
        for (const optionValue of optionType.values) {
          optionValueIdsByName.set(
            `${optionType.name}:${optionValue.value}`,
            optionValue.id
          );
        }
      }

      for (const variant of productData.variants) {
        await tx.variant.create({
          data: {
            productId: product.id,
            sku: variant.sku,
            price: variant.price,
            comparePrice: variant.comparePrice,
            costPrice: variant.costPrice,
            stock: variant.stock,
            lowStockAt: variant.lowStockAt,
            trackStock: variant.trackStock,
            weight: variant.weight,
            isDefault: variant.isDefault,
            images: variant.images,
            options: {
              create: variant.options.map((option) => {
                const optionValueId = optionValueIdsByName.get(
                  `${option.optionTypeName}:${option.value}`
                );

                if (!optionValueId) {
                  throw new Error(
                    `Option value "${option.optionTypeName}:${option.value}" was not created`
                  );
                }

                return {
                  optionValueId,
                };
              }),
            },
          },
        });
      }

      return tx.product.findUniqueOrThrow({
        where: {
          id: product.id,
        },
        include: productDetailInclude,
      });
    });
  }

  updateProduct(id: string, productData: UpdateProductData) {
    return this.prisma.product.update({
      where: { id },
      data: productData.product,
      include: productDetailInclude,
    });
  }

  deleteProduct(id: string) {
    return this.prisma.product.delete({
      where: { id },
    });
  }
}
