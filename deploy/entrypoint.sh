#!/usr/bin/env bash
set -e

# Generate config.php from environment variables when it is not mounted.
CONFIG="/var/www/html/config.php"
if [ ! -f "$CONFIG" ]; then
  DB_HOST="${DB_HOST:-127.0.0.1}"
  DB_PORT="${DB_PORT:-3306}"
  DB_NAME="${DB_NAME:-ptrp}"
  DB_USER="${DB_USER:-ptrp}"
  DB_PASSWORD="${DB_PASSWORD:-}"
  BASE_PATH="${BASE_PATH:-/}"
  SMTP_HOST_B64="$(printf '%s' "${SMTP_HOST:-smtp.gmail.com}" | base64 | tr -d '\n')"
  SMTP_PORT_B64="$(printf '%s' "${SMTP_PORT:-587}" | base64 | tr -d '\n')"
  SMTP_ENCRYPTION_B64="$(printf '%s' "${SMTP_ENCRYPTION:-tls}" | base64 | tr -d '\n')"
  SMTP_USERNAME_B64="$(printf '%s' "${SMTP_USERNAME:-}" | base64 | tr -d '\n')"
  SMTP_PASSWORD_B64="$(printf '%s' "${SMTP_PASSWORD:-}" | base64 | tr -d '\n')"
  SMTP_FROM_EMAIL_B64="$(printf '%s' "${SMTP_FROM_EMAIL:-}" | base64 | tr -d '\n')"
  SMTP_FROM_NAME_B64="$(printf '%s' "${SMTP_FROM_NAME:-PTR Alumni Network}" | base64 | tr -d '\n')"
  cat > "$CONFIG" <<PHP
<?php
return [
    'db_host' => '${DB_HOST}',
    'db_port' => ${DB_PORT},
    'db_name' => '${DB_NAME}',
    'db_user' => '${DB_USER}',
    'db_password' => '${DB_PASSWORD}',
    'base_path' => '${BASE_PATH}',
    'smtp_host' => base64_decode('${SMTP_HOST_B64}', true) ?: '',
    'smtp_port' => (int) (base64_decode('${SMTP_PORT_B64}', true) ?: '587'),
    'smtp_encryption' => base64_decode('${SMTP_ENCRYPTION_B64}', true) ?: 'tls',
    'smtp_username' => base64_decode('${SMTP_USERNAME_B64}', true) ?: '',
    'smtp_password' => base64_decode('${SMTP_PASSWORD_B64}', true) ?: '',
    'smtp_from_email' => base64_decode('${SMTP_FROM_EMAIL_B64}', true) ?: '',
    'smtp_from_name' => base64_decode('${SMTP_FROM_NAME_B64}', true) ?: 'PTR Alumni Network',
    'manus_project_id' => '${MANUS_PROJECT_ID:-}',
    'manus_oauth_portal_url' => '${MANUS_OAUTH_PORTAL_URL:-}',
    'manus_oauth_api_url' => '${MANUS_OAUTH_API_URL:-}',
    'manus_jwt_secret' => '${MANUS_JWT_SECRET:-}',
    'manus_api_url' => '${MANUS_API_URL:-}',
    'manus_api_key' => '${MANUS_API_KEY:-}',
    'owner_open_id' => '${OWNER_OPEN_ID:-}',
];
PHP
  chown www-data:www-data "$CONFIG"
  chmod 640 "$CONFIG"
fi

# Adjust RewriteBase to match the configured base path.
HTACCESS="/var/www/html/.htaccess"
if [ -f "$HTACCESS" ]; then
  sed -i "s#RewriteBase .*#RewriteBase ${BASE_PATH}#" "$HTACCESS"
fi

exec "$@"
