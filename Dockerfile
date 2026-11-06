# Single-container deployment for PTR ALUMNI NETWORK.
# Builds the React frontend and serves it together with the PHP REST API
# from one Apache + PHP runtime. MySQL is provided separately (managed
# database or the docker-compose service).

# ---------- Stage 1: build the frontend ----------
FROM node:22-bookworm-slim AS build
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@10.18.0 --activate
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY patches ./patches
RUN CI=1 pnpm install --frozen-lockfile
COPY . .
# Deploy at the domain root by default. Override BASE_PATH at build time for a subpath.
ARG BASE_PATH=/
RUN pnpm exec vite build --base=${BASE_PATH} --outDir /app/dist/public --emptyOutDir

# ---------- Stage 2: Apache + PHP runtime ----------
FROM php:8.2-apache
RUN a2enmod rewrite headers
RUN apt-get update \
    && apt-get install -y --no-install-recommends libonig-dev libonig5 \
    && docker-php-ext-install pdo pdo_mysql fileinfo mbstring \
    && apt-get purge -y --auto-remove libonig-dev \
    && rm -rf /var/lib/apt/lists/*
RUN docker-php-ext-enable opcache 2>/dev/null || true

WORKDIR /var/www/html
# Frontend build output
COPY --from=build /app/dist/public /var/www/html
# PHP REST API
COPY api /var/www/html/api
# Apache rewrite rules (adjusted for root deployment below)
COPY .htaccess /var/www/html/.htaccess
# Uploads hardening
COPY uploads/.htaccess /var/www/html/uploads/.htaccess
RUN mkdir -p /var/www/html/uploads && chown -R www-data:www-data /var/www/html/uploads

# Load configuration only from environment variables at startup.
RUN mkdir -p /usr/local/share/ptrp
COPY deploy/runtime-config.php /usr/local/share/ptrp/runtime-config.php
COPY deploy/entrypoint.sh /usr/local/bin/ptrp-entrypoint.sh
RUN chmod +x /usr/local/bin/ptrp-entrypoint.sh
ENTRYPOINT ["/usr/local/bin/ptrp-entrypoint.sh"]
CMD ["apache2-foreground"]

EXPOSE 80
