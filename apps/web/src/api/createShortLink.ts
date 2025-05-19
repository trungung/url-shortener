import type {
  CreateShortLinkRequest,
  CreateShortLinkResponse,
} from "@workspace/schema";
import axios from "axios";

export const createShortLink = async (
  data: CreateShortLinkRequest
): Promise<CreateShortLinkResponse> => {
  const response = await axios.post<CreateShortLinkResponse>(
    "/api/short-link",
    data
  );

  return response.data;
};
