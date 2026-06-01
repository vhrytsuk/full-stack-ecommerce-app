import { type Prisma } from "../../lib/prisma";

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
      include: {
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
      },
    });
  }
}
