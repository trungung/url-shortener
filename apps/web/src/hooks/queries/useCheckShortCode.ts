import { useQuery } from "@tanstack/react-query";
import { checkShortCodeExists } from "../../api/checkShortCodeExists";

export function useCheckShortCode(code: string | undefined, enabled?: boolean) {
  return useQuery({
    queryKey: ["shortCode", code],
    queryFn: () => {
      if (!code) {
        return Promise.resolve(false);
      }
      return checkShortCodeExists(code);
    },
    enabled: !!code && (enabled ?? true),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}
