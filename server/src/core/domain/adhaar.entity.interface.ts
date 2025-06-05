import { Document } from "mongoose";

export interface IAdhaar extends Document {
  name: string;
  DOB: string;
  gender: string;
  address: string;
  uid: string;
  systemId: string;
}
