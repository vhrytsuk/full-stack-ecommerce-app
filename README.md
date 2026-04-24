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
