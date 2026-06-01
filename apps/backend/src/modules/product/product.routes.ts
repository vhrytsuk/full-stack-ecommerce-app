import { Router, type Router as ExpressRouter } from "express";
import { productController } from "./product.module";

const productRoute: ExpressRouter = Router();

productRoute.get("/", productController.getAllProducts);
productRoute.get("/:id", productController.getProductById);

productRoute.post("/", productController.createProduct);
productRoute.patch("/:id", productController.updateProduct);
productRoute.delete("/:id", productController.deleteProduct);

export { productRoute };
