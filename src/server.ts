import express from "express";
import helmet from "helmet";
import { logger } from "./common/utils/logger";
import routes from "./route";

const app = express();

app.use(helmet());
app.use(logger);
app.use(express.json());

app.use("/api", routes);

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});