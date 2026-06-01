import { Router, type Router as ExpressRouter } from "express";
import { productController } from "./product.module";

const productRoute: ExpressRouter = Router();

productRoute.get("/", productController.getAllProducts);
productRoute.get("/:id", productController.getProductById);

export { productRoute };
