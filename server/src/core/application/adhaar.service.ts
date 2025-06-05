import { inject, injectable } from "inversify";
import TYPES from "../../shared/types/inversifyjs.types";
import { IAdhaarService } from "./adhaar.service.interface";
import { IAdhaar } from "../domain/adhaar.entity.interface";
import { IAdhaarRepository } from "../infrastructure/adhaar.repository.interface";
import Tesseract from "tesseract.js";
import { extractAadhaarData } from "../../utils/textExtractor.util";
import { AppError } from "../../shared/errors/http-error";

@injectable()
export class AdhaarService implements IAdhaarService {
  constructor(
    @inject(TYPES.AdhaarRepository) private adhaarRepo: IAdhaarRepository
  ) {}

  processAdhaar = async (
    frontFile: Express.Multer.File,
    backFile: Express.Multer.File,
    systemId: string
  ): Promise<IAdhaar> => {
    const [front, back] = await Promise.all([
      Tesseract.recognize(frontFile.buffer, "eng"),
      Tesseract.recognize(backFile.buffer, "eng"),
    ]);

    const ocrText = front.data.text.concat(back.data.text);

    const adhaarDetails = extractAadhaarData(ocrText);
    adhaarDetails.systemId = systemId;

    const adhaarCreated = await this.adhaarRepo.create(adhaarDetails);

    if (!adhaarCreated) {
      throw new AppError("Failed to create adhaar details");
    }

    return adhaarCreated;
  };

  getPreviousRecords = async (systemId: string): Promise<IAdhaar[]> => {
    return await this.adhaarRepo.findAllBySystemId(systemId);
  };
}
