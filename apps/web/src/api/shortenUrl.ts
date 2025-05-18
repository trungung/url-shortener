import type { ShortenFormSchema } from "../schemas/shortenFormSchema";

export const shortenUrl = async (data: ShortenFormSchema): Promise<{ shortUrl: string }> => {
  // TODO: Replace with actual API call to your Cloudflare Worker
  console.log('Shortening URL:', data.url);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        shortUrl: `${import.meta.env.VITE_REDIRECT_URL}/${Math.random().toString(36).substring(2, 8)}`,
      });
    }, 800);
  });
};
