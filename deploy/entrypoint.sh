#!/usr/bin/env bash
set -euo pipefail

PORT="${PORT:-80}"
if ! [[ "$PORT" =~ ^[0-9]+$ ]] || [ "$PORT" -lt 1 ] || [ "$PORT" -gt 65535 ]; then
  echo "PORT must be a valid TCP port." >&2
  exit 1
fi
export PORT

if [ "${APP_ENV:-}" = "production" ]; then
  if [ -z "${DB_HOST:-}" ] || [ -z "${DB_PASSWORD:-${MYSQL_PASSWORD:-}}" ]; then
    echo "DB_HOST and a database password must be configured in production." >&2
    exit 1
  fi
  JWT_SECRET="${MANUS_JWT_SECRET:-}"
  if [ "${#JWT_SECRET}" -lt 32 ]; then
    echo "MANUS_JWT_SECRET must contain at least 32 characters." >&2
    exit 1
  fi
fi

cp /usr/local/share/ptrp/runtime-config.php /var/www/html/config.php
chown www-data:www-data /var/www/html/config.php
chmod 640 /var/www/html/config.php

UPLOAD_DIR="${UPLOAD_DIR:-/var/www/html/uploads}"
mkdir -p "$UPLOAD_DIR"
chown -R www-data:www-data "$UPLOAD_DIR"
chmod 750 "$UPLOAD_DIR"

if [ -f /var/www/html/.htaccess ]; then
  BASE_PATH="${BASE_PATH:-/}"
  sed -i "s#RewriteBase .*#RewriteBase ${BASE_PATH}#" /var/www/html/.htaccess
fi

if [ -f /etc/apache2/ports.conf ]; then
  sed -i 's/^Listen 80$/Listen ${PORT}/' /etc/apache2/ports.conf
fi
if [ -f /etc/apache2/sites-available/000-default.conf ]; then
  sed -i 's/<VirtualHost \*:80>/<VirtualHost *:${PORT}>/' /etc/apache2/sites-available/000-default.conf
fi

apache2ctl -t
exec "$@"
