import type { CookieOptions, Request, Response } from "express";

import { env } from "../config/env.js";
import { calculateExpirationDate } from "./date-time.js";

type SetAuthenticationCookiesParams = {
  res: Response;
  accessToken: string;
  refreshToken: string;
};

export const ACCESS_TOKEN_COOKIE_NAME = "accessToken";
export const REFRESH_TOKEN_COOKIE_NAME = "refreshToken";
export const REFRESH_PATH = `${env.BACKEND_API_BASE_PATH}/auth/refresh`;

const defaults: CookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "strict",
};

export const getRefreshTokenCookieOptions = (): CookieOptions => ({
  ...defaults,
  expires: calculateExpirationDate(`${env.JWT_REFRESH_TTL}d`),
  path: REFRESH_PATH,
});

export const getAccessTokenCookieOptions = (): CookieOptions => ({
  ...defaults,
  expires: calculateExpirationDate(`${env.JWT_ACCESS_TTL}m`),
  path: "/",
});

export const setAccessTokenCookie = (res: Response, accessToken: string) => {
  return res.cookie(
    ACCESS_TOKEN_COOKIE_NAME,
    accessToken,
    getAccessTokenCookieOptions()
  );
};

export const setRefreshTokenCookie = (res: Response, refreshToken: string) => {
  return res.cookie(
    REFRESH_TOKEN_COOKIE_NAME,
    refreshToken,
    getRefreshTokenCookieOptions()
  );
};

export const setAuthenticationCookies = ({
  res,
  accessToken,
  refreshToken,
}: SetAuthenticationCookiesParams) => {
  setAccessTokenCookie(res, accessToken);
  setRefreshTokenCookie(res, refreshToken);

  return res;
};

export const clearAuthenticationCookies = (res: Response) => {
  res.clearCookie(ACCESS_TOKEN_COOKIE_NAME, {
    ...getAccessTokenCookieOptions(),
    expires: new Date(0),
  });

  return res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, {
    ...getRefreshTokenCookieOptions(),
    expires: new Date(0),
  });
};

export const getAccessTokenFromCookies = (req: Request) => {
  return req.cookies?.[ACCESS_TOKEN_COOKIE_NAME];
};

export const getRefreshTokenFromCookies = (req: Request) => {
  return req.cookies?.[REFRESH_TOKEN_COOKIE_NAME];
};
