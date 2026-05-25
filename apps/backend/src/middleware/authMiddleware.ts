import { RequestHandler } from "express";
import { UnauthorizedException } from "../utils/catch-errors";
import { ErrorCode } from "../constants/error-code";
import { getAccessTokenFromCookies } from "../utils/cookies";
import { verifyAccessToken } from "../utils/jwt";

const getBearerToken = (authorization?: string) => {
  if (!authorization?.startsWith("Bearer ")) {
    return null;
  }

  return authorization.slice(7).trim();
};

export const authMiddleware: RequestHandler = async (req, res, next) => {
  try {
    const cookieToken = getAccessTokenFromCookies(req);
    const bearerToken = getBearerToken(req.get("authorization"));
    const accessToken = cookieToken ?? bearerToken;

    if (!accessToken) {
      throw new UnauthorizedException(
        "Access token is required",
        ErrorCode.AUTH_TOKEN_NOT_FOUND
      );
    }

    const { payload } = await verifyAccessToken(accessToken);

    if (!payload.sub || !payload.jti) {
      throw new UnauthorizedException(
        "Access token is invalid",
        ErrorCode.AUTH_INVALID_TOKEN
      );
    }

    req.user = {
      userId: String(payload.sub),
      sessionId: String(payload.jti),
      email: payload.email ? String(payload.email) : undefined,
    };

    next();
  } catch {
    next(
      new UnauthorizedException(
        "Access token is invalid or expired",
        ErrorCode.AUTH_INVALID_TOKEN
      )
    );
  }
};
