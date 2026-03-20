import fs from "node:fs";
import path from "node:path";
import morgan from "morgan";
import pino from "pino";

const logFilePath = process.env.LOG_FILE ?? "logs/trace.log";
const resolvedLogPath = path.resolve(process.cwd(), logFilePath);
fs.mkdirSync(path.dirname(resolvedLogPath), { recursive: true });

const fileDestination = pino.destination({ dest: resolvedLogPath, sync: false });

const pinoLogger = pino(
  { level: process.env.LOG_LEVEL ?? "info" },
  pino.multistream([
    { stream: fileDestination },
    { stream: process.stdout },
  ])
);

const stream = {
  write: (message: string) => {
    const line = message.trim();
    if (!line) return;
    try {
      const payload = JSON.parse(line) as {
        status?: number;
        success?: boolean;
      };
      const status = Number(payload.status ?? 0);
      if (status >= 500) {
        pinoLogger.error(payload);
      } else if (status >= 400) {
        pinoLogger.warn(payload);
      } else {
        pinoLogger.info(payload);
      }
    } catch {
      pinoLogger.info(line);
    }
  },
};

const format: morgan.FormatFn = (tokens, req, res) => {
  const status = Number(tokens.status?.(req, res) ?? 0);
  const responseTime = Number(tokens["response-time"]?.(req, res) ?? 0);
  const contentLength = tokens.res?.(req, res, "content-length") ?? "0";
  const expressRes = res as import("express").Response;
  const locals = expressRes.locals as { error?: { message?: string; code?: string; errors?: unknown } };

  return JSON.stringify({
    method: tokens.method?.(req, res) ?? "",
    url: tokens.url?.(req, res) ?? "",
    status,
    responseTime,
    contentLength,
    success: status < 400,
    error: locals?.error,
  });
};

export const logger = morgan(format, { stream });
export { pinoLogger };
