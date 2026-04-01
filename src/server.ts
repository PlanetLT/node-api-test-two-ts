import "dotenv/config";
import express from "express";
import helmet from "helmet";
import { logger } from "./common/utils/logger";
import { errorHandler } from "./common/middlewares/error-handler";
import routes from "./route";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger";
import { initMongo } from "./common/db/mongo";

const app = express();

// Global middleware that applies to every request.
app.use(helmet());
app.use(logger);
app.use(express.json());

// Expose both the raw OpenAPI document and the Swagger UI.
app.get("/openapi.json", (_req, res) => {
  res.json(swaggerSpec);
});
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api", routes);

app.use(errorHandler);

const PORT = Number(process.env.PORT ?? 3000);
const PUBLIC_URL = process.env.PUBLIC_URL ?? `http://localhost:${PORT}`;

const bootstrap = async () => {
  // Wait for Mongo before accepting requests so handlers always have a ready database.
  await initMongo();
  app.listen(PORT, () => {
    console.log(`Server running at ${PUBLIC_URL}`);
  });
};

bootstrap().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
