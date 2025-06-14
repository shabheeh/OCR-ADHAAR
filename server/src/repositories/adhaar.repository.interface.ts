import { IAdhaar } from "../models/adhaar/adhaar.entity.interface";

export interface IAdhaarRepository {
  create(data: Partial<IAdhaar>): Promise<IAdhaar | null>;
  findAllBySystemId(systemId: string): Promise<IAdhaar[]>;
}
