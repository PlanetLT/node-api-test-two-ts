import type { NextFunction, Request, Response } from "express";
import { HttpError } from "../errors/http-error";
import type { JwtService } from "../services/jwt.service";

const extractBearerToken = (value?: string): string | null => {
  if (!value) {
    return null;
  }

  const [scheme, token] = value.split(" ");

  if (scheme?.toLowerCase() !== "bearer" || !token) {
    return null;
  }

  return token;
};

const getHeaderValue = (value: string | string[] | undefined): string | undefined =>
  Array.isArray(value) ? value[0] : value;

const getAccessToken = (req: Request): string | null => {
  const authorizationToken = extractBearerToken(getHeaderValue(req.headers.authorization));
  if (authorizationToken) {
    return authorizationToken;
  }

  return getHeaderValue(req.headers["x-access-token"]) ?? null;
};

const getRefreshToken = (req: Request): string | null => {
  const refreshHeader = getHeaderValue(req.headers["x-refresh-token"]);
  if (refreshHeader) {
    return refreshHeader;
  }

  if (typeof req.body?.refreshToken === "string" && req.body.refreshToken.trim()) {
    return req.body.refreshToken;
  }

  return extractBearerToken(getHeaderValue(req.headers.authorization));
};

export const createRequireAccessToken = (jwtService: JwtService) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const token = getAccessToken(req);
      if (!token) {
        throw new HttpError("Access token is required", 401, "ACCESS_TOKEN_REQUIRED");
      }

      const payload = jwtService.verifyAccessToken(token);
      req.auth = {
        userId: payload.userId,
        tokenType: payload.type,
        token,
      };
      next();
    } catch (error) {
      next(error);
    }
  };
};

export const createRequireRefreshToken = (jwtService: JwtService) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const token = getRefreshToken(req);
      if (!token) {
        throw new HttpError("Refresh token is required", 401, "REFRESH_TOKEN_REQUIRED");
      }

      const payload = jwtService.verifyRefreshToken(token);
      req.auth = {
        userId: payload.userId,
        tokenType: payload.type,
        token,
      };
      next();
    } catch (error) {
      next(error);
    }
  };
};
