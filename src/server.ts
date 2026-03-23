import "dotenv/config";
import express from "express";
import helmet from "helmet";
import { logger } from "./common/utils/logger";
import { errorHandler } from "./common/middlewares/error-handler";
import routes from "./route";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger";

const app = express();

app.use(helmet());
app.use(logger);
app.use(express.json());

app.get("/openapi.json", (_req, res) => {
  res.json(swaggerSpec);
});
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api", routes);

app.use(errorHandler);

const PORT = Number(process.env.PORT ?? 3000);
const PUBLIC_URL = process.env.PUBLIC_URL ?? `http://localhost:${PORT}`;

app.listen(PORT, () => {
  console.log(`Server running at ${PUBLIC_URL}`);
});
