import {
  loginResponseSchema,
  loginUserSchema,
  refreshResponseSchema,
  registerResponseSchema,
  registerUserSchema,
} from "@repo/api-contracts";
import type { RequestHandler } from "express";
import { HTTPSTATUS } from "../../config/http.config.js";
import {
  clearAuthenticationCookies,
  getRefreshTokenFromCookies,
  setAuthenticationCookies,
} from "../../utils/cookies.js";
import { UnauthorizedException } from "../../utils/catch-errors.js";
import { authService } from "./auth.service.js";

export const registerController: RequestHandler = async (req, res) => {
  const body = registerUserSchema.parse(req.body);

  const response = await authService.register(body, {
    userAgent: req.get("user-agent"),
    forwardedFor: req.get("x-forwarded-for"),
    remoteAddress: req.socket.remoteAddress,
  });

  const payload = registerResponseSchema.parse(response);

  setAuthenticationCookies({
    res,
    accessToken: payload.accessToken,
    refreshToken: payload.refreshToken,
  });

  res.status(HTTPSTATUS.CREATED).json(payload);
};

export const loginController: RequestHandler = async (req, res) => {
  const body = loginUserSchema.parse(req.body);

  const response = await authService.login(body, {
    userAgent: req.get("user-agent"),
    forwardedFor: req.get("x-forwarded-for"),
    remoteAddress: req.socket.remoteAddress,
  });

  const payload = loginResponseSchema.parse(response);

  setAuthenticationCookies({
    res,
    accessToken: payload.accessToken,
    refreshToken: payload.refreshToken,
  });

  res.status(HTTPSTATUS.OK).json(payload);
};

export const refreshController: RequestHandler = async (req, res) => {
  const refreshToken = getRefreshTokenFromCookies(req);

  if (!refreshToken) {
    clearAuthenticationCookies(res);
    throw new UnauthorizedException("Refresh token is required");
  }

  try {
    const response = await authService.refresh(refreshToken, {
      userAgent: req.get("user-agent"),
      forwardedFor: req.get("x-forwarded-for"),
      remoteAddress: req.socket.remoteAddress,
    });

    const payload = refreshResponseSchema.parse(response);

    setAuthenticationCookies({
      res,
      accessToken: payload.accessToken, // TODO: consider not saving new access token in cookie!
      refreshToken: payload.refreshToken,
    });

    res.status(HTTPSTATUS.OK).json(payload);
  } catch (error) {
    clearAuthenticationCookies(res);
    throw error;
  }
};

export const logoutController: RequestHandler = async (req, res) => {
  const refreshToken = getRefreshTokenFromCookies(req);

  if (refreshToken) {
    await authService.logout(refreshToken);
  }

  clearAuthenticationCookies(res);
  res.status(HTTPSTATUS.NO_CONTENT).send();
};

// Testing JWT
export const meController: RequestHandler = async (req, res) => {
  if (!req.user) {
    throw new UnauthorizedException("User is not authenticated");
  }

  res.status(HTTPSTATUS.OK).json({
    id: req.user.userId,
    email: req.user.email,
  });
};
