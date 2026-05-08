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
};
