import { CategoryController } from "./category.controller";
import { CategoryRepository } from "./category.repository";
import { CategoryService } from "./category.service";
import { prisma } from "../../lib/prisma";

const categoryRepository = new CategoryRepository(prisma);
const categoryService = new CategoryService(categoryRepository);
const categoryController = new CategoryController(categoryService);

export { categoryController, categoryService, categoryRepository };
