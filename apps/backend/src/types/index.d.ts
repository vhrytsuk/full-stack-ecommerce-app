declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        sessionId: string;
        email?: string;
      };
    }
  }
}

export {};
