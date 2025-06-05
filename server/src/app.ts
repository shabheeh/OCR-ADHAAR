import express from "express";
import adhaarRouter from "./interfaces/routes/adhaar.routes";
import { httpLogger } from "./interfaces/middlewares/logger.middleware";
import connectDB from "./configs/db.config";
import cors from "cors";
import { errorHandler } from "./interfaces/middlewares/error.middleware";

export const app = express();

app.use(express.json());
app.use(httpLogger);

const CLIENT_URL = process.env.CLIENT_URL;

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);

connectDB();

app.use(errorHandler);

app.use("/api", adhaarRouter);
