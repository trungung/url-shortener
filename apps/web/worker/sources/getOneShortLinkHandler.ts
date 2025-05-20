import { type Context } from "hono";
import { type Env } from "./types";
import { ShortLinkSchema } from "@workspace/schema";

export async function getOneShortLinkHandler(
  c: Context<Env>
): Promise<Response> {
  try {
    const shortCode = c.req.param("shortCode");
    const kv = c.env.ShortLinkKV;
    const shortLink = await kv.get(shortCode);
    if (!shortLink) {
      return c.json({ error: "Short link not found" }, 404);
    }
    const shortLinkData = ShortLinkSchema.parse(JSON.parse(shortLink));
    return c.json(shortLinkData);
  } catch (err) {
    return c.json({ error: "Invalid request", err }, 400);
  }
}
