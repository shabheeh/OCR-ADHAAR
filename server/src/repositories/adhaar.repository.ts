import { inject, injectable } from "inversify";
import TYPES from "../shared/types/inversifyjs.types";
import { IAdhaarRepository } from "./adhaar.repository.interface";
import { Model } from "mongoose";
import { IAdhaar } from "../models/adhaar/adhaar.entity.interface";

@injectable()
export class AdhaarRepository implements IAdhaarRepository {
  constructor(
    @inject(TYPES.AdhaarModel) protected readonly model: Model<IAdhaar>
  ) {
    this.model = model;
  }

  async create(data: Partial<IAdhaar>): Promise<IAdhaar | null> {
    const doc = new this.model(data);
    return await doc.save();
  }

  async findAllBySystemId(systemId: string): Promise<IAdhaar[]> {
    const docs = await this.model.find({ systemId });
    return docs;
  }
}
