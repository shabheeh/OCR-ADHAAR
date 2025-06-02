import { IAdhaar } from "../domain/adhaar.entity.interface";

export interface IAdhaarRepository {
  create(data: Partial<IAdhaar>): Promise<IAdhaar | null>;
}