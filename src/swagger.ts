import { OpenAPIRegistry, OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import { registerSchema } from "./modules/auth/schemas/register.schema";
import {
  refreshAccessTokenResponseSchema,
  registerResponseSchema,
  userPublicSchema,
  userSchema,
} from "./modules/auth/schemas/user.schema";

const registry = new OpenAPIRegistry();

registry.register("RegisterInput", registerSchema);
registry.register("UserPublic", userPublicSchema);
registry.register("User", userSchema);
registry.register("RegisterResponse", registerResponseSchema);
registry.register("RefreshAccessTokenResponse", refreshAccessTokenResponseSchema);

registry.registerPath({
  method: "post",
  path: "/register",
  tags: ["Auth"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: registerSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "User created",
      content: {
        "application/json": {
          schema: registerResponseSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/refresh-token",
  tags: ["Auth"],
  description:
    "Provide a refresh token in the x-refresh-token header, request body, or Bearer header to get a new access token.",
  responses: {
    200: {
      description: "New access token",
      content: {
        "application/json": {
          schema: refreshAccessTokenResponseSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/users",
  tags: ["Users"],
  description: "Requires a valid access token in Authorization: Bearer <token>.",
  responses: {
    200: {
      description: "Array of users",
      content: {
        "application/json": {
          schema: userSchema.array(),
        },
      },
    },
  },
});

const generator = new OpenApiGeneratorV3(registry.definitions);

const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:3000/api";

export const swaggerSpec = generator.generateDocument({
  openapi: "3.0.0",
  info: {
    title: "API Test Two",
    version: "1.0.0",
  },
  servers: [{ url: API_BASE_URL }],
});
