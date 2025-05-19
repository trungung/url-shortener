import { Context } from 'hono';
import { Env } from './types';
import { CreateShortLinkRequestSchema, CreateShortLinkResponse, ShortLink } from '@workspace/schema';

export async function createShortLinkHandler(c: Context<Env>): Promise<Response> {
	try {
		const body = await c.req.json();
		const { originalUrl } = CreateShortLinkRequestSchema.parse(body);

		const kv = c.env.shortLinksKV;

		let shortCode = Math.random().toString(36).substring(2, 8);
		while (await kv.get(shortCode)) {
			shortCode = Math.random().toString(36).substring(2, 8);
		}

		const data: ShortLink = {
			shortCode,
			originalUrl,
			createdAt: new Date().toISOString(),
			clicks: 0,
		};

		await kv.put(shortCode, JSON.stringify(data));

		const returnData: CreateShortLinkResponse = { shortCode };
		return c.json(returnData);
	} catch (err) {
		return c.json({ error: 'Invalid request', err }, 400);
	}
}
