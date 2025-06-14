import { IAdhaar } from "../models/adhaar/adhaar.entity.interface";

export interface IAdhaarService {
  processAdhaar(
    frontFile: Express.Multer.File,
    backFile: Express.Multer.File,
    systemId: string
  ): Promise<IAdhaar>;
  getPreviousRecords(systemId: string): Promise<IAdhaar[]>;
}
