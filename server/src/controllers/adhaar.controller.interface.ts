import { Request, Response, NextFunction } from "express";

export interface IAdhaarController {
  processAdhaar(req: Request, res: Response, next: NextFunction): Promise<void>;
  getPreviousRecords(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}
