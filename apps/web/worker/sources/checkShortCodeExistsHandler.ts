import { type Context } from "hono";
import { type Env } from "./types";

export async function checkShortCodeExistsHandler(
  c: Context<Env>
): Promise<Response> {
  try {
    const shortCode = c.req.param("shortCode");
    const kv = c.env.ShortLinkKV;
    const shortLink = await kv.get(shortCode);
    if (!shortLink) {
      return c.json({ exists: false }, 200);
    }
    return c.json({ exists: true }, 200);
  } catch (err) {
    return c.json({ error: "Invalid request", err }, 400);
  }
}
