import {
  getProductsResponseSchema,
  productDetailSchema,
  type GetProductByIdResponse,
  type GetProductsQueryParams,
  type GetProductsResponse,
} from "@repo/api-contracts";
import { ProductRepository } from "./product.repository";
import { NotFoundException } from "../../utils/catch-errors";
import { toJsonValue } from "../../utils/toJsonValue";

export class ProductService {
  private productRepository: ProductRepository;

  constructor(productRepository: ProductRepository) {
    this.productRepository = productRepository;
  }

  async getAllProducts(
    params: GetProductsQueryParams
  ): Promise<GetProductsResponse> {
    const { limit, page } = params;
    const offset = (page - 1) * limit;

    const products = await this.productRepository.getProducts({
      limit,
      offset,
    });

    const totalCount = await this.productRepository.getProductsCount();

    return getProductsResponseSchema.parse(
      toJsonValue({
        products,
        totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
      })
    );
  }

  async getProductById(id: string): Promise<GetProductByIdResponse> {
    const product = await this.productRepository.getProductById(id);

    if (!product) {
      throw new NotFoundException("Product not found");
    }

    return productDetailSchema.parse(toJsonValue(product));
  }
}
