import {
  categoryProductsResponseSchema,
  type CategoryProductsResponse,
} from "@repo/api-contracts";
import { NotFoundException } from "../../utils/catch-errors";
import { CategoryRepository } from "./category.repository";
import { mapProductToCard } from "./category.mapper";

export class CategoryService {
  private categoryRepository: CategoryRepository;

  constructor(categoryRepository: CategoryRepository) {
    this.categoryRepository = categoryRepository;
  }

  async getAllCategories() {
    const categories = await this.categoryRepository.getAllCategories();

    return categories;
  }

  async getCategoryProducts(slug: string): Promise<CategoryProductsResponse> {
    const categoryWithProducts =
      await this.categoryRepository.getCategoryBySlug(slug);

    if (!categoryWithProducts) {
      throw new NotFoundException("Category not found");
    }

    return categoryProductsResponseSchema.parse(
      categoryWithProducts.products.map(mapProductToCard)
    );
  }
}
