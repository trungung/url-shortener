import { z } from "zod";

export const ShortLinkSchema = z.object({
  shortCode: z.string().min(1),
  originalUrl: z.string().url(),
  createdAt: z.string().datetime(),
  expiresAt: z.string().datetime().optional(),
  clicks: z.number().optional(),
});

export type ShortLink = z.infer<typeof ShortLinkSchema>;

export const CreateShortLinkRequestSchema = z.object({
  originalUrl: z
    .string()
    .url({ message: "Please enter a valid URL (e.g., https://example.com)" }),
  customCode: z
    .string()
    .min(3)
    .max(20)
    .regex(/^[a-zA-Z0-9_-]+$/)
    .optional(),
  expiresAt: z.string().datetime().optional(),
});

export type CreateShortLinkRequest = z.infer<
  typeof CreateShortLinkRequestSchema
>;

export const CreateShortLinkResponseSchema = z.object({
  shortCode: z.string(),
});

export type CreateShortLinkResponse = z.infer<
  typeof CreateShortLinkResponseSchema
>;
