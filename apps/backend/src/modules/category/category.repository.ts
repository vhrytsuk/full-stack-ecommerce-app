import { type Prisma } from "../../lib/prisma";

export class CategoryRepository {
  private prisma: Prisma;

  constructor(prisma: Prisma) {
    this.prisma = prisma;
  }

  getAllCategories() {
    return this.prisma.category.findMany();
  }

  getCategoryBySlug(slug: string) {
    return this.prisma.category.findUnique({
      where: { slug },
      include: {
        products: {
          include: {
            images: {
              orderBy: { position: "asc" },
            },
            optionTypes: {
              orderBy: { position: "asc" },
            },
            variants: {
              orderBy: { price: "asc" },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });
  }
}
