FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

FROM base AS build
COPY . .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm --filter @repo/web-client build

FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/apps/web-client/.next/standalone ./
COPY --from=build /app/apps/web-client/.next/static ./apps/web-client/.next/static
COPY --from=build /app/apps/web-client/public ./apps/web-client/public

EXPOSE 3000
CMD ["node", "apps/web-client/server.js"]