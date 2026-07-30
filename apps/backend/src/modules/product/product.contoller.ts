import { HTTPSTATUS } from "../../config/http.config";
import { ProductService } from "./product.service";
import { RequestHandler } from "express";
import {
  getProductsQuerySchema,
  type GetProductByIdParams,
  type GetProductBySlugParams,
  type GetProductsQueryParams,
  getProductByIdParamsSchema,
  getProductBySlugParamsSchema,
  createProductSchema,
  UpdateProductInput,
  updateProductSchema,
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

    const data = await this.productService.getAllProducts({
      limit: query.limit,
      page: query.page,
      search: query.search,
      categorySlug: query.categorySlug,
      sort: query.sort,
    });

    res.status(HTTPSTATUS.OK).json(data);
  };

  getProductById: RequestHandler<GetProductByIdParams> = async (req, res) => {
    const { id } = getProductByIdParamsSchema.parse(req.params);

    const product = await this.productService.getProductById(id);

    res.status(HTTPSTATUS.OK).json(product);
  };

  getProductBySlug: RequestHandler<GetProductBySlugParams> = async (
    req,
    res
  ) => {
    const { slug } = getProductBySlugParamsSchema.parse(req.params);

    const product = await this.productService.getProductBySlug(slug);

    res.status(HTTPSTATUS.OK).json(product);
  };

  createProduct: RequestHandler = async (req, res) => {
    const body = createProductSchema.parse(req.body);

    const newProduct = await this.productService.createProduct(body);

    res.status(HTTPSTATUS.CREATED).json(newProduct);
  };

  updateProduct: RequestHandler<
    GetProductByIdParams,
    unknown,
    UpdateProductInput
  > = async (req, res) => {
    const { id } = getProductByIdParamsSchema.parse(req.params);
    const body = updateProductSchema.parse(req.body);

    const updatedProduct = await this.productService.updateProduct(id, body);

    res.status(HTTPSTATUS.OK).json(updatedProduct);
  };

  deleteProduct: RequestHandler<GetProductByIdParams> = async (req, res) => {
    const { id } = getProductByIdParamsSchema.parse(req.params);

    await this.productService.deleteProduct(id);

    res.status(HTTPSTATUS.NO_CONTENT).send();
  };
}
