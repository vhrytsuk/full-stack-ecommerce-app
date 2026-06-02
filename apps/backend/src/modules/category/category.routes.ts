import { Router, type Router as ExpressRouter } from "express";
import { categoryController } from "./category.module";

const categoryRoute: ExpressRouter = Router();

categoryRoute.get("/", categoryController.getAllCategories);
categoryRoute.get("/:slug/products", categoryController.getCategoryProducts);

export { categoryRoute };
