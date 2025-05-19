import type {
  CreateShortLinkRequest,
  CreateShortLinkResponse,
} from "@workspace/schema";
import axios from "axios";

export const createShortLink = async (
  data: CreateShortLinkRequest
): Promise<CreateShortLinkResponse> => {
  const response = await axios.post<CreateShortLinkResponse>(
    import.meta.env.VITE_API_URL,
    data
  );

  return response.data;
};
