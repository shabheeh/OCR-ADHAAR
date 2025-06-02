import { inject } from "inversify";
import { IAdhaarController } from "./adhaar.controller.interface";
import TYPES from "../../shared/types/inversifyjs.types";
import { Request, Response, NextFunction } from "express";
import { ValidationError } from "../../shared/errors/http-error";
import { IAdhaarService } from "../../core/application/adhaar.service.interface";

export class AdhaarController implements IAdhaarController {
  constructor(
    @inject(TYPES.AdhaarService) private adhaarService: IAdhaarService
  ) {}

  async processAdhaar(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const frontFile = (
        req.files as { [fieldname: string]: Express.Multer.File[] }
      )?.["front"]?.[0];
      const backFile = (
        req.files as { [fieldname: string]: Express.Multer.File[] }
      )?.["back"]?.[0];

      if (!frontFile || !backFile) {
        throw new ValidationError("Both images are required");
      }

      const result = await this.adhaarService.processAdhaar(
        frontFile,
        backFile
      );

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
