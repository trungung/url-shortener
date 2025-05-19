import { Hono } from "hono";

import { createShortLinkHandler } from "./sources/createShortLinkHandler";
import { type Env } from "./sources/types";

const app = new Hono<Env>();

app.post("/api/short-link", createShortLinkHandler);

export default app;
