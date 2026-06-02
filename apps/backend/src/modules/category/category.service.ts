import { NotFoundException } from "../../utils/catch-errors";
import { CategoryRepository } from "./category.repository";

export class CategoryService {
  private categoryRepository: CategoryRepository;

  constructor(categoryRepository: CategoryRepository) {
    this.categoryRepository = categoryRepository;
  }

  async getAllCategories() {
    const categories = await this.categoryRepository.getAllCategories();

    return categories;
  }

  async getCategoryProducts(slug: string) {
    const categoryWithProducts =
      await this.categoryRepository.getCategoryBySlug(slug);

    if (!categoryWithProducts) {
      throw new NotFoundException("Category not found");
    }

    return categoryWithProducts.products;
  }
}
