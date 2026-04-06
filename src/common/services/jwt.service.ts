import crypto from "crypto";
import { HttpError } from "../errors/http-error";

type TokenType = "access" | "refresh";

type JwtHeader = {
  alg: "HS256";
  typ: "JWT";
};

type JwtPayload = {
  userId: string;
  type: TokenType;
  iat: number;
  exp: number;
};

type JwtServiceConfig = {
  accessTokenSecret?: string;
  refreshTokenSecret?: string;
  accessTokenExpiresIn?: string;
  refreshTokenExpiresIn?: string;
};

const DEFAULT_ACCESS_TOKEN_SECRET = "development-access-secret-change-me";
const DEFAULT_REFRESH_TOKEN_SECRET = "development-refresh-secret-change-me";
const DEFAULT_ACCESS_TOKEN_EXPIRES_IN = "15m";
const DEFAULT_REFRESH_TOKEN_EXPIRES_IN = "7d";

const EXPIRES_IN_UNITS = {
  s: 1,
  m: 60,
  h: 60 * 60,
  d: 60 * 60 * 24,
} as const;

export class JwtService {
  private readonly accessTokenSecret: string;
  private readonly refreshTokenSecret: string;
  private readonly accessTokenTtlSeconds: number;
  private readonly refreshTokenTtlSeconds: number;

  constructor(config: JwtServiceConfig = {}) {
    this.accessTokenSecret =
      config.accessTokenSecret ??
      process.env.ACCESS_TOKEN_SECRET ??
      DEFAULT_ACCESS_TOKEN_SECRET;
    this.refreshTokenSecret =
      config.refreshTokenSecret ??
      process.env.REFRESH_TOKEN_SECRET ??
      DEFAULT_REFRESH_TOKEN_SECRET;
    this.accessTokenTtlSeconds = parseExpiresIn(
      config.accessTokenExpiresIn ??
        process.env.ACCESS_TOKEN_EXPIRES_IN ??
        DEFAULT_ACCESS_TOKEN_EXPIRES_IN
    );
    this.refreshTokenTtlSeconds = parseExpiresIn(
      config.refreshTokenExpiresIn ??
        process.env.REFRESH_TOKEN_EXPIRES_IN ??
        DEFAULT_REFRESH_TOKEN_EXPIRES_IN
    );
  }

  generateAccessToken(userId: string): string {
    return this.signToken(userId, "access", this.accessTokenSecret, this.accessTokenTtlSeconds);
  }

  generateRefreshToken(userId: string): string {
    return this.signToken(userId, "refresh", this.refreshTokenSecret, this.refreshTokenTtlSeconds);
  }

  generateAuthTokens(userId: string) {
    return {
      accessToken: this.generateAccessToken(userId),
      refreshToken: this.generateRefreshToken(userId),
    };
  }

  verifyAccessToken(token: string): JwtPayload {
    return this.verifyToken(token, "access", this.accessTokenSecret);
  }

  verifyRefreshToken(token: string): JwtPayload {
    return this.verifyToken(token, "refresh", this.refreshTokenSecret);
  }

  private signToken(
    userId: string,
    type: TokenType,
    secret: string,
    expiresInSeconds: number
  ): string {
    const now = Math.floor(Date.now() / 1000);
    const header = encodeBase64Url({
      alg: "HS256",
      typ: "JWT",
    } satisfies JwtHeader);
    const payload = encodeBase64Url({
      userId,
      type,
      iat: now,
      exp: now + expiresInSeconds,
    } satisfies JwtPayload);
    const signature = createSignature(`${header}.${payload}`, secret);

    return `${header}.${payload}.${signature}`;
  }

  private verifyToken(token: string, expectedType: TokenType, secret: string): JwtPayload {
    const [headerPart, payloadPart, signaturePart] = token.split(".");

    if (!headerPart || !payloadPart || !signaturePart) {
      throw new HttpError("Invalid token format", 401, "INVALID_TOKEN");
    }

    const expectedSignature = createSignature(`${headerPart}.${payloadPart}`, secret);

    if (!safeEqual(signaturePart, expectedSignature)) {
      throw new HttpError("Invalid token signature", 401, "INVALID_TOKEN");
    }

    const header = decodeBase64Url<JwtHeader>(headerPart);
    if (header.alg !== "HS256" || header.typ !== "JWT") {
      throw new HttpError("Invalid token header", 401, "INVALID_TOKEN");
    }

    const payload = decodeBase64Url<JwtPayload>(payloadPart);
    if (!payload.userId || payload.type !== expectedType) {
      throw new HttpError("Invalid token payload", 401, "INVALID_TOKEN");
    }

    const now = Math.floor(Date.now() / 1000);
    if (typeof payload.exp !== "number" || payload.exp <= now) {
      throw new HttpError("Token expired", 401, "TOKEN_EXPIRED");
    }

    return payload;
  }
}

const parseExpiresIn = (value: string): number => {
  const trimmed = value.trim();

  if (/^\d+$/.test(trimmed)) {
    return Number(trimmed);
  }

  const match = trimmed.match(/^(\d+)([smhd])$/i);
  if (!match) {
    throw new Error(`Invalid token expiry value: ${value}`);
  }

  const amountText = match[1];
  const unit = match[2]?.toLowerCase() as keyof typeof EXPIRES_IN_UNITS | undefined;

  if (!amountText || !unit) {
    throw new Error(`Invalid token expiry value: ${value}`);
  }

  return Number(amountText) * EXPIRES_IN_UNITS[unit];
};

const encodeBase64Url = (value: object): string =>
  Buffer.from(JSON.stringify(value)).toString("base64url");

const decodeBase64Url = <T>(value: string): T => {
  try {
    return JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as T;
  } catch {
    throw new HttpError("Invalid token payload", 401, "INVALID_TOKEN");
  }
};

const createSignature = (value: string, secret: string): string =>
  crypto.createHmac("sha256", secret).update(value).digest("base64url");

const safeEqual = (a: string, b: string): boolean => {
  const left = Buffer.from(a);
  const right = Buffer.from(b);

  if (left.length !== right.length) {
    return false;
  }

  return crypto.timingSafeEqual(left, right);
};
