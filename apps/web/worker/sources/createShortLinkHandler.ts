import { type Context } from "hono";
import { type Env } from "./types";
import {
  CreateShortLinkRequestSchema,
  type CreateShortLinkResponse,
  type ShortLink,
} from "@workspace/schema";

export async function createShortLinkHandler(
  c: Context<Env>,
): Promise<Response> {
  try {
    // validate request
    const body = await c.req.json();
    const { originalUrl } = CreateShortLinkRequestSchema.parse(body);

    // generate short code
    const kv = c.env.ShortLinkKV;

    let shortCode: string;
    if (body.customCode) {
      const existingShortLink = await kv.get(body.customCode);
      if (existingShortLink) {
        return c.json({ error: "Custom code already exists" }, 400);
      }
      shortCode = body.customCode;
    } else {
      shortCode = Math.random().toString(36).substring(2, 10);
      while (await kv.get(shortCode)) {
        shortCode = Math.random().toString(36).substring(2, 10);
      }
    }

    // save to kv
    const data: ShortLink = {
      shortCode,
      originalUrl,
      createdAt: new Date().toISOString(),
      expiresAt: body.expiresAt,
      clicks: 0,
    };

    await kv.put(shortCode, JSON.stringify(data));

    // return response
    const returnData: CreateShortLinkResponse = { shortCode };
    return c.json(returnData);
  } catch (err) {
    return c.json({ error: "Invalid request", err }, 400);
  }
}
