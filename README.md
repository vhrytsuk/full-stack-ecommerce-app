# Full-stack E-commerce Monorepo

This repository uses `pnpm` workspaces and Turborepo.

## Structure

- `apps/backend`: Express API
- `apps/web-client`: Next.js storefront
- `apps/web-admin`: Admin web app
- `packages/api-contracts`: Shared Zod schemas and inferred types
- `packages/ui`: Shared React UI primitives
- `packages/utils`: Shared framework-agnostic utilities
- `packages/eslint-config`: Shared ESLint configs
- `packages/typescript-config`: Shared TypeScript configs

## Commands

- `pnpm install`
- `pnpm dev`
- `pnpm dev:backend`
- `pnpm dev:web-client`
- `pnpm dev:web-admin`
- `pnpm build`
- `pnpm lint`
- `pnpm test`
- `pnpm typecheck`

## Workspace packages

Applications consume internal packages using `workspace:*`, for example:

```json
{
  "dependencies": {
    "@repo/api-contracts": "workspace:*"
  }
}
```

## Aliases

Frontend apps expose:

- `@/*` for the local app root
- `@ui` for shared UI components
- `@contracts` for shared Zod contracts
- `@utils` for shared utilities

The backend keeps package imports such as `@repo/api-contracts` and `@repo/utils` because they are safe with plain Node.js ESM output.

## Shared frontend versions

Frontend dependency versions are centralized in `pnpm-workspace.yaml` via the pnpm `catalog` feature.
The frontend package manifests reference them with `catalog:` instead of repeating raw semver strings.

## Run Apps Separately

From the repo root:

- `pnpm dev:backend`
- `pnpm dev:web-client`
- `pnpm dev:web-admin`

You can still use direct filters if needed:

- `pnpm --filter @repo/backend dev`
- `pnpm --filter @repo/web-client dev`
- `pnpm --filter @repo/web-admin dev`

The root `dev:*` scripts load `.env` and `.env.development` automatically before starting the selected app.

## Docker Development

Use the production-style compose file when you want built images:

- `docker compose up --build`

Use the standalone development stack when you want backend, both frontend apps, and Postgres with live reload:

- `docker compose -f docker-compose.dev.yml up --build`
- `pnpm dev:docker`
- `pnpm dev:docker:build`

This development compose file:

- mounts the repository into the container
- runs `tsx watch` for the backend
- runs `next dev` for `web-client`
- runs `vite` for `web-admin`
- regenerates Prisma client on backend container start
- applies existing Prisma migrations with `prisma migrate deploy`
- avoids rebuilding images for normal route, component, or service changes

Postgres data is stored in the named Docker volume `full-stack-ecommerce-db-data`.
Use `pnpm dev:docker:down` or `docker compose -f docker-compose.dev.yml down` to stop the stack while keeping data.
Do not use `docker compose down -v` unless you intentionally want to delete the local database.

Useful database commands while the dev stack is running:

- `pnpm dev:docker:migrate`
- `pnpm dev:docker:generate`
- `pnpm dev:docker:seed`
- `pnpm dev:docker:studio`

Prefer `pnpm dev:docker:studio` over `pnpm --filter @repo/backend db:studio` while using Docker.
It runs Prisma Studio inside the backend container, so it uses the same `DATABASE_URL` as the API.
Open Prisma Studio at `http://localhost:5555`.

## Environment Variables

Configure local ports, hosts, API paths, and server directories in:

- `.env`
- `.env.development`
- `.env.example`

Key variables:

- `BACKEND_HOST`
- `BACKEND_PORT`
- `BACKEND_API_BASE_PATH`
- `BACKEND_CORS_ORIGIN`
- `BACKEND_UPLOADS_DIR`
- `BACKEND_PUBLIC_DIR`
- `WEB_CLIENT_HOST`
- `WEB_CLIENT_PORT`
- `NEXT_PUBLIC_API_BASE_URL`
- `WEB_ADMIN_HOST`
- `WEB_ADMIN_PORT`
- `VITE_API_BASE_URL`
