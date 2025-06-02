import { Document } from "mongoose";

export interface IAdhaar extends Document {
    name: string;
    DOB: Date;
    gender: string;
    address: string;
    uid: string;
}