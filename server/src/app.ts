import express from "express";
import adhaarRouter from "./routes/adhaar.routes";
import { httpLogger } from "./middlewares/logger.middleware";
import connectDB from "./configs/db.config";
import cors from "cors";
import { errorHandler } from "./middlewares/error.middleware";
import helmet from "helmet";

export const app = express();

app.use(express.json({ limit: "5mb" }));
app.use(httpLogger);

const CLIENT_URL = process.env.CLIENT_URL;

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
      "Cache-Control",
      "X-File-Name",
    ],
    optionsSuccessStatus: 200,
    methods: ["GET", "POST", "OPTIONS"],
  })
);

// app.options("*", cors({ origin: CLIENT_URL, credentials: true }));

connectDB();

app.use("/api", adhaarRouter);

app.use(errorHandler);
