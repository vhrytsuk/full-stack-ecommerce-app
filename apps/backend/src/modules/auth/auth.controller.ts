import {
  registerResponseSchema,
  registerUserSchema,
} from "@repo/api-contracts";
import type { RequestHandler } from "express";

import { HTTPSTATUS } from "../../config/http.config.js";
import { setAuthenticationCookies } from "../../utils/cookies.js";
import { authService } from "./auth.service.js";

export const registerController: RequestHandler = async (req, res) => {
  const body = registerUserSchema.parse(req.body);

  const response = await authService.register(body, {
    userAgent: req.get("user-agent"),
    forwardedFor: req.get("x-forwarded-for"),
    remoteAddress: req.socket.remoteAddress,
  });
  console.log("Register response:", response);
  const payload = registerResponseSchema.parse(response);

  setAuthenticationCookies({
    res,
    accessToken: payload.accessToken,
    refreshToken: payload.refreshToken,
  });

  res.status(HTTPSTATUS.CREATED).json(payload);
};
