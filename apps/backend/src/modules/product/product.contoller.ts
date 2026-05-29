import { HTTPSTATUS } from "../../config/http.config";
import { ProductService } from "./product.service";
import { RequestHandler } from "express";
import {
  getProductsQuerySchema,
  type GetProductsQueryParams,
} from "@repo/api-contracts";

export class ProductController {
  private productService: ProductService;

  constructor(productService: ProductService) {
    this.productService = productService;
  }

  getAllProducts: RequestHandler<GetProductsQueryParams> = async (req, res) => {
    const query = getProductsQuerySchema.parse(req.query);

    const products = await this.productService.getAllProducts({
      limit: query.limit,
      page: query.page,
    });

    res.status(HTTPSTATUS.OK).json(products);
  };
}
