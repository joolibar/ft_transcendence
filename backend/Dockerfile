# Build context: repository root (see docker-compose.yml).

FROM node:24.22.2-trixie-slim AS build
RUN npm install --global pnpm@12.9.1
WORKDIR /app
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json tsconfig.base.json ./
COPY shared/package.json shared/
COPY backend/package.json backend/
RUN pnpm install --frozen-lockfile --filter @miga/backend...
COPY shared shared
COPY backend backend
RUN pnpm --filter @miga/backend... build \
 && pnpm --filter @miga/backend deploy --prod /out

FROM node:24.22.2-trixie-slim AS runtime
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /out .
USER node
EXPOSE 3000
# Apply pending database migrations, then start the server.
CMD ["sh", "-c", "node_modules/.bin/prisma migrate deploy && node dist/server.js"]
