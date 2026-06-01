import { HTTPSTATUS } from "../../config/http.config";
import { ProductService } from "./product.service";
import { RequestHandler } from "express";
import {
  getProductsQuerySchema,
  type GetProductByIdParams,
  type GetProductsQueryParams,
  getProductByIdParamsSchema,
} from "@repo/api-contracts";

export class ProductController {
  private productService: ProductService;

  constructor(productService: ProductService) {
    this.productService = productService;
  }

  getAllProducts: RequestHandler<
    Record<string, never>,
    unknown,
    unknown,
    GetProductsQueryParams
  > = async (req, res) => {
    const query = getProductsQuerySchema.parse(req.query);

    const products = await this.productService.getAllProducts({
      limit: query.limit,
      page: query.page,
    });

    res.status(HTTPSTATUS.OK).json(products);
  };

  getProductById: RequestHandler<GetProductByIdParams> = async (req, res) => {
    const { id } = getProductByIdParamsSchema.parse(req.params);

    const product = await this.productService.getProductById(id);

    res.status(HTTPSTATUS.OK).json(product);
  };
}
