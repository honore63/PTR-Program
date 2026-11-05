# Deployment Guide - PTR ALUMNI NETWORK

This guide deploys the **entire** application (React frontend + PHP REST API + MySQL) on **one hosting platform**. The recommended targets are:

- **Shared hosting / cPanel** (Apache + PHP 8.1+ + MySQL) - simplest.
- **VPS or dedicated server** (Apache or Nginx + PHP-FPM + MySQL).
- **Docker-capable platform** (Render, Fly.io, Railway) using the included `Dockerfile`.

> Do not use Vercel or Netlify for the full stack: they cannot execute `api/index.php` or connect to MySQL through PDO. They can only host the static frontend.

---

## 1. Prerequisites

| Requirement | Minimum |
| --- | --- |
| PHP | 8.1 with `pdo_mysql`, `fileinfo`, `mbstring`, `allow_url_fopen` |
| MySQL / MariaDB | MySQL 8+ or MariaDB 10.4+ |
| Apache | 2.4 with `mod_rewrite` and `AllowOverride All` (or Nginx equivalent) |
| Node.js | 22 (build time only) |
| pnpm | 10.18.0 (build time only) |
| Initial administrator | Register an account and promote it with trusted database access |

---

## 2. Database setup

1. Create the database and a least-privilege user:

```sql
CREATE DATABASE IF NOT EXISTS ptrp CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'ptrp'@'%' IDENTIFIED BY 'REPLACE_WITH_A_STRONG_RANDOM_PASSWORD';
GRANT ALL PRIVILEGES ON ptrp.* TO 'ptrp'@'%';
FLUSH PRIVILEGES;
```

2. Import the schema:

```bash
mysql -u ptrp -p ptrp < database/ptrp.sql
```

The script is idempotent (`CREATE TABLE IF NOT EXISTS`) and creates all application tables, indexes, and foreign keys.

It does not create an administrator account. Register the intended administrator at `/portal`, then promote that exact account using a trusted database session:

```sql
UPDATE users SET role = 'admin' WHERE email = 'your-admin@example.com';
```

Replace the example address and verify the affected row. Never grant admin based on an unverified email or account-registration order.

For databases created by older revisions, audit any existing administrator accounts, replace previously shared or reused passwords, and invalidate sessions before public deployment. Re-importing the updated schema does not alter existing user records.

3. Verify:

```sql
USE ptrp;
SHOW TABLES;
```

Expected tables: `users`, `siteContent`, `mediaAssets`, `schools`, `teachers`, `alumni`, `newsArticles`, `galleryItems`, `bestPractices`.

---

## 3. Configuration

### 3.1 PHP configuration

Copy the template and edit it:

```bash
cp config.php.example config.php
```

Set at minimum:

| Key | Value |
| --- | --- |
| `db_host` | MySQL host (e.g. `127.0.0.1` or the managed DB hostname) |
| `db_port` | `3306` |
| `db_name` | `ptrp` |
| `db_user` | Database user |
| `db_password` | Database password |
| `base_path` | URL base path (`/` for a domain root, `/PTRP` for a subfolder) |
| `manus_jwt_secret` | HS256 signing secret, at least 32 cryptographically random characters |

`config.php` is gitignored and must never be committed.
Set `manus_jwt_secret` to at least 32 cryptographically random characters. Older deployments must replace the sample signing secret and invalidate existing sessions.

The deployed PHP API uses email/password authentication and does not require an OAuth callback. Manus OAuth settings are used only by the separate Node scaffold.

---

## 4. Build the frontend

```bash
corepack enable
pnpm install --frozen-lockfile
```

Choose the base path that matches `base_path` in `config.php`:

```bash
# Domain root (base_path = /)
pnpm exec vite build --base=/ --outDir dist/public --emptyOutDir

# Subfolder (base_path = /PTRP)
pnpm build:static
```

---

## 5. Deploy files

Upload to the document root that serves your domain:

```
document-root/
├── .htaccess
├── index.html
├── assets/
├── about/, news/, ...   (generated route folders)
├── api/
│   └── index.php
├── config.php
├── manus-storage/
├── partners/
├── resources/
└── uploads/            (writable by PHP)
```

Steps:

1. Upload the contents of `dist/public` (or `PTRP/`).
2. Upload the `api/` folder and root `.htaccess`.
3. Upload your configured `config.php`.
4. Create `uploads/`, copy `uploads/.htaccess` into it, and grant the PHP service account write access.
5. Ensure `config.php` is not world-readable.

### 5.1 Nginx (alternative to Apache)

If your host uses Nginx, apply the equivalent of `.htaccess`:

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
location ^~ /api/ {
    try_files $uri /api/index.php?$query_string;
}
location ^~ /manus-storage/ {
    try_files $uri /api/index.php?$query_string;
}
location = /config.php { deny all; }
```

---

## 6. Docker deployment (single container)

The included `Dockerfile` builds the frontend and runs Apache + PHP in one container. MySQL is provided by the `db` service in `docker-compose.yml`.

```bash
# Local / test
cp .env.example .env
# Set MYSQL_PASSWORD, MYSQL_ROOT_PASSWORD, and MANUS_JWT_SECRET in .env before starting.
docker compose up --build
# App: http://localhost:8080
```

For a Docker-capable host (Render, Fly.io, Railway), push the image and set these environment variables:

```
DB_HOST=<managed mysql host>
DB_PORT=3306
DB_NAME=ptrp
DB_USER=<user>
DB_PASSWORD=<password>
BASE_PATH=/
MANUS_JWT_SECRET=...
```

The container generates `config.php` from these variables on startup and imports nothing automatically - import `database/ptrp.sql` into the managed database first.

---

## 7. Production testing checklist

- [ ] `GET /api/auth/me` returns `null` (200) when signed out.
- [ ] Sign in through `/portal` or `/admin` redirects back successfully.
- [ ] `/admin` shows the dashboard after sign-in with the administrator account.
- [ ] Create a school, teacher, alumni record, news article, gallery item, and best practice; confirm they persist after reload.
- [ ] Upload an image through the admin media library; confirm it appears under `/uploads/`.
- [ ] Publish a news article; confirm it appears on `/news`.
- [ ] Open `/`, `/about`, `/network`, `/gallery`, `/resources`, `/contact` on desktop and mobile widths.
- [ ] Verify HTTPS is active and the session cookie is marked `Secure`.
- [ ] Confirm `config.php` returns 403/404 when requested directly.

---

## 8. Backups

```bash
mysqldump -u ptrp -p --single-transaction ptrp > ptrp-$(date +%Y%m%d).sql
tar -czf uploads-$(date +%Y%m%d).tar.gz uploads/
```

Store backups outside the web root.

---

## 9. Troubleshooting

See the **Troubleshooting** section of `README.md`.
