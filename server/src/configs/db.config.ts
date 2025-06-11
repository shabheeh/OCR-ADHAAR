import mongoose, { ConnectOptions } from "mongoose";
import { logger } from "../utils/logger.util";

import dotenv from "dotenv";
dotenv.config();
const MONGO_URI: string | undefined = process.env.MONGODB_URI;

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGO_URI!, {} as ConnectOptions);
    logger.info("Connected to MongoDB");
  } catch (err) {
    logger.error("Error connecting to MongoDB:", err);
    process.exit(1);
  }
};

export default connectDB;
