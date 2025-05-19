import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { createShortLinkHandler } from './createShortLinkHandler';
import { Env } from './types';

const app = new Hono<Env>();

app.use('*', async (c, next) => {
	console.log(c.env);
	if (!c.env.CORS_ORIGIN) return next();
	const corsMiddlewareHandler = cors({
		origin: c.env.CORS_ORIGIN,
	});
	return corsMiddlewareHandler(c, next);
});
app.post('/', createShortLinkHandler);

export default app;
