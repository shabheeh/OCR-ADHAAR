import { model, Model, Schema } from "mongoose";
import { IAdhaar } from "./adhaar.entity.interface";

const adhaarSchema = new Schema<IAdhaar>(
  {
    name: { type: String, required: true },
    DOB: { type: String, required: true },
    gender: { type: String, required: true },
    address: { type: String, required: true },
    uid: { type: String, required: true },
    systemId: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const AdhaarModel: Model<IAdhaar> = model<IAdhaar>(
  "Adhaar",
  adhaarSchema
);
