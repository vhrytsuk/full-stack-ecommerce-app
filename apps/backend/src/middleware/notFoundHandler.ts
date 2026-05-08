import { Request, Response, NextFunction } from "express";
import { NotFoundException } from "../utils/catch-errors";

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  next(new NotFoundException(`Route ${req.originalUrl} not found`));
};
