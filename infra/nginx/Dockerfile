# Build context: repository root (see docker-compose.yml).
# Stage 1 builds the React app; stage 2 serves it with nginx over HTTPS.

FROM node:24-alpine AS build
RUN npm install --global pnpm@12.9.1
WORKDIR /app
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json tsconfig.base.json ./
COPY packages/shared/package.json packages/shared/
COPY apps/web/package.json apps/web/
RUN pnpm install --frozen-lockfile --filter @miga/web...
COPY packages/shared packages/shared
COPY apps/web apps/web
RUN pnpm --filter @miga/web... build

FROM nginx:1.29-alpine
RUN apk add --no-cache openssl
COPY infra/nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY infra/nginx/security-headers.conf /etc/nginx/snippets/security-headers.conf
COPY infra/nginx/generate-cert.sh /docker-entrypoint.d/10-generate-cert.sh
RUN chmod +x /docker-entrypoint.d/10-generate-cert.sh
COPY --from=build /app/apps/web/dist /usr/share/nginx/html
EXPOSE 443
