import { createHash, randomBytes, randomUUID } from "node:crypto";

export const generateRefreshToken = () => {
  return randomBytes(48).toString("base64url");
};

export const hashRefreshToken = (refreshToken: string) => {
  return createHash("sha256").update(refreshToken).digest("hex");
};

export const generateSessionId = () => {
  return randomUUID();
};
