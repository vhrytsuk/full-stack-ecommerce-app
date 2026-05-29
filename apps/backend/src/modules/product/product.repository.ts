import { prisma } from "../../lib/prisma";

export const productRepository = {
  getProducts(params: { limit: number; offset: number }) {
    return prisma.product.findMany({
      take: params.limit,
      skip: params.offset,
    });
  },
  getProductsCount() {
    return prisma.product.count();
  },
};
