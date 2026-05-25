import type {
  LoginResponse,
  LoginUserInput,
  RegisterResponse,
  RegisterUserInput,
} from "@repo/api-contracts";

import { HTTPSTATUS } from "../../config/http.config";
import { ErrorCode } from "../../constants/error-code";
import { HttpException } from "../../utils/catch-errors";
import { hashPassword, verifyPassword } from "../../utils/password";
import {
  generateRefreshToken,
  generateSessionId,
  hashRefreshToken,
} from "../../utils/session-token";
import { signAccessToken } from "../../utils/jwt";
import { env } from "../../config/env.js";
import { authRepository } from "./auth.repository";

const getSessionExpiryDate = () => {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + env.JWT_REFRESH_TTL);

  return expiresAt;
};

const getClientIpAddress = (
  forwardedForHeader?: string,
  remoteAddress?: string
) => {
  if (forwardedForHeader) {
    return forwardedForHeader.split(",")[0]?.trim();
  }

  return remoteAddress;
};

export const authService = {
  async register(
    input: RegisterUserInput,
    metadata: {
      userAgent?: string;
      forwardedFor?: string;
      remoteAddress?: string;
    }
  ): Promise<RegisterResponse> {
    const email = input.email.trim().toLowerCase();
    const name = input.name?.trim();

    const existingUser = await authRepository.findUserByEmail(email);

    if (existingUser) {
      throw new HttpException(
        "Email is already registered",
        HTTPSTATUS.CONFLICT,
        ErrorCode.AUTH_EMAIL_ALREADY_EXISTS
      );
    }

    const passwordHash = await hashPassword(input.password);
    const user = await authRepository.createUser({
      email,
      name,
      passwordHash,
    });

    const refreshToken = generateRefreshToken();
    const sessionId = generateSessionId();
    const expiresAt = getSessionExpiryDate();

    await authRepository.createSession({
      id: sessionId,
      userId: user.id,
      refreshTokenHash: hashRefreshToken(refreshToken),
      userAgent: metadata.userAgent,
      ipAddress: getClientIpAddress(
        metadata.forwardedFor,
        metadata.remoteAddress
      ),
      expiresAt,
    });

    const accessToken = await signAccessToken({
      sub: user.id,
      sid: sessionId,
      email: user.email,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name ?? null,
        createdAt: user.createdAt.toISOString(),
      },
      accessToken,
      refreshToken,
      session: {
        id: sessionId,
        expiresAt: expiresAt.toISOString(),
      },
    };
  },

  async login(
    input: LoginUserInput,
    metadata: {
      userAgent?: string;
      forwardedFor?: string;
      remoteAddress?: string;
    }
  ): Promise<LoginResponse> {
    const email = input.email.trim().toLowerCase();

    const user = await authRepository.findUserByEmail(email);

    if (!user) {
      throw new HttpException(
        "Invalid email or password",
        HTTPSTATUS.UNAUTHORIZED,
        ErrorCode.AUTH_INVALID_CREDENTIALS
      );
    }

    const isPasswordValid = await verifyPassword(
      user.passwordHash,
      input.password
    );

    if (!isPasswordValid) {
      throw new HttpException(
        "Invalid email or password",
        HTTPSTATUS.UNAUTHORIZED,
        ErrorCode.AUTH_INVALID_CREDENTIALS
      );
    }

    const refreshToken = generateRefreshToken();
    const sessionId = generateSessionId();
    const expiresAt = getSessionExpiryDate();

    await authRepository.createSession({
      id: sessionId,
      userId: user.id,
      refreshTokenHash: hashRefreshToken(refreshToken),
      userAgent: metadata.userAgent,
      ipAddress: getClientIpAddress(
        metadata.forwardedFor,
        metadata.remoteAddress
      ),
      expiresAt,
    });

    const accessToken = await signAccessToken({
      sub: user.id,
      sid: sessionId,
      email: user.email,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name ?? null,
        createdAt: user.createdAt.toISOString(),
      },
      accessToken,
      refreshToken,
      session: {
        id: sessionId,
        expiresAt: expiresAt.toISOString(),
      },
    };
  },
};
