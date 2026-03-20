import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";

export const validate =
  <T>(schema: ZodType<T>) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return next(result.error);
    }

    req.body = result.data as unknown;
    return next();
  };