import { IAdhaar } from "../domain/adhaar.entity.interface";

export interface IAdhaarService {
  processAdhaar(
    frontFile: Express.Multer.File,
    backFile: Express.Multer.File
  ): Promise<IAdhaar>;
}
