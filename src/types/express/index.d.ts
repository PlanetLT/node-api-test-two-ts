declare global {
  namespace Express {
    interface Request {
      auth?: {
        userId: string;
        tokenType: "access" | "refresh";
        token: string;
      };
    }
  }
}

export {};
