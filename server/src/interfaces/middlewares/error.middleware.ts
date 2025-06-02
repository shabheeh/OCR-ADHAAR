import { Request, Response, NextFunction } from "express";
import { AppError } from "../../shared/errors/http-error";

interface ErrorResponse {
  status: string;
  statusCode: number;
  message: string;
  stack?: string;
}

export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  let error: AppError;

  if (err instanceof AppError) {
    error = err;
  } else {
    error = new AppError(err.message || "Internal Server Error", 500, false);
  }

  const response: ErrorResponse = {
    status: error.statusCode >= 500 ? "error" : "fail",
    statusCode: error.statusCode,
    message: error.isOperational ? error.message : "Something went wrong!",
  };

  if (process.env.NODE_ENV === "development") {
    response.stack = error.stack;
  }

  res.status(error.statusCode).json(response);
}
