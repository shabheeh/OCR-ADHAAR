import { inject, injectable } from "inversify";
import TYPES from "../../shared/types/inversifyjs.types";
import { IAdhaarService } from "./adhaar.service.interface";
import { IAdhaar } from "../domain/adhaar.entity.interface";
import { IAdhaarRepository } from "../infrastructure/adhaar.repository.interface";
import Tesseract from "tesseract.js";

@injectable()
export class AdhaarService implements IAdhaarService {
  constructor(
    @inject(TYPES.AdhaarRepository) private adhaarRepo: IAdhaarRepository
  ) {}

  processAdhaar = async (
    frontFile: Express.Multer.File,
    backFile: Express.Multer.File
  ): Promise<IAdhaar> => {
    const [front, back] = await Promise.all([
      Tesseract.recognize(frontFile.buffer, "eng"),
      Tesseract.recognize(backFile.buffer, "eng"),
    ]);

    const adhaarDetails = {
      name: front.data.text,
      uid: back.data.text,
      address: front.data.text,
      gender: back.data.text,
      DOB: new Date(),
    } as IAdhaar;

    console.log(adhaarDetails);
    return adhaarDetails;
  };
}
