import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof ZodError) {
    const errors = err.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
    res.locals.error = { message: "Validation error", errors };

    return res.status(400).json({
      message: "Validation error",
      errors,
    });
  }

  const e = err as { message?: string; status?: number; code?: string; stack?: string };
  const status = typeof e?.status === "number" ? e.status : 500;
  res.locals.error = {
    message: e?.message ?? "Internal Server Error",
    code: e?.code,
  };

  return res.status(status).json({
    message: e?.message ?? "Internal Server Error",
  });
};
