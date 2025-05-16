import * as pulumi from "@pulumi/pulumi";
import * as cloudflare from "@pulumi/cloudflare";

// --- 1. Load config ---
const cfg = new pulumi.Config();
const accountId = cfg.require("accountId");
const baseDomain = cfg.require("baseDomain");
const zoneId = cfg.require("zoneId");

// --- 2. Production subdomains ---
const frontendSubdomain = `shorten.${baseDomain}`;
const redirectorSubdomain = `r.${baseDomain}`;
const apiPath = "/api/short-link";

// --- 3. KV namespace ---
const kv = new cloudflare.WorkersKvNamespace("shortLinksKV", {
    accountId,
    title: "short_links_kv_prod",
});

// --- 4. DNS for redirector ---
new cloudflare.DnsRecord("redirectorDns", {
    zoneId,
    name: "r",
    type: "CNAME",
    content: "workers.dev",
    ttl: 1,
    proxied: true,
});

// --- 5. Worker Routes ---
new cloudflare.WorkersRoute("redirectorRoute", {
    zoneId,
    pattern: `${redirectorSubdomain}/*`,
    script: "redirector",
});

new cloudflare.WorkersRoute("urlCreatorRoute", {
    zoneId,
    pattern: `${frontendSubdomain}${apiPath}`,
    script: "url-creator",
});

// --- 6. Outputs for Wrangler .env ---
export const shortLinksKvId = kv.id;
export const creatorApiUrl = `https://${frontendSubdomain}${apiPath}`;
export const redirectorUrl = `https://${redirectorSubdomain}`;
