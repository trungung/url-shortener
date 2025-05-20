import {
  type CreateShortLinkRequest,
  type CreateShortLinkResponse,
  CreateShortLinkResponseSchema,
} from "@workspace/schema";
import axios, { AxiosError } from "axios";

export const createShortLink = async (
  data: CreateShortLinkRequest
): Promise<CreateShortLinkResponse> => {
  try {
    const response = await axios.post("/api/short-link", data);
    const parsedData = CreateShortLinkResponseSchema.parse(response.data);
    return parsedData;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ error: string }>;
      if (axiosError.response?.data?.error) {
        throw new Error(axiosError.response.data.error);
      }
    }
    throw error;
  }
};
