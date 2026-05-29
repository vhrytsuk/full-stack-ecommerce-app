import { ProductController } from "./product.contoller";
import { ProductService } from "./product.service";

const productService = new ProductService();
const productController = new ProductController(productService);

export { productController, productService };
