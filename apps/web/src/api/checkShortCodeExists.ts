import { CheckShortCodeExistsResponseSchema } from "@workspace/schema";
import axios from "axios";

export const checkShortCodeExists = async (code: string): Promise<boolean> => {
  const response = await axios.get(`/api/short-link/${code}/exists`);
  const parsedData = CheckShortCodeExistsResponseSchema.parse(response.data);
  return parsedData.exists;
};
