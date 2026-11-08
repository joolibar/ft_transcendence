# Build context: repository root (see docker-compose.yml).
# Stage 1 builds the React app; stage 2 serves it with nginx over HTTPS.

FROM node:24.22.2-trixie-slim AS build
RUN npm install --global pnpm@12.9.1
WORKDIR /app
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json tsconfig.base.json ./
COPY shared/package.json shared/
COPY frontend/package.json frontend/
RUN pnpm install --frozen-lockfile --filter @miga/frontend...
COPY shared shared
COPY frontend frontend
RUN pnpm --filter @miga/frontend... build

FROM nginx:1.29.8-alpine3.23
RUN apk add --no-cache openssl
COPY infra/nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY infra/nginx/security-headers.conf /etc/nginx/snippets/security-headers.conf
COPY infra/nginx/generate-cert.sh /docker-entrypoint.d/10-generate-cert.sh
RUN chmod +x /docker-entrypoint.d/10-generate-cert.sh
COPY --from=build /app/frontend/dist /usr/share/nginx/html
EXPOSE 443
