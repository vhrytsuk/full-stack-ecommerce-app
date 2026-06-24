import {
  type CreateProductInput,
  getProductsResponseSchema,
  productDetailSchema,
  type GetProductByIdResponse,
  type GetProductsQueryParams,
  type GetProductsResponse,
  UpdateProductInput,
} from "@repo/api-contracts";
import { ProductRepository } from "./product.repository";
import { NotFoundException } from "../../utils/catch-errors";
import { toJsonValue } from "../../utils/toJsonValue";
import {
  mapCreateProductInputToData,
  mapUpdateProductInputToData,
} from "./product.mapper";

export class ProductService {
  private productRepository: ProductRepository;

  constructor(productRepository: ProductRepository) {
    this.productRepository = productRepository;
  }

  async getAllProducts(
    params: GetProductsQueryParams
  ): Promise<GetProductsResponse> {
    const { limit, page, search, categorySlug, sort } = params;
    const offset = (page - 1) * limit;
    const normalizedSearch = search ?? undefined;
    const normalizedCategorySlug = categorySlug ?? undefined;

    const products = await this.productRepository.getProducts({
      limit,
      offset,
      categorySlug: normalizedCategorySlug,
      search: normalizedSearch,
      sort,
    });

    const totalCount = await this.productRepository.getProductsCount({
      categorySlug: normalizedCategorySlug,
      search: normalizedSearch,
    });

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

  async createProduct(productData: CreateProductInput) {
    const newProduct = await this.productRepository.createProduct(
      mapCreateProductInputToData(productData)
    );

    return productDetailSchema.parse(toJsonValue(newProduct));
  }

  async updateProduct(id: string, productData: UpdateProductInput) {
    const updatedProduct = await this.productRepository.updateProduct(
      id,
      mapUpdateProductInputToData(productData)
    );

    if (!updatedProduct) {
      throw new NotFoundException("Product not found");
    }

    return productDetailSchema.parse(toJsonValue(updatedProduct));
  }

  async deleteProduct(id: string) {
    const deleted = await this.productRepository.deleteProduct(id);

    if (!deleted) {
      throw new NotFoundException("Product not found");
    }
  }
}
