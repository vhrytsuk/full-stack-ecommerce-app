import type { GetProductsQueryParams } from "@repo/api-contracts";
import {
  Prisma,
  type PrismaClient,
} from "../../generated/prisma-client/client";
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
  private prisma: PrismaClient;

  constructor(prismaInstance: PrismaClient) {
    this.prisma = prismaInstance;
  }

  private buildProductsWhere(params: {
    categorySlug?: string;
    search?: string;
  }): Prisma.ProductWhereInput {
    return {
      ...(params.categorySlug && { category: { slug: params.categorySlug } }),
      ...(params.search && {
        OR: [
          { name: { contains: params.search, mode: "insensitive" } },
          { description: { contains: params.search, mode: "insensitive" } },
        ],
      }),
    };
  }

  private buildProductsOrderBy(
    sort: GetProductsQueryParams["sort"]
  ): Prisma.ProductOrderByWithRelationInput {
    switch (sort) {
      case "createdAt_asc":
        return { createdAt: "asc" };
      case "createdAt_desc":
        return { createdAt: "desc" };
      case "price_asc":
      case "price_desc":
        return { createdAt: "desc" };
      default:
        return { createdAt: "desc" };
    }
  }

  getProducts(params: {
    limit: number;
    offset: number;
    categorySlug?: string;
    search?: string;
    sort: GetProductsQueryParams["sort"];
  }) {
    return this.prisma.product.findMany({
      take: params.limit,
      skip: params.offset,
      where: this.buildProductsWhere({
        categorySlug: params.categorySlug,
        search: params.search,
      }),
      orderBy: this.buildProductsOrderBy(params.sort),
    });
  }

  getProductsCount(params: { categorySlug?: string; search?: string }) {
    return this.prisma.product.count({
      where: this.buildProductsWhere({
        categorySlug: params.categorySlug,
        search: params.search,
      }),
    });
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
