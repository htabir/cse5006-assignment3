<p align="center">
  <img src="client/public/logo.svg" alt="AI Capsule" width="320">
</p>

<p align="center">
  A private AI prompt library. Sign in with GitHub, then create, view, update and delete your own prompt records.<br>
  <strong>Live:</strong> <a href="https://assignment3.cse5006.htabir.me">https://assignment3.cse5006.htabir.me</a>
</p>

CSE5006 Assignment 3 — Cloud-Deployed AI Prompt Manager (full-stack CRUD + GitHub OAuth + JWT + real deployment).

---

## Contents

1. [Live deployment](#1-live-deployment)
2. [Tech stack](#2-tech-stack)
3. [Install and run](#3-install-and-run)
4. [Pages and API routes](#4-pages-and-api-routes)
5. [How the React frontend talks to Express](#5-how-the-react-frontend-talks-to-express)
6. [Authentication: GitHub OAuth → application JWT](#6-authentication-github-oauth--application-jwt)
7. [Environment variables](#7-environment-variables)
8. [Database and storage](#8-database-and-storage)
9. [Security checks (required cURL tests)](#9-security-checks-required-curl-tests)
10. [Deployment](#10-deployment)
11. [Known limitations](#11-known-limitations)
12. [AI-assisted development](#12-ai-assisted-development)
13. [Project structure and scripts](#13-project-structure-and-scripts)

---

## 1. Live deployment

|                  |                                                                                                                                                             |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Public URL**   | https://assignment3.cse5006.htabir.me                                                                                                                       |
| **Platform**     | Self-hosted VPS (Ubuntu 24.04). The app runs as one Docker Compose service; nginx reverse-proxies it over HTTPS with a Let's Encrypt certificate (certbot). |
| **Database**     | PostgreSQL 16 on the same VPS (outside the container — persistent).                                                                                         |
| **Health check** | https://assignment3.cse5006.htabir.me/api/health → `{"status":"ok"}`                                                                                        |

## 2. Tech stack

| Layer      | Choice                                                                                                                              |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Frontend   | React 19, Vite 8, TypeScript, Tailwind CSS v4, shadcn/ui, React Router 7                                                            |
| Backend    | Node.js 24, Express 5, TypeScript                                                                                                   |
| Auth       | GitHub OAuth 2.0 (web application flow) → JWT issued by Express (`jsonwebtoken`), stored in a Secure, HttpOnly cookie named `token` |
| Database   | PostgreSQL via `pg` (parameterised SQL, no ORM)                                                                                     |
| Validation | `zod`                                                                                                                               |
| Deployment | Docker (multi-stage image) + Docker Compose, nginx, certbot                                                                         |

## 3. Install and run

**Prerequisites:** Node.js ≥ 20.19, npm, a PostgreSQL server, and a GitHub OAuth App (see §6).

```bash
git clone git@github.com:htabir/cse5006-assignment3.git
cd cse5006-assignment3
npm install                 # installs the client and server workspaces
cp .env.example .env        # then fill in the values (§7)
```

Create the database named in `DATABASE_URL` (the `capsules` table is created automatically on first start), then:

```bash
npm run dev                 # Express on http://localhost:4000 + Vite on http://localhost:5173 (open this one)
```

Production build (single process serving the React build and the API from one origin):

```bash
npm run build               # builds client/dist then server/dist
npm start                   # node server/dist/index.js — http://localhost:4000
```

With Docker (what the VPS runs):

```bash
docker compose up -d --build
```

## 4. Pages and API routes

| Route                      | Access    | Purpose                                                              | Responses                                                  |
| -------------------------- | --------- | -------------------------------------------------------------------- | ---------------------------------------------------------- |
| `/`                        | Public    | Landing page explaining AI Capsule                                   | HTML                                                       |
| `/login`                   | Public    | Starts the GitHub OAuth login                                        | HTML                                                       |
| `/dashboard`               | Protected | The signed-in user's records (redirects to `/login` when signed out) | HTML                                                       |
| `GET /api/health`          | Public    | Health check                                                         | `200` `{"status":"ok"}`                                    |
| `GET /api/capsules`        | JWT       | Read own records                                                     | `200` `[…]` · `401`                                        |
| `POST /api/capsules`       | JWT       | Create own record                                                    | `201` record · `400` validation · `401`                    |
| `PUT /api/capsules/:id`    | JWT       | Update own record                                                    | `200` record · `400` · `401` · `404` not found / not owned |
| `DELETE /api/capsules/:id` | JWT       | Delete own record                                                    | `204` · `401` · `404` not found / not owned                |

Supporting routes for the OAuth flow: `GET /auth/github` (redirects to GitHub), `GET /auth/github/callback` (code exchange, issues the JWT cookie), `GET /api/auth/me` (JWT — current user), `POST /api/auth/logout` (clears the cookie).

A request to any `/api/capsules` route with no JWT or an invalid JWT gets `401 {"error":"Unauthorized"}` and no data.

## 5. How the React frontend talks to Express

- All API calls go through one wrapper, [`client/src/lib/api.ts`](client/src/lib/api.ts), which calls `fetch` with `credentials: 'include'` so the browser attaches the HttpOnly `token` cookie itself. The client never reads, stores or forwards a token.
- The CRUD functions in [`client/src/lib/capsules.ts`](client/src/lib/capsules.ts) map one-to-one onto the four `/api/capsules` routes.
- **Development:** Vite (`:5173`) proxies `/api` and `/auth` to Express (`:4000`), so the cookie is first-party.
- **Production:** Express serves `client/dist` and the API from the same origin ([`server/src/app.ts`](server/src/app.ts)); client-side routes fall back to `index.html`, unknown `/api/*` paths return JSON `404`. No CORS configuration is needed.

## 6. Authentication: GitHub OAuth → application JWT

**Provider:** GitHub OAuth (web application flow), following the Module 5 lab and GitHub's documentation. Firebase is not used; there is no username/password system.

**Flow** ([`server/src/routes/auth.ts`](server/src/routes/auth.ts), [`server/src/auth/github.ts`](server/src/auth/github.ts)):

1. `GET /auth/github` — generates a random `state`, stores it in a short-lived HttpOnly cookie, redirects to `https://github.com/login/oauth/authorize` (scope `read:user`).
2. GitHub redirects back to `GET /auth/github/callback?code=…&state=…`. The server checks `state` against the cookie (CSRF protection), exchanges the code for a GitHub access token server-to-server, and fetches `https://api.github.com/user`.
3. The GitHub access token is discarded. Express signs **its own JWT** — payload `{ sub: <GitHub user id>, login, name, avatar_url }`, `HS256`, issuer `ai-capsule`, 7-day expiry — with `JWT_SECRET` ([`server/src/auth/jwt.ts`](server/src/auth/jwt.ts)).
4. The JWT is stored in a cookie named **`token`** with `httpOnly: true`, `secure: true` in production, `sameSite: 'lax'` ([`server/src/auth/cookies.ts`](server/src/auth/cookies.ts)), and the browser is redirected to `/dashboard`.

**Verification** ([`server/src/middleware/requireAuth.ts`](server/src/middleware/requireAuth.ts)) — every protected route runs this first:

```ts
export const requireAuth: RequestHandler = (req, res, next) => {
  const token: unknown = req.cookies?.[TOKEN_COOKIE];
  if (typeof token !== 'string' || token.length === 0) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  try {
    req.user = verifyAppJwt(token); // jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'], issuer })
    next();
  } catch {
    res.status(401).json({ error: 'Unauthorized' });
  }
};
```

[`server/src/routes/capsules.ts`](server/src/routes/capsules.ts) applies it to every verb with `capsulesRouter.use(requireAuth)` on its first line. The JWT is never put in `localStorage` or an `Authorization` header — the middleware reads the cookie only.

**Creating your own GitHub OAuth App:** GitHub → Settings → Developer settings → OAuth Apps → New. Homepage URL `http://localhost:5173`, Authorization callback URL `http://localhost:5173/auth/github/callback` (use the deployed domain for production).

## 7. Environment variables

Names only — values live in `.env` locally (git-ignored) and in `/…/cse5006-assignment3/.env` on the VPS (`chmod 600`, read by Docker Compose via `env_file`). No secret value appears in this repository, in this README or in the video.

| Name                   | Purpose                                                                      |
| ---------------------- | ---------------------------------------------------------------------------- |
| `NODE_ENV`             | `development` or `production` (production turns on the `Secure` cookie flag) |
| `PORT`                 | Port Express listens on (`4000` locally)                                     |
| `APP_URL`              | Public base URL, used for redirects after login/logout                       |
| `GITHUB_CLIENT_ID`     | GitHub OAuth App client ID                                                   |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth App client secret                                               |
| `GITHUB_CALLBACK_URL`  | Must exactly match the callback URL registered on the OAuth App              |
| `JWT_SECRET`           | Secret used to sign and verify the application JWT (≥ 32 characters)         |
| `DATABASE_URL`         | PostgreSQL connection string `postgres://USER:PASSWORD@HOST:PORT/DATABASE`   |

In production the server refuses to start if any of these is missing (`Configuration error: Missing required environment variable: NAME`). At startup it logs which names are set — never the values.

## 8. Database and storage

**Creation:** on every start the server runs the schema below with `CREATE TABLE IF NOT EXISTS` ([`server/src/db/schema.ts`](server/src/db/schema.ts), [`server/src/db/init.ts`](server/src/db/init.ts)), so no manual migration step is needed.

```sql
CREATE TABLE IF NOT EXISTS capsules (
  id               SERIAL PRIMARY KEY,
  user_id          TEXT        NOT NULL,   -- GitHub user ID from the verified JWT
  project_name     TEXT        NOT NULL,
  prompt_title     TEXT        NOT NULL,
  prompt_version   TEXT,
  prompt_text      TEXT        NOT NULL,
  response_summary TEXT,
  category         TEXT,
  usefulness       TEXT,
  reviewed         BOOLEAN     NOT NULL DEFAULT FALSE,
  improved         BOOLEAN     NOT NULL DEFAULT FALSE,
  screenshot_url   TEXT,
  notes            TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS capsules_user_id_idx ON capsules (user_id);
```

**Ownership:** `user_id` is always taken from the verified JWT (`req.user.sub`) — never from the request body. Request bodies are validated with a strict schema ([`server/src/schemas/capsule.ts`](server/src/schemas/capsule.ts)), so a body containing `user_id` is rejected with `400`. Every query in [`server/src/db/capsules.repo.ts`](server/src/db/capsules.repo.ts) is scoped: `INSERT` writes the caller's id; `SELECT`, `UPDATE` and `DELETE` include `AND user_id = $n`, so another user's record simply reads as `404`.

**Persistence:** the database is PostgreSQL running on the VPS host, outside the container. Records survive container rebuilds, restarts and server reboots (verified with `docker compose down && docker compose up -d`). Storage is **persistent**, not ephemeral.

## 9. Security checks (required cURL tests)

Run on 19 Sep 2026 against the deployed URL. Output copied verbatim.

**Test 1 — no authentication**

```
$ curl -i https://assignment3.cse5006.htabir.me/api/capsules
HTTP/2 401
server: nginx/1.24.0 (Ubuntu)
date: Sat, 19 Sep 2026 11:16:17 GMT
content-type: application/json; charset=utf-8
content-length: 24
etag: W/"18-XPDV80vbMk4yY1/PADG4jYM4rSI"

{"error":"Unauthorized"}
```

**Test 2 — fake / invalid JWT**

```
$ curl -i -H "Cookie: token=fake-token-123" https://assignment3.cse5006.htabir.me/api/capsules
HTTP/2 401
server: nginx/1.24.0 (Ubuntu)
date: Sat, 19 Sep 2026 11:16:17 GMT
content-type: application/json; charset=utf-8
content-length: 24
etag: W/"18-XPDV80vbMk4yY1/PADG4jYM4rSI"

{"error":"Unauthorized"}
```

Test 1 shows the backend requires authentication; Test 2 shows it verifies the JWT signature rather than only checking that a cookie exists. `POST`, `PUT` and `DELETE` share the same middleware and return `401` the same way (`curl -i -X POST https://assignment3.cse5006.htabir.me/api/capsules`).

## 10. Deployment

- [`Dockerfile`](Dockerfile): multi-stage build on `node:24-alpine` — installs everything and runs `npm run build`, then a runtime stage with the server's production dependencies plus `server/dist` and `client/dist`, running as the unprivileged `node` user.
- [`docker-compose.yml`](docker-compose.yml): one `app` service, `env_file: .env`, `network_mode: host` (so the container reaches the host's PostgreSQL on `localhost:5432` and nginx proxies to `127.0.0.1:$PORT`), `restart: unless-stopped`, a health check on `/api/health`.
- **nginx** (configured on the server, not in this repo): a site for `assignment3.cse5006.htabir.me` that proxies to the container with `X-Forwarded-Proto`; certificate from Let's Encrypt via certbot; HTTP redirects to HTTPS. Express has `trust proxy` enabled so it knows requests arrived over HTTPS.
- **Redeploy:** `git pull && docker compose up -d --build`.

## 11. Known limitations

- The app runs on a single VPS with manual deploys and no database backups or redundancy — if the host is down, the app is down.
- The JWT is valid for 7 days and there is no refresh token or server-side revocation list; logging out clears the browser cookie only.
- No rate limiting on the API.

## 12. AI-assisted development

**Tools used:** Claude Code (Anthropic, Claude Opus) was used throughout — project setup, Express routes, SQL, React components, shadcn/ui wiring, Docker configuration, debugging and drafting this README. I reviewed, ran and verified every change before committing it.

**Problems found and corrected in AI-generated code/configuration:**

1. **Forced TLS to the database.** The generated `pool.ts` enabled `ssl` whenever `NODE_ENV=production` (an assumption from an earlier hosted-database plan). Against the VPS's local PostgreSQL the container failed with `The server does not support SSL connections`. Fixed by letting the connection string decide (`?sslmode=require` only when a hosted database needs it).
2. **Build tooling shipped in the production image.** `shadcn init` had added the `shadcn` CLI to the client's production `dependencies`; through its dependency chain the lockfile marked `typescript` as a production package, so `npm ci --omit=dev` still installed it into the Docker image. Fixed by moving `shadcn`, `tailwindcss` and `@tailwindcss/vite` to `devDependencies` and regenerating the lockfile; the image now contains only the six server runtime packages.
3. **OAuth code and state in server logs.** The request logger printed `req.originalUrl`, so the one-time `code` and `state` from the GitHub callback appeared in logs. Changed it to log the path only.

**How OAuth login, JWT verification and protected API behaviour were verified:** by completing the GitHub login on the deployed site and checking in DevTools that the `token` cookie is HttpOnly + Secure + SameSite=Lax; by the two required cURL tests above; by a token signed with a different secret, an expired token, a token with a tampered payload and a token missing the issuer — all rejected with `401`; and by confirming that an `Authorization: Bearer` header alone is ignored (also `401`).

**How CRUD behaviour and data ownership were verified:** the full create → read → update → delete cycle in the browser on the deployed site, checking each request's status in the Network tab (`201`, `200`, `200`, `204`) and that no request contains `user_id`; the same cycle driven by a throwaway Playwright script against the local production build (not part of the repo); a `POST` with `user_id` in the body → `400`; two users (locally minted tokens for two GitHub ids) where the second user sees an empty list and gets `404` on the first user's `PUT`/`DELETE`; and a container restart after which the records were still there.

**One implementation/deployment decision I can explain independently:** serving the React build and the API from a single Express process in one container behind nginx. With one origin, the JWT cookie is first-party, so no CORS configuration and no `SameSite=None` cookie are needed, and the same cookie behaviour holds in development (Vite proxy) and production. Keeping PostgreSQL on the host rather than inside the container means the data survives image rebuilds — the cost is that the deployment is tied to one server, which is acceptable for this assignment.

## 13. Project structure and scripts

```
client/   React app (Vite) — src/pages, src/components, src/hooks, src/lib/api.ts
server/   Express API — src/routes, src/middleware/requireAuth.ts, src/auth (jwt, github, cookies), src/db
Dockerfile, docker-compose.yml, .env.example
```

| Script (root)                                           | What it does                                          |
| ------------------------------------------------------- | ----------------------------------------------------- |
| `npm run dev`                                           | Express (`:4000`) and Vite (`:5173`) together         |
| `npm run build`                                         | Build the client, then the server                     |
| `npm start`                                             | Run the compiled server (serves the client build too) |
| `npm run typecheck` / `npm run lint` / `npm run format` | TypeScript, ESLint + oxlint, Prettier                 |
