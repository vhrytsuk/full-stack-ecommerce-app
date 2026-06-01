import { ProductController } from "./product.contoller";
import { ProductRepository } from "./product.repository";
import { ProductService } from "./product.service";
import { prisma } from "../../lib/prisma";

const productRepository = new ProductRepository(prisma);
const productService = new ProductService(productRepository);
const productController = new ProductController(productService);

export { productController, productService, productRepository };
