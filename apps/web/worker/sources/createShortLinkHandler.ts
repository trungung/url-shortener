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

    let shortCode = Math.random().toString(36).substring(2, 8);
    while (await kv.get(shortCode)) {
      shortCode = Math.random().toString(36).substring(2, 8);
    }

    // save to kv
    const data: ShortLink = {
      shortCode,
      originalUrl,
      createdAt: new Date().toISOString(),
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
