import { inject, injectable } from "inversify";
import { IAdhaarController } from "./adhaar.controller.interface";
import TYPES from "../shared/types/inversifyjs.types";
import { Request, Response, NextFunction } from "express";
import { ValidationError } from "../shared/errors/http-error";
import { IAdhaarService } from "../services/adhaar.service.interface";
import { HttpStatusCode } from "../shared/constants/httpStatusCodes";

@injectable()
export class AdhaarController implements IAdhaarController {
  constructor(
    @inject(TYPES.AdhaarService) private adhaarService: IAdhaarService
  ) {}

  processAdhaar = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
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

      const systemId = req.body.systemId;

      const result = await this.adhaarService.processAdhaar(
        frontFile,
        backFile,
        systemId
      );

      res.status(HttpStatusCode.OK).json(result);
    } catch (error) {
      next(error);
    }
  };

  getPreviousRecords = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const systemId = req.params.systemId;

      if (!systemId) {
        throw new ValidationError();
      }

      const previousRecoreds =
        await this.adhaarService.getPreviousRecords(systemId);
      res.status(HttpStatusCode.OK).json(previousRecoreds);
    } catch (error) {
      next(error);
    }
  };
}
