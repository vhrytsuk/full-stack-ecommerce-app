import { RequestHandler } from "express";
import { CategoryService } from "./category.service";
import { HTTPSTATUS } from "../../config/http.config";
import {
  getCategoryBySlugParamsSchema,
  type GetCategoryBySlugParams,
} from "@repo/api-contracts";

export class CategoryController {
  private categoryService: CategoryService;

  constructor(categoryService: CategoryService) {
    this.categoryService = categoryService;
  }

  getAllCategories: RequestHandler = async (req, res) => {
    const categories = await this.categoryService.getAllCategories();

    res.status(HTTPSTATUS.OK).json(categories);
  };

  getCategoryProducts: RequestHandler<GetCategoryBySlugParams> = async (
    req,
    res
  ) => {
    const { slug } = getCategoryBySlugParamsSchema.parse(req.params);

    const products = await this.categoryService.getCategoryProducts(slug);

    res.status(HTTPSTATUS.OK).json(products);
  };
}
