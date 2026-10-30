# Eden Canvas — local/sandbox setup notes

## How the app runs
- Single Node process: `server.ts` (Express API + Vite in middleware mode) on hardcoded port 3000, started with `npm run dev` (`tsx server.ts`). There is no separate backend/frontend process.
- Bring it up with `docker compose -f docker-compose.base44.yml up -d` (service `web`, base image `node:22`, source bind-mounted at `/app`). The preview is served on host port 3000.
- Dependencies come from the committed `bun.lock`: the container installs Bun at startup, runs `bun install --frozen-lockfile` into the `app_node_modules` volume, then `exec npm run dev`. After changing `package.json`, refresh `bun.lock` too or the install step fails.
- Keep the dev (Vite middleware) path. `NODE_ENV=production` switches `server.ts` to a prebuilt `dist/` bundle, which breaks the live-edit preview.
- Vite's host check passes because the platform-provided `__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS` is forwarded into the container by compose. `vite.config.ts` needs no sandbox-specific edits; never hardcode sandbox hostnames.

## Secrets and optional env
- `GEMINI_API_KEY` arrives via `/run/base44/app.env` (`env_file`, last). It is NOT required to boot: with no key the app reports `demo_mode` and labels generated concepts as demos.
- Feature-detect live AI with `curl -s localhost:3000/api/status` → `"apiKeyConfigured": true` and `"mode": "live_ready"`.
- Other optional vars read by the server/credit system: `APP_URL`, `PAYMENT_PROVIDER`, `PAYMENT_PROVIDER_SECRET_KEY`, `PAYMENT_WEBHOOK_SECRET`, `ADMIN_CONFIG_TOKEN`. Payment/credit flows stay in a development demo mode without them.

## State
- Accounts, credit balances and checkout sessions live in an in-memory ledger (`src/server/creditSystem.ts`). There is no database; everything resets when the `web` container restarts.

## Verification
- Health: `curl -s http://localhost:3000/api/status` (the compose healthcheck uses this endpoint).
- UI: `/` should render the headline "Make your rental feel like home." with no console errors.
- Tests: `docker compose -f docker-compose.base44.yml exec -T web npx tsx --test "src/**/*.test.ts"`.
  As of this setup 36 of 42 pass; the 6 failures are pre-existing spec/acceptance assertions in the app's own code (navbar, image exporter, pricing, studio dropdowns, testimonials), not environment issues.
- Live redesign calls the real Gemini image model (uses API quota/credits); the demo fallback is fully local, so avoid triggering live generation casually.
