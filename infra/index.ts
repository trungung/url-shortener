import * as pulumi from "@pulumi/pulumi";
import * as cloudflare from "@pulumi/cloudflare";

// --- 1. Load config ---
const cfg = new pulumi.Config();
const accountId = cfg.require("accountId");
const baseDomain = cfg.require("baseDomain");
const zoneId = cfg.require("zoneId");

// --- 2. Production subdomains ---
const webSubdomain = `go`;
const redirectorSubdomain = `r`;

// --- 3. KV namespace ---
const kv = new cloudflare.WorkersKvNamespace("ShortLinkKV", {
  accountId,
  title: "short_link_kv_prod",
});

// --- 4. DNS records ---

new cloudflare.DnsRecord("webDns", {
  zoneId,
  name: webSubdomain,
  type: "CNAME",
  content: "workers.dev",
  ttl: 1,
  proxied: true,
});

new cloudflare.DnsRecord("redirectorDns", {
  zoneId,
  name: redirectorSubdomain,
  type: "CNAME",
  content: "workers.dev",
  ttl: 1,
  proxied: true,
});

// --- 5. Worker Routes ---
new cloudflare.WorkersRoute("webRoute", {
  zoneId,
  pattern: `${webSubdomain}/${baseDomain}/*`,
  script: "web",
});

new cloudflare.WorkersRoute("redirectorRoute", {
  zoneId,
  pattern: `${redirectorSubdomain}/${baseDomain}/*`,
  script: "redirector",
});

// --- 6. Outputs for Wrangler .env ---
export const shortLinksKvId = kv.id;
export const redirectorUrl = `https://${redirectorSubdomain}.${baseDomain}`;
