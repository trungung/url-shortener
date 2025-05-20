import { ShortLinkSchema } from "@workspace/schema";

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const url = new URL(request.url);
    const shortCode = url.pathname.slice(1);

    if (!shortCode) {
      return new Response("Missing short code.", { status: 400 });
    }

    const record = await env.ShortLinkKV.get(shortCode, { type: "json" });
    if (!record) {
      return new Response("Short link not found.", { status: 404 });
    }

    const parsedRecord = ShortLinkSchema.parse(record);
    if (
      parsedRecord.expiresAt &&
      new Date(parsedRecord.expiresAt) < new Date()
    ) {
      return new Response("Short link expired.", { status: 404 });
    }
    return Response.redirect(parsedRecord.originalUrl, 302);
  },
} satisfies ExportedHandler<Env>;
