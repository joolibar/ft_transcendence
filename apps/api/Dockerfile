# Build context: repository root (see docker-compose.yml).

FROM node:24.22.2-alpine3.24 AS build
RUN npm install --global pnpm@12.9.1
WORKDIR /app
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json tsconfig.base.json ./
COPY packages/shared/package.json packages/shared/
COPY apps/api/package.json apps/api/
RUN pnpm install --frozen-lockfile --filter @miga/api...
COPY packages/shared packages/shared
COPY apps/api apps/api
RUN pnpm --filter @miga/api... build \
 && pnpm --filter @miga/api deploy --prod /out

FROM node:24.22.2-alpine3.24 AS runtime
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /out .
USER node
EXPOSE 3000
# Apply pending database migrations, then start the server.
CMD ["sh", "-c", "node_modules/.bin/prisma migrate deploy && node dist/server.js"]
