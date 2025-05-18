import { z } from "zod";

export const shortenFormSchema = z.object({
  url: z.string().url({ message: "Please enter a valid URL" }),
});

export type ShortenFormSchema = z.infer<typeof shortenFormSchema>;