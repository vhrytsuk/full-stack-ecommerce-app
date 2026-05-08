import { Router, type Router as ExpressRouter } from "express";

import { registerController } from "./auth.controller";

const authRouter: ExpressRouter = Router();

authRouter.post("/register", registerController);

export { authRouter };
