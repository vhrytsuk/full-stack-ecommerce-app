import { jwtVerify, SignJWT } from "jose";

import { env } from "../config/env.js";

const ACCESS_TOKEN_ALGORITHM = "HS256";
const accessTokenSecret = new TextEncoder().encode(env.JWT_ACCESS_SECRET);

export type AccessTokenClaims = {
  sub: string;
  sid: string;
  email: string;
};

export const signAccessToken = async (claims: AccessTokenClaims) => {
  return new SignJWT({ email: claims.email })
    .setProtectedHeader({ alg: ACCESS_TOKEN_ALGORITHM })
    .setSubject(claims.sub)
    .setJti(claims.sid)
    .setIssuer(env.JWT_ACCESS_ISSUER)
    .setAudience(env.JWT_ACCESS_AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(`${env.JWT_ACCESS_TTL}m`)
    .sign(accessTokenSecret);
};

export const verifyAccessToken = async (token: string) => {
  const { payload, protectedHeader } = await jwtVerify(token, accessTokenSecret, {
    issuer: env.JWT_ACCESS_ISSUER,
    audience: env.JWT_ACCESS_AUDIENCE,
  });

  return { payload, protectedHeader };
};
