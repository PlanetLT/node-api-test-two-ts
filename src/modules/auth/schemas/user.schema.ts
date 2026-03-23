import { z } from "../../../common/utils/zod";

export const userPublicSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
});

export const userSchema = userPublicSchema.extend({
  password: z.string(),
  createdAt: z.date().optional(),
});
