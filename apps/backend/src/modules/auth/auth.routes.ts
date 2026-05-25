import { Router, type Router as ExpressRouter } from "express";

import { loginController, registerController } from "./auth.controller";

const authRouter: ExpressRouter = Router();

authRouter.post("/register", registerController);
authRouter.post("/login", loginController);

export { authRouter };
