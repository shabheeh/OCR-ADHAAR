import { inject, injectable } from "inversify";
import TYPES from "../shared/types/inversifyjs.types";
import { IAdhaarService } from "./adhaar.service.interface";
import { IAdhaar } from "../models/adhaar/adhaar.entity.interface";
import { IAdhaarRepository } from "../repositories/adhaar.repository.interface";
import Tesseract from "tesseract.js";
import { extractAadhaarData } from "../utils/textExtractor.util";
import { AppError } from "../shared/errors/http-error";
import sharp from "sharp";

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
    try {
      const [frontProcessed, backProcessed] = await Promise.all([
        sharp(frontFile.buffer)
          .resize(1200, null, { withoutEnlargement: true })
          .greyscale()
          .normalize()
          .png()
          .toBuffer(),
        sharp(backFile.buffer)
          .resize(1200, null, { withoutEnlargement: true })
          .greyscale()
          .normalize()
          .png()
          .toBuffer(),
      ]);

      const worker = await Tesseract.createWorker("eng");

      const [front, back] = await Promise.all([
        worker.recognize(frontProcessed),
        worker.recognize(backProcessed),
      ]);

      await worker.terminate();

      const ocrText = front.data.text.concat(back.data.text);
      const adhaarDetails = extractAadhaarData(ocrText);
      adhaarDetails.systemId = systemId;

      const adhaarCreated = await this.adhaarRepo.create(adhaarDetails);

      if (!adhaarCreated) {
        throw new AppError("Failed to create adhaar details");
      }

      return adhaarCreated;
    } catch (error) {
      console.error("OCR Error:", error);
      throw error;
    }
  };

  getPreviousRecords = async (systemId: string): Promise<IAdhaar[]> => {
    return await this.adhaarRepo.findAllBySystemId(systemId);
  };
}
