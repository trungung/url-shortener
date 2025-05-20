import { Hono } from "hono";

import { createShortLinkHandler } from "./sources/createShortLinkHandler";
import { getOneShortLinkHandler } from "./sources/getOneShortLinkHandler";
import { checkShortCodeExistsHandler } from "./sources/checkShortCodeExistsHandler";
import { type Env } from "./sources/types";

const app = new Hono<Env>();

app.post("/api/short-link", createShortLinkHandler);
app.get("/api/short-link/:shortCode", getOneShortLinkHandler);
app.get("/api/short-link/:shortCode/exists", checkShortCodeExistsHandler);

export default app;
