import { Router, type Router as ExpressRouter } from "express";

import {
  loginController,
  logoutController,
  meController,
  refreshController,
  registerController,
} from "./auth.controller";
import { authMiddleware } from "../../middleware/authMiddleware";

const authRouter: ExpressRouter = Router();

authRouter.post("/register", registerController);
authRouter.post("/login", loginController);
authRouter.post("/refresh", refreshController);
authRouter.post("/logout", logoutController);

authRouter.get("/me", authMiddleware, meController);

export { authRouter };
