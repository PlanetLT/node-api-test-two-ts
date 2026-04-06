import { z } from "../../../common/utils/zod";

export const userPublicSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
});

export const authTokensSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

export const registerResponseSchema = z.object({
  user: userPublicSchema,
  accessToken: z.string(),
  refreshToken: z.string(),
});

export const refreshAccessTokenResponseSchema = z.object({
  accessToken: z.string(),
});

export const userSchema = userPublicSchema.extend({
  password: z.string(),
  createdAt: z.date().optional(),
});
