# 🔗 Cloudflare URL Shortener

A fully **serverless**, **edge-native** URL shortener built on **Cloudflare’s global infrastructure** — leveraging Workers, KV, Pages, and Pulumi to deliver blazing-fast redirection with minimal vendor lock-in.

![Architecture Diagram](./assets/url-shortener.png)

## 📁 Monorepo Structure

```
url-shortener/
├── apps/
│ ├── url-creator/ # Cloudflare Worker (POST /shortLink → saves to KV)
│ ├── redirector/ # Cloudflare Worker (GET /:code → reads from KV, redirects)
│ └── web/ # React + Vite SPA hosted on Cloudflare Pages
├── packages/
│ ├── shared/ # Shared logic: shortCode gen, types, utils
│ └── ui/ # Shared component library (shadcn/ui)
├── infra/pulumi/ # IaC: DNS, KV, routing
├── .github/workflows/ # CI/CD with GitHub Actions
├── turbo.json # Turborepo configuration
```

## 🧰 Tech Stack

| Layer         | Tech                                                    |
| ------------- | ------------------------------------------------------- |
| Frontend      | React, Vite, Tailwind CSS, `@repo/ui` (shadcn/ui)       |
| Backend       | Cloudflare Workers (`url-creator`, `redirector`)        |
| Storage       | Cloudflare KV (eventually consistent, edge-distributed) |
| Infra-as-Code | Pulumi (TypeScript, Cloudflare provider)                |
| DevOps        | GitHub Actions, Wrangler CLI, Turborepo                 |
| Deployment    | Cloudflare Pages, DNS, TLS                              |

## 🧩 Core Components

### 1. **Frontend App** (`apps/web`)

- Vite + React SPA hosted on **Cloudflare Pages**
- Accessible at: `https://shorten.${BASE_DOMAIN}`
- UI built using reusable components from `@repo/ui`
- Accepts long URLs and displays shortened versions (with optional QR code)

### 2. **Creator Worker** (`apps/url-creator`)

- Cloudflare Worker at `POST https://shorten.${BASE_DOMAIN}/short-link`
- Generates a short code, saves to KV, returns shortened URL
- Optionally includes base64 QR code
- Stateless and edge-distributed

### 3. **Redirector Worker** (`apps/redirector`)

- Cloudflare Worker at `GET https://r.${BASE_DOMAIN}/:code`
- Fetches original URL from KV and redirects via HTTP 302
- Returns custom 404 if code not found
- Designed for ultra-low latency

### 4. **UI Component Library** (`packages/ui`)

- Shared Tailwind + shadcn/ui component system
- Used across all frontend surfaces
- Published as `@repo/ui`

## ⚙️ Infrastructure & Configuration

- **Pulumi** handles provisioning:
  - DNS records (`shorten.*`, `r.*`)
  - KV namespaces
  - Worker route bindings
- Each Worker has its own `wrangler.toml` for:
  - Entry point config
  - KV/environment bindings
  - Compatibility settings

## 🔄 CI/CD Pipeline

Using **GitHub Actions**:

- On push to `main`:
  1. Deploy frontend to Cloudflare Pages
  2. Publish Workers via `wrangler publish`
  3. Run `pulumi up` to apply infrastructure updates

Secrets (Cloudflare + Pulumi tokens) are securely stored in **GitHub Secrets**.

## 🧠 Design Decisions

### Why Cloudflare Workers?

- Edge-based execution = minimal latency worldwide
- Stateless and globally replicated
- Instant cold starts and easy scaling

### Why Cloudflare KV?

- Ideal for simple, read-heavy short-link storage
- Integrated directly into the edge runtime
- Low cost and fast reads
- ❗ Not suitable for real-time writes or analytics (eventual consistency)

### Why Use the Full Cloudflare Stack?

- Single edge platform = consistent routing, deployment, and DNS
- Easier dev experience and cohesive security model
- Still portable: logic is isolated from platform APIs for easy migration

## 🔓 Vendor Portability

Although built on Cloudflare, components are **easily swappable**:

| Cloudflare  | Alternative                                     |
| ----------- | ----------------------------------------------- |
| Workers     | Vercel Edge Functions, Deno Deploy, Lambda@Edge |
| KV          | Upstash, DynamoDB, EdgeDB                       |
| Pages       | Vercel, Netlify, Firebase Hosting               |
| Pulumi (CF) | Pulumi AWS/Azure, Terraform, CDK                |

Infra and platform bindings are abstracted, making migration possible without changing core logic.

---

## ✅ Security & Best Practices

- **High-entropy short codes** (avoid sequential IDs)
- **Rate limiting** via Cloudflare Rules or Worker logic
- **URL validation** (optional: integrate Safe Browsing APIs)
- **Custom 404s** and QR code support
- **Testing**: Suggested use of Miniflare, Vitest, and Playwright/Cypress

## 🔍 Observability & Monitoring

- Not yet implemented, but should include:
  - Redirect counts
  - Failed lookups
  - Latency metrics
- Use Cloudflare Analytics Engine, Logflare, or Sentry

## 🚧 Limitations & Considerations

| Area           | Notes                                                     |
| -------------- | --------------------------------------------------------- |
| KV consistency | ~10s delay across regions — avoid in high-write scenarios |
| Abuse          | Add rate-limiting + URL validation                        |
| No analytics   | Add click tracking via Workers Analytics or edge logging  |
| No admin UI    | Could be added for managing links and metadata            |
| Testing gaps   | Add automated tests for Workers and frontend              |

## 🚀 Future Enhancements

- 📊 Link analytics dashboard (click tracking, top referrers)
- 🌐 Custom domain support per user
- ⚙️ Admin panel to view/manage links
- ⏱️ Link expiration (TTL support)
- 🌘 Dark mode and PWA frontend

## 🧪 Local Development

### Prerequisites

- Node.js (version specified in package.json's engines field, e.g., >=20)
- pnpm (version specified in package.json's packageManager field, e.g., pnpm@10.4.1)

### Commands

```bash
# Install dependencies
pnpm install

# Start all services locally
pnpm dev
```

# 📜 License

MIT © TrungUng
