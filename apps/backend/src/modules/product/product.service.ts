import { GetProductsQueryParams } from "@repo/api-contracts";
import { productRepository } from "./product.repository";

export class ProductService {
  async getAllProducts(params: GetProductsQueryParams) {
    const { limit, page } = params;
    const offset = (page - 1) * limit;

    const products = await productRepository.getProducts({
      limit,
      offset,
    });

    const totalCount = await productRepository.getProductsCount();

    return {
      products,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
    };
  }
}
