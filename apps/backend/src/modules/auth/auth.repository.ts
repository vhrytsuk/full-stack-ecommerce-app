import { prisma } from "../../lib/prisma";

export const authRepository = {
  findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  },

  createUser(data: { email: string; name?: string; passwordHash: string }) {
    return prisma.user.create({
      data,
    });
  },

  createSession(data: {
    id: string;
    userId: string;
    refreshTokenHash: string;
    userAgent?: string;
    ipAddress?: string;
    expiresAt: Date;
  }) {
    return prisma.authSession.create({
      data,
    });
  },

  findSessionByRefreshTokenHash(refreshTokenHash: string) {
    return prisma.authSession.findUnique({
      where: { refreshTokenHash },
      include: {
        user: true,
      },
    });
  },

  rotateSession(data: {
    id: string;
    refreshTokenHash: string;
    userAgent?: string;
    ipAddress?: string;
    expiresAt: Date;
    lastUsedAt: Date;
  }) {
    return prisma.authSession.update({
      where: { id: data.id },
      data,
    });
  },

  revokeSession(id: string) {
    return prisma.authSession.update({
      where: { id },
      data: { revokedAt: new Date() },
    });
  },
};
