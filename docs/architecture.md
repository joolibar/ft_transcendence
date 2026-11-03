# Architecture

## Services

```
                Browser
                   │  HTTPS (only public port)
                   ▼
   ┌────────────────────────────────┐
   │ web — nginx                    │
   │ serves the React app           │
   │ /api/*        → api            │
   │ /socket.io/*  → api            │
   └───────────────┬────────────────┘
                   │  HTTP (internal Docker network)
                   ▼
   ┌────────────────────────────────┐
   │ api — Fastify + Prisma         │
   └───────────────┬────────────────┘
                   │
                   ▼
   ┌────────────────────────────────┐
   │ db — PostgreSQL                │
   └────────────────────────────────┘
```

All three are defined in [`docker-compose.yml`](../docker-compose.yml). They start in order, each one waiting until the previous is healthy: `db` (accepts connections) → `api` (answers `/api/health`) → `web`.

In local development, `make db` starts only the database and publishes it on `localhost:5432` through [`docker-compose.dev.yml`](../docker-compose.dev.yml). Then `pnpm dev` runs the API on port 3000 and Vite serves the web app on port 5173, forwarding `/api` to the API.

## Security at the edges

| Measure                             | Where                                                                                                                                                                                  |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| HTTPS only, TLS 1.2+                | nginx is the only published port ([`nginx.conf`](../infra/nginx/nginx.conf))                                                                                                           |
| Security headers on the web app     | [`security-headers.conf`](../infra/nginx/security-headers.conf): HSTS, no sniffing, no framing, referrer and permissions policies, Content-Security-Policy, Cross-Origin-Opener-Policy |
| Security headers on the API         | `@fastify/helmet` in [`app.ts`](../apps/api/src/app.ts)                                                                                                                                |
| Database not reachable from outside | `db` publishes no port in `docker-compose.yml`                                                                                                                                         |
| Real client IP behind the proxy     | Fastify `trustProxy`, using nginx's `X-Forwarded-*` headers                                                                                                                            |
| Secrets out of Git                  | `.env` is ignored; `.env.example` documents every variable                                                                                                                             |

### Content-Security-Policy

The web app is served with a strict Content-Security-Policy: the browser only runs scripts, applies styles, shows images and opens connections that come from Miga's own origin. If an attacker manages to inject HTML (cross-site scripting), the browser still refuses to run it.

What this means when writing code:

- **No inline scripts or styles in HTML** (`<script>…</script>`, `<style>`, `onclick="…"`). React's `style={{…}}` is fine: React applies it from JavaScript.
- **No `eval` or `new Function`**, and no libraries that need them.
- **External services must be allowed explicitly.** Images from a places API, an OAuth provider's avatars or a map tile server will be blocked until their origin is added to the right directive (`img-src`, `connect-src`…) in `security-headers.conf`. Add only the exact origin, never a wildcard, and say why in the PR.
- **Sign in with OAuth by redirecting the page**, not in a popup: `Cross-Origin-Opener-Policy: same-origin` cuts the link between Miga and windows from other sites.

A blocked resource shows up in the browser console as "Refused to load … because it violates the following Content Security Policy directive".

## Repository layout

```
apps/
  api/                    Backend
    prisma/               Database schema, migrations, seed data
    src/
      modules/<domain>/   One folder per business domain
      plugins/            Cross-cutting pieces: database, auth, sockets
      config/             Environment variables, validated at startup
      lib/                Pure helpers with no business logic
      app.ts              Builds the Fastify app and registers modules
      server.ts           Starts the server
  web/                    Frontend
    src/
      app/                Root component, router, global providers
      pages/              One component per route; only composes pieces
      features/<domain>/  Components, hooks and API calls of one domain
      components/ui/      Design system: generic, reusable, no business logic
      components/layout/  Header, footer, navigation
      lib/                HTTP client and generic helpers
      i18n/               Translations (es, ca, en)
      styles/             Global CSS and Tailwind setup
packages/
  shared/src/<domain>.ts  Zod schemas and types used by web and api
infra/nginx/              HTTPS reverse proxy and the web image
docs/                     This documentation
```

Folders are created when the first file that needs them is written, not in advance.

## Rules

1. **Organise by domain, the same way on both sides.** The `reviews` domain lives in `api/src/modules/reviews/`, `web/src/features/reviews/` and `shared/src/reviews.ts`.
2. **Backend module = routes + service.** `<domain>.routes.ts` handles HTTP (URL, input validation, response). `<domain>.service.ts` holds business logic and database access. Routes never query the database directly.
3. **Pages are thin, features are thick.** A page only arranges feature components; logic lives in the feature.
4. **`components/ui` knows nothing about Miga's business.** If a component mentions places, reviews or users, it belongs in a feature.
5. **Tests live next to the code they test** (`reviews.service.test.ts` beside `reviews.service.ts`). See the [testing guide](guides/testing.md).
6. **Validate with the shared schema on both sides.** The web app validates forms with it for fast feedback; the API validates every request with it because the browser can be bypassed.

## Naming

| What                     | Convention | Example              |
| ------------------------ | ---------- | -------------------- |
| Files and folders        | kebab-case | `reviews.service.ts` |
| React component files    | PascalCase | `ReviewCard.tsx`     |
| Variables and functions  | camelCase  | `getPlaceById`       |
| Types and components     | PascalCase | `HealthResponse`     |
| Constants                | UPPER_CASE | `MAX_GROUP_SIZE`     |
| Database tables (Prisma) | PascalCase | `model Review`       |

Everything (code, comments, commits, docs) is written in English.
