import type { IAdhaar } from "../types/IAdhaar";
import api from "../utils/axios";

export const processAdhaar = async (data: FormData): Promise<IAdhaar> => {
  try {
    const response = await api.post("/adhaars", data);
    return response.data;
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Something went wrong");
    }
  }
};

export const getPrviousRecords = async (
  systemId: string
): Promise<IAdhaar[]> => {
  try {
    const response = await api.get(`/adhaars/${systemId}`);
    return response.data;
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Something went wrong");
    }
  }
};
