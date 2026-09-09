# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

PixelBuddy is an npm-workspaces monorepo scaffolded by [Better-T-Stack](https://better-t-stack.dev) (see `bts.jsonc` for the exact generator invocation and addon list). Stack: Next.js (web) + Expo/React Native (native) + Fastify (server) + oRPC (API layer) + Drizzle/PostgreSQL (data) + Turborepo (task orchestration) + Biome/Ultracite (lint & format).

Code-style rules (type safety, React/JSX conventions, async patterns, security, performance) are already documented in `.claude/CLAUDE.md` and enforced automatically by a `PostToolUse` hook that runs `ultracite fix` after every file edit — don't duplicate those rules here, just follow them.

## Working Rules
- Before changing code, inspect the relevant existing files.
- Do not introduce new dependencies without explaining why.
- Do not modify unrelated files.
- Prefer existing project patterns over introducing new abstractions.
- Never replace Uniwind with NativeWind.
- Do not expose health data or identifiers in logs.
- Do not change API contracts without considering backward compatibility.
- Do not run destructive database commands unless explicitly requested.
- After changes, run the smallest relevant validation commands.

## Commands

Run from the repo root unless noted. All root scripts fan out through Turborepo (`turbo run <task>`), optionally scoped with `-F <package>`.

```bash
npm install                 # install all workspace deps

npm run dev                 # start web (3001) + server (3000) + native (Expo) together
npm run dev:web             # web only    -> apps/web    (next dev --port 3001)
npm run dev:server          # server only -> apps/server (tsx watch src/index.ts)
npm run dev:native          # native only -> apps/native (expo start --clear)

npm run build                # build all apps
npm run check-types          # tsc across all workspaces (per-app: `tsc --noEmit` or `tsc -b`)

npm run check                # ultracite check (lint, no fixes)
npm run fix                  # ultracite fix (auto-fix + format)

npm run db:start             # docker compose up -d postgres
npm run db:watch             # postgres in foreground
npm run db:stop / db:down    # stop / remove postgres container
npm run db:push              # drizzle-kit push (schema -> db, no migration files)
npm run db:generate          # drizzle-kit generate (create migration files from schema)
npm run db:migrate           # drizzle-kit migrate (apply migration files)
npm run db:studio            # drizzle-kit studio (db browser UI)

npm run docker:build / docker:up / docker:down / docker:logs   # full server+postgres stack via docker-compose.yml
```

Target a single workspace directly with Turborepo's filter flag, e.g. `turbo run build -F server`, or run a package's own script from its directory (`cd apps/server && npm run dev`).

**There is no test runner configured anywhere in this repo** (no test files, no vitest/jest in any `package.json`, no `test` task in `turbo.json`). Don't assume a `test` script exists — if asked to add tests, a runner has to be set up first.

## Architecture

### Monorepo layout

- `apps/web` — Next.js 16 App Router frontend, dev port 3001
- `apps/native` — Expo Router / React Native app
- `apps/server` — Fastify backend, port 3000
- `packages/api` — the single oRPC router + procedure builder, shared by server (as implementation) and web/native (as types only)
- `packages/db` — Drizzle ORM schema, migrations, and db client
- `packages/env` — typed, runtime-specific env var validation
- `packages/ui` — shared shadcn-derived React components, consumed by `apps/web` only
- `packages/config` — just a shared `tsconfig.base.json` extended by every other package/app

### API layer: oRPC end-to-end types, no codegen

All API routes are defined once, as a flat object, in `packages/api/src/routers/index.ts` (currently just `healthCheck`). The procedure builder lives in `packages/api/src/index.ts` (`os.$context<Context>()` → exported as `publicProcedure`), and request context comes from `packages/api/src/context.ts` (`createContext`, currently a stub returning `{ auth: null, session: null }`).

`apps/server/src/index.ts` registers this router twice on the same Fastify instance:
- `RPCHandler` at `/rpc/*` — the internal RPC protocol used by both frontends
- `OpenAPIHandler` at `/api-reference/*` — REST/OpenAPI surface with a Zod→JSON-Schema converter

Both `apps/web/src/utils/orpc.ts` and `apps/native/utils/orpc.ts` build a client the same way: `RPCLink` → `createORPCClient` → `createTanstackQueryUtils(client)`, exported as `orpc`, pointed at `${SERVER_URL}/rpc`. This gives full type inference from the server's `AppRouter` type (imported as a type-only import from `@PixelBuddy/api/routers/index`) directly into `useQuery(orpc.someProcedure.queryOptions())` calls — no generated client, no manual DTOs. Native's link swaps in `expo/fetch` instead of the platform default. Web's link has extra logic to resolve the server URL across SSR / browser / Vercel deploy contexts.

When adding a new API route: add a procedure to `appRouter` in `packages/api/src/routers/index.ts`; it becomes available to both frontends automatically through the shared type.

### Database

`packages/db/src/index.ts` exports a singleton `db` (`drizzle(env.DATABASE_URL, { schema })` over `drizzle-orm/node-postgres`). Schema files live in `packages/db/src/schema/` (currently empty — no tables defined yet) and are read by both the app (`src/index.ts`) and `drizzle-kit` (`drizzle.config.ts`, which loads `apps/server/.env` for `DATABASE_URL`). Migrations are generated into `packages/db/src/migrations/`.

### Environment variables

`packages/env` exports three separate, runtime-specific validated env modules built with `@t3-oss/env-core`/`env-nextjs` + zod:
- `@PixelBuddy/env/server` — `DATABASE_URL`, `CORS_ORIGIN`, `NODE_ENV` (used by `apps/server`, `packages/db`)
- `@PixelBuddy/env/web` — `NEXT_PUBLIC_SERVER_URL` (used by `apps/web`)
- `@PixelBuddy/env/native` — `EXPO_PUBLIC_SERVER_URL` (used by `apps/native`)

Each app has its own `.env` at its root (`apps/server/.env`, `apps/web/.env`, `apps/native/.env`) already set up for local dev against `localhost`. Import the variant matching the code you're in — never reach for `process.env` directly in app code.

### Native app styling

`apps/native` uses **Uniwind** (Tailwind v4 runtime for React Native — `uniwind/metro` in `metro.config.js`, `useUniwind`/`Uniwind.setTheme` in `contexts/app-theme-context.tsx`), not NativeWind. It also uses `heroui-native` for UI primitives rather than `packages/ui` (which is web-only in practice, even though nothing prevents native from importing it).

### Docker

`docker-compose.yml` only containerizes `server` + `postgres` (per `apps/server/Dockerfile`, a multi-stage Node 24 build); `web` and `native` are not containerized. Compose overrides `DATABASE_URL` for container-to-container networking; other env values come from each app's `.env` file.

## Claude Code configuration in this repo

- `.claude/CLAUDE.md` — Ultracite/Biome code-standards checklist, auto-enforced via the `ultracite fix` `PostToolUse` hook in `.claude/settings.json`.
- `.claude/skills/` — 10 pinned skills (tracked in `skills-lock.json`) covering Ultracite, Turborepo, shadcn, HeroUI Native, Expo dev-client/Tailwind setup, and Vercel's React/React Native/composition best-practice packs. Note: the `expo-tailwind-setup` skill documents a NativeWind v5 setup that does **not** match this repo — `apps/native` actually uses Uniwind, so don't follow that skill's install steps here.
- `.mcp.json` / `.vscode/mcp.json` — four MCP servers (`better-t-stack`, `context7`, `next-devtools`, `expo-mcp`), duplicated per-tool; keep both in sync if servers change.

There is also a project-level `./.codex/config.toml` (OpenAI Codex CLI config) in this repo. Reply `/import` if you'd like to scan it for anything importable into Claude Code.
