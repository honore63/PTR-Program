# PTR Alumni Network

**Connecting Resident Teachers, Inspiring Educational Excellence**

[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-7.3-646CFF?logo=vite&logoColor=white)](https://vite.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![PHP](https://img.shields.io/badge/PHP-8.1%2B-777BB4?logo=php&logoColor=white)](https://www.php.net)
[![MySQL](https://img.shields.io/badge/MySQL-8%2B-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](#license)

The **PTR Alumni Network** is the official digital community of the **Primary Teacher Residency Program (PTRP)** in Rwanda. It connects resident teachers, model schools, mentors, partners, and alumni; documents classroom practice and programme achievements; and makes teacher-development resources freely available.

The site is built for low-bandwidth connections, with a mobile-first layout, compressed imagery, lightweight downloadable guides, and clear, verified programme information.

> **Programme identity:** PTRP is the programme. PTR Alumni Network is its alumni and community platform. Programme facts, partner names, and MINEDUC-attributed photos are presented alongside clearly labelled unverified or pending details.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Current Scope and Limitations](#current-scope-and-limitations)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Database Documentation](#database-documentation)
- [API Reference](#api-reference)
- [Authentication and Roles](#authentication-and-roles)
- [Deployment](#deployment)
- [Security](#security)
- [Maintenance and Backups](#maintenance-and-backups)
- [Content Editing](#content-editing)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)
- [Credits and Contact](#credits-and-contact)
- [License](#license)

---

## Overview

PTRP prepared **100 teacher residents** through a **12-month residency** combining classroom learning with guided practice in **17 model schools**, hosted by **TTC Save** (Gisagara District) and **TTC de la Salle Byumba** (Gicumbi District). The first cohort was commissioned on **5 August 2024**.

The PTR Alumni Network exists to keep that community connected after graduation:

- Share teaching practice, lesson ideas, and classroom resources.
- Showcase model schools, mentors, and alumni achievements.
- Publish verified news, events, and programme updates.
- Give partners and the public a clear view of PTRP's purpose and impact.
- Provide a lightweight administrative workspace for site content and media.

### Who the site serves

| Audience | What they can do |
| --- | --- |
| Alumni and resident teachers | Read programme news, download teaching guides, submit a membership request, browse the directory preview |
| Model schools and mentors | Learn about the residency model, access mentor and classroom resources |
| Partners and policymakers | Review programme objectives, partner roles, impact stories, and public updates |
| Administrators | Sign in to manage site content records, media uploads, and user roles |
| General public | Explore the programme, schools, gallery, news, and ways to get involved |

---

## Features

### Public website

| Area | Route | Description |
| --- | --- | --- |
| Home | `/` | Hero, programme introduction, key numbers, featured quote, video, latest three news posts, partners, and join call-to-action |
| About the Program | `/about` | PTRP background, vision and mission, objectives, residency model, host colleges |
| Impact | `/impact` | Programme outcomes, evidence-aware indicators, alumni transition narrative |
| Model Schools | `/network` | All 17 model schools on an interactive, filterable map, with per-school Google Maps directions |
| News & Activities | `/news` | Categorised posts with filtering and featured content |
| Gallery | `/gallery` | Albums for photos and video with an accessible lightbox |
| Alumni Directory | `/alumni` | Filterable directory preview; profiles are placeholders until members consent |
| Resources | `/resources` | Eight downloadable teaching and mentoring guides in plain text |
| Partners | `/partners` | Partner roles, links, and partnership contact path |
| Join & Contact | `/contact` | Membership form, contact details, social links, and FAQs |
| Portal | `/portal` | Information page for the secure programme workspace |
| Administrator | `/admin` | Protected content, media, and role management workspace |

The navigation exposes five primary links plus a **More** menu on desktop, and all ten public routes in the mobile menu. Legacy paths redirect automatically:

- `/activities` → `/news`
- `/practices` → `/resources`

### Content and interaction

- English, Kinyarwanda, and French language selector. The preference persists in `localStorage`; the current translations cover navigation controls, the home hero, and footer copy.
- Responsive navigation with scroll state, active route indication, keyboard dismissal, and accessible labels.
- Search and filtering for schools, news, resources, and the alumni directory.
- Gallery album modal with Escape-key close.
- SEO metadata per route, Open Graph and Twitter cards, and per-route static entry files.
- Downloadable `.txt` resources that open quickly on slow connections.
- The membership request remains a browser `mailto:` flow. The separate contact-message form submits to the PHP API, stores messages in MySQL, and sends email through server-configured SMTP; delivery is reported honestly if SMTP is unavailable.

### Administration

- Email/password sign-in with a signed, HttpOnly session cookie.
- Overview counts for content records, published records, media, and administrators.
- Content records with slug, title, summary, body, and draft/published status.
- Media library with upload validation, alt text, and pending/approved/archived status.
- User list and role management restricted to administrators.
- Contact-message inbox with sender details, submission dates, read status, delivery status, and administrator email retry/delete actions.
- Server-side administrator checks on every administrative endpoint.

> **Important:** published `siteContent` page layouts are rendered by the public router and override the bundled page for that slug. Structured records such as schools, news, gallery, coordinators, mentors, and resident teachers continue to use their dedicated database-backed endpoints and may have bundled fallback content where configured.

---

## Current Scope and Limitations

This repository is honest about what is and is not implemented. The following limitations are known and intentional at this stage:

- **Alumni profiles are placeholders.** They are labelled “Profile under review” and do not represent verified individuals or placements.
- **No member accounts or networking dashboard.** Membership is a `mailto:` request reviewed outside the site. The `/portal` page is informational.
- **Admin roles are `user`, `editor`, and `admin`.** Editors can manage page layouts, banners, media, and navigation; administrator-only modules remain restricted to admins. Reviewer-specific permissions and a separate super-administrator tier are not implemented.
- **SMTP delivery requires deployment credentials.** Contact messages are stored even when SMTP is unavailable; configure the server-side SMTP settings before expecting email delivery. The unrelated email-notification module is not implemented.
- **The CMS is not yet a complete visual website builder.** Published page layouts can replace supported public routes; dedicated content modules and bundled pages still have module-specific behavior. Homepage carousel management, per-section visibility/scheduling, drag-and-drop design settings, and translation management are not fully implemented.
- **School location records are incomplete.** The `/network` map uses OpenStreetMap tiles and Google Maps search-result coordinates, and links to Google Maps for directions. Amber pins are area-level references where Google Maps did not identify an exact school entrance. Confirm the destination before travelling; sector/address details and exact coordinates should be verified by program administrators.
- **Some school and contact details are marked pending** where no verified source exists.
- **The language switcher is partial.** Page bodies and navigation labels remain in English.

These limitations should be addressed before presenting the admin workspace as a full content-management system.

---

## Technology Stack

### Frontend

| Technology | Version | Role |
| --- | --- | --- |
| React | 19.2.1 | Component-based UI |
| TypeScript | 5.9.3 | Type safety |
| Vite | 7.3.7 | Development server and production build |
| Tailwind CSS | 4.1.14 | Utility-first styling, with `tw-animate-css` |
| wouter | 3.3.5 | Client-side routing |
| React-Leaflet / Leaflet | 5.0.0 / 1.9.4 | Interactive model-school map using OpenStreetMap tiles |
| framer-motion | 12.23.22 | Navigation and modal animation |
| TanStack Query | 5.90.2 | API queries and mutations |
| lucide-react | 0.453.0 | Icons |
| Radix UI primitives | various | Accessible UI building blocks |
| Sonner | 2.0.7 | Toast notifications |

### Backend used by the deployed UI

| Technology | Version | Role |
| --- | --- | --- |
| PHP | 8.1+ | REST API, email/password authentication, session signing, local upload serving |
| PDO MySQL | PHP extension | Prepared statements and database access |
| Apache HTTP Server | 2.4+ | Static hosting, `mod_rewrite`, access control |
| MySQL / MariaDB | MySQL 8+ / MariaDB 10.4+ | Application database |
| Email/password auth | PHP API | Registration, login, and server-side role checks |

The browser client calls the PHP REST API at `<base-path>/api/`. This is the runtime path used by the deployed site.

### Optional Node.js scaffold

The `server/` directory is a Manus/Express scaffold retained for development, tRPC experiments, and the included Docker image. It is **not** the REST API consumed by the current browser client.

| Technology | Version | Role |
| --- | --- | --- |
| Node.js | 22 | Build and scaffold runtime |
| Express | 4.21.2 | HTTP server |
| tRPC | 11.6.0 | Typed API layer |
| Drizzle ORM | 0.44.5 | MySQL schema and migrations |
| mysql2 | 3.15.0 | MySQL driver |
| Zod | 4.1.12 | Input validation |
| esbuild / tsx | 0.25.0 / 4.19.1 | Server bundling and watch mode |

### Tooling

| Tool | Version | Purpose |
| --- | --- | --- |
| pnpm | 10.18.0 | Package manager (pinned in `package.json`) |
| Vitest | 2.1.4 | Server-side tests |
| Prettier | 3.6.2 | Formatting |
| drizzle-kit | 0.31.4 | Migration generation and execution |
| Docker | optional | Single-container Apache + PHP image (`Dockerfile`) |

---

## Architecture

```text
Browser
  │
  ├── React SPA (built to /PTRP/)
  │      ├── Public copy and directories from client/src/data/ptrp.ts
  │      └── REST calls to /PTRP/api/*
  │
  ├── Apache + .htaccess
  │      ├── SPA fallback to index.html
  │      ├── /api/*  → api/index.php
  │      └── /manus-storage/* → api/index.php (storage proxy)
  │
  ├── PHP REST API (api/index.php)
  │      ├── PDO prepared statements → MySQL (`ptrp`)
  │      ├── Manus OAuth token exchange
  │      └── Local uploads → uploads/
  │
  └── Optional Node scaffold (server/)
         ├── Express + tRPC at /api/trpc
         ├── Drizzle ORM → MySQL
         └── Manus S3 storage helpers
```

### Two backends, one client

- **PHP is the deployed backend.** `client/src/lib/api.ts` resolves its base URL from `window.__MANUS_CONFIG__.apiBaseUrl` (provided by `api/platform/config.js`) or falls back to `<base-path>/api/`.
- **Node/tRPC is a scaffold.** It exposes `/api/trpc`, `/api/health`, `/api/platform/config.js`, and OAuth routes, but it does not implement the REST paths the current admin and auth client calls. Do not describe it as a drop-in replacement for `api/index.php` without adapting the client.

---

## Project Structure

```text
PTR-Program/
├── api/
│   ├── .htaccess                 # Denies direct access to config.php
│   └── index.php                 # PHP REST API, OAuth, storage proxy
├── client/
│   ├── index.html                # SPA document, SEO and social metadata
│   ├── public/
│   │   ├── manus-storage/        # Compressed programme images
│   │   ├── resources/            # Eight downloadable .txt guides
│   │   ├── manus-routes.json     # Route/title manifest
│   │   └── ptrp-logo.svg         # Favicon / logo
│   └── src/
│       ├── _core/hooks/useAuth.ts
│       ├── components/           # Shared UI and PTRP-specific components
│       │   └── ptrp/             # BrandMark, SiteNav, SiteFooter, PageHero, SectionHeading
│       ├── contexts/             # Theme context
│       ├── data/ptrp.ts          # Single source of truth for public content
│       ├── hooks/
│       ├── lib/api.ts            # Fetch wrapper and query keys
│       ├── pages/                # Home, About, Impact, Schools, News, Gallery,
│       │                         # Alumni, Resources, Partners, Contact, Admin, Portal
│       ├── App.tsx               # Routes, page titles, social metadata
│       ├── index.css             # Design tokens and Tailwind entry
│       ├── main.tsx              # React bootstrap
│       └── platform.d.ts         # Typings for window.__MANUS_CONFIG__
├── database/
│   └── ptrp.sql                  # XAMPP-ready schema, indexes, and foreign keys
├── drizzle/
│   ├── schema.ts                 # Drizzle table definitions and inferred types
│   ├── relations.ts
│   ├── 0000_initial_users.sql
│   ├── 0001_majestic_brother_voodoo.sql
│   └── meta/                     # Drizzle migration metadata
├── server/                       # Express + tRPC scaffold (development)
│   ├── _core/                    # Context, OAuth, storage, env, static serving
│   ├── db.ts                     # Drizzle data-access helpers
│   └── routers.ts                # tRPC router
├── shared/                       # Shared constants and types
├── uploads/
│   └── .htaccess                 # Disables script execution in uploads
├── .htaccess                     # Apache SPA/API rewrites and config protection
├── config.php.example            # PHP configuration template
├── drizzle.config.ts             # Drizzle Kit configuration
├── vite.config.ts                # Base path, aliases, route-entry generation
├── vitest.config.ts              # Server test configuration
├── tsconfig.json
├── package.json
├── pnpm-lock.yaml
├── Dockerfile                    # Single-container Apache + PHP + built frontend
├── docker-compose.yml            # App + MySQL for local testing
├── deploy/
│   └── entrypoint.sh            # Generates config.php from environment variables
└── README.md
```

Generated and ignored directories: `dist/`, `PTRP/`, `node_modules/`, `.env`, `config.php`, and files under `uploads/` (except `uploads/.htaccess`).

---

## Getting Started

### Prerequisites

| Requirement | Minimum | Check |
| --- | --- | --- |
| Node.js | 22 (matches `Dockerfile`) | `node --version` |
| pnpm | 10.18.0 | `corepack enable && pnpm --version` |
| PHP | 8.1 with `pdo_mysql`, `fileinfo`, `mbstring`, `openssl` | `php -v` |
| MySQL / MariaDB | MySQL 8+ or MariaDB 10.4+ | `mysql --version` |
| Apache | 2.4 with `mod_rewrite` and `AllowOverride All` | XAMPP Control Panel |
Email/password registration and login are provided by the PHP API. A random `manus_jwt_secret` of at least 32 characters is required to sign sessions.

### 1. Clone the repository

```bash
git clone https://github.com/honore63/PTR-Program.git
cd PTR-Program
```

### 2. Install dependencies

```bash
corepack enable
pnpm install
```

For reproducible installs (CI or production build):

```bash
pnpm install --frozen-lockfile
```

### 3. Create the database

Start MySQL, then import the provided schema:

```bash
mysql -u root -p < database/ptrp.sql
```

Or, in phpMyAdmin, select **Import** and choose `database/ptrp.sql`. The script creates the `ptrp` database if needed and installs the application tables.

For an existing XAMPP installation, back up `ptrp` first, then apply `database/migrations/20261105_website_cms.sql` in phpMyAdmin or with the MySQL CLI. This additive migration preserves existing content, adds CMS settings/navigation/page banners and the missing Admin Portal tables, and seeds the verified coordinators and 17 model-school records without duplicating matching schools.

After applying the existing CMS migration, back up the database again and apply `database/migrations/20261105_contact_messages.sql` to add the contact-message inbox. Fresh installations using `database/ptrp.sql` already include this table. The migration is additive and does not modify existing records.

To run the Vite preview against a local XAMPP backend, start Apache and MySQL and apply any required database migrations. `pnpm dev:static` proxies `/PTRP/api/*` to `http://localhost/PTRP/api/*` by default; set `VITE_API_PROXY_TARGET` to another Apache origin if needed. The PHP API serves public resident profiles and protects resident administration endpoints with administrator authentication.

For editor access, apply `database/migrations/20261106_editor_member_roles.sql` to existing installations. The API also upgrades older `users.role` enums on startup when the database account has permission to alter the table.

Verify:

```sql
USE ptrp;
SHOW TABLES;
DESCRIBE users;
DESCRIBE siteContent;
DESCRIBE mediaAssets;
DESCRIBE pageBanners;
DESCRIBE contactMessages;
```

### Page image banners

The shared public page-header design uses PTRP photography, responsive cover cropping, and a dark contrast overlay. Administrators can open **Admin Portal → Page banners** to choose any public page, upload or replace its image, set the crop position and alt text, adjust the banner title/description, preview it, or reset it to the bundled page default. Banner changes are stored per page in `pageBanners` and appear publicly without a frontend rebuild. The homepage retains its image carousel until an administrator explicitly saves a homepage banner.

### 4. Configure PHP

```bash
cp config.php.example config.php
```

Edit `config.php` with database credentials, the deployment base path, and a random session-signing secret of at least 32 characters. See [Configuration](#configuration). The file is gitignored and denied by `.htaccess`.
Configure the SMTP keys from [Configuration](#configuration) in the server-only `config.php` to enable contact email delivery. Until credentials are configured, contact messages remain stored and visible in the Admin Portal, and the form reports email delivery failure instead of claiming success.

### 5. Build the frontend

```bash
# Production build into dist/public (base path /PTRP/)
pnpm build:static

# Live/XAMPP build into the repository-level PTRP/ folder
pnpm build:live
```

Both builds use the `/PTRP/` base path configured in `vite.config.ts`.

### 6. Install into the Apache document root

1. Create the directory `C:\xampp\htdocs\PTRP` (or the equivalent on your server).
2. Copy the contents of `dist/public` — or the generated `PTRP/` folder — into `htdocs/PTRP`.
3. Copy the project `api/` folder and the root `.htaccess` into `htdocs/PTRP`.
4. Copy your configured `config.php` into `htdocs/PTRP/config.php`.
5. Create `htdocs/PTRP/uploads`, copy `uploads/.htaccess` into it, and grant the Apache/PHP service account write access.

A typical XAMPP layout:

```text
C:\xampp\htdocs\PTRP\
├── .htaccess
├── assets/
├── about/  contact/  news/  ...   # generated route entry folders
├── api/
│   └── index.php
├── config.php
├── index.html
├── manus-storage/
├── resources/
└── uploads/
```

### 7. Set up an administrator

Register the intended administrator account at `/portal`, then promote it using the SQL statement in [First administrator setup](#first-administrator-setup). Registration does not grant admin access.

### 8. Open the site

```text
http://localhost/PTRP/
```

Administrative workspace: `http://localhost/PTRP/admin`

### Development servers

The full authentication and admin flow requires Apache plus the PHP API. For UI-only work:

```bash
# Vite + Express scaffold on http://localhost:3000/PTRP/
pnpm dev

# Static Vite dev server (POSIX shell)
pnpm dev:static
```

On Windows PowerShell, the inline `NODE_ENV` assignment in `pnpm dev` is not valid. Use:

```powershell
$env:NODE_ENV="development"
pnpm exec tsx watch server/_core/index.ts
```

For a static UI preview with an explicit port:

```powershell
pnpm exec vite --host 127.0.0.1 --port 5173
```

> The Vite/Express scaffold does not serve the PHP REST endpoints. If you need `/admin`, `/portal`, or live API calls locally, use the XAMPP installation above rather than the Node dev server.

---

## Configuration

### PHP configuration (`config.php`)

Create this file from `config.php.example`. Never commit it.

| Key | Purpose | Sensitive |
| --- | --- | --- |
| `db_host` | MySQL host, e.g. `127.0.0.1` | No |
| `db_port` | MySQL port, default `3306` | No |
| `db_name` | Database name, default `ptrp` | No |
| `db_user` | Database user | Yes |
| `db_password` | Database password | Yes |
| `base_path` | URL base path, default `/PTRP` | No |
| `manus_jwt_secret` | HS256 secret used to sign session cookies; at least 32 random characters | **Yes** |
| `smtp_host` | SMTP server hostname (Gmail: `smtp.gmail.com`) | No |
| `smtp_port` | `587` for STARTTLS, or `465` for implicit TLS | No |
| `smtp_encryption` | `tls` for port 587 or `ssl` for port 465 | No |
| `smtp_username` | Authorized SMTP account email | **Yes** |
| `smtp_password` | SMTP password or provider app password | **Yes** |
| `smtp_from_email` | Optional verified sender address; defaults to `smtp_username` | **Yes** |
| `smtp_from_name` | Optional sender display name | No |

`base_path` controls the API prefix, cookie path, and local media URL prefix. It must match the URL where the site is served.

The contact form delivers to `ptrpresidenteachers100@gmail.com`. For Gmail SMTP, enable 2-Step Verification and use an app password for `smtp_password`; standard account passwords may not work. The sending account must be authorized to relay messages. Store credentials only in the protected, gitignored PHP `config.php` or hosting-provider secret settings. Never put SMTP values in frontend code or `VITE_*` variables. Valid messages are stored before delivery, so an SMTP outage is visible in the Admin Portal inbox and administrators can retry after fixing configuration. A successful response means the SMTP server accepted the message, not that the recipient mailbox confirmed delivery.

### Node scaffold environment (`.env`)

The Node/tRPC scaffold reads environment variables with `dotenv`. Create `.env` only if you are working on that scaffold. It is gitignored.

```dotenv
# Required for database-backed tRPC procedures; replace with your local credentials.
DATABASE_URL="mysql://DB_USER:DB_PASSWORD@127.0.0.1:3306/ptrp"

# Required for Node scaffold sessions (at least 32 random characters)
SESSION_SECRET=

# Manus OAuth
MANUS_PROJECT_ID=
MANUS_JWT_SECRET=
MANUS_OAUTH_API_URL=
MANUS_OAUTH_PORTAL_URL=

# Manus storage (media uploads and existing /manus-storage assets)
MANUS_API_URL=
MANUS_API_KEY=
MANUS_API_BROWSER_KEY=

# Grants administrator role to this Manus OpenID
OWNER_OPEN_ID=

# Server
PORT=3000
NODE_ENV=development
```

| Variable | Used by | Notes |
| --- | --- | --- |
| `DATABASE_URL` | Drizzle, tRPC DB helpers | MySQL connection string |
| `MANUS_PROJECT_ID` | OAuth, session validation, public config | Public value |
| `MANUS_JWT_SECRET` | Session signing | Server-only |
| `MANUS_OAUTH_API_URL` | OAuth token exchange | Server-only |
| `MANUS_OAUTH_PORTAL_URL` | Login redirect | Public value |
| `MANUS_API_URL` | Storage presigning | Server-only |
| `MANUS_API_KEY` | Storage presigning | Server-only |
| `MANUS_API_BROWSER_KEY` | Public platform config | Browser-visible key |
| `OWNER_OPEN_ID` | Role-management guard | Server-only |
| `PORT` | Express listen port | Default `3000` |
| `NODE_ENV` | Dev vs. production serving | `development` or `production` |

---

## Database Documentation

The application uses a single MySQL database named **`ptrp`**, with `utf8mb4` / `utf8mb4_unicode_ci` and InnoDB tables.

### `users`

Stores registered email/password accounts and any accounts created by the separate Node OAuth scaffold.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `int` | Primary key, auto-increment |
| `openId` | `varchar(64)` | Unique Manus OpenID |
| `name` | `text` | Display name |
| `email` | `varchar(320)` | Optional email |
| `loginMethod` | `varchar(64)` | Login provider/method |
| `role` | `enum('user','editor','admin')` | Defaults to `user` |
| `createdAt` | `timestamp` | Defaults to current time |
| `updatedAt` | `timestamp` | Auto-updates |
| `lastSignedIn` | `timestamp` | Updated on login |

### `siteContent`

Stores draft or published content records created in the admin workspace.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `int` | Primary key |
| `slug` | `varchar(120)` | Unique; used by `GET /api/content/{slug}` |
| `title` | `varchar(255)` | Required |
| `summary` | `text` | Optional |
| `body` | `text` | Required |
| `status` | `enum('draft','published')` | Defaults to `draft` |
| `updatedBy` | `int` | Foreign key → `users.id` |
| `createdAt` | `timestamp` | Defaults to current time |
| `updatedAt` | `timestamp` | Auto-updates |

### `mediaAssets`

Stores metadata for uploaded media. File bytes are stored in `uploads/` by the PHP API.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `int` | Primary key |
| `filename` | `varchar(255)` | Original filename |
| `storageKey` | `varchar(500)` | Unique generated storage key |
| `url` | `varchar(700)` | Public URL under the base path |
| `mimeType` | `varchar(120)` | Validated MIME type |
| `size` | `int` | Size in bytes; upload maximum is 10 MB |
| `altText` | `varchar(255)` | Accessibility description |
| `status` | `enum('pending','approved','archived')` | Defaults to `approved` |
| `uploadedBy` | `int` | Foreign key → `users.id` |
| `createdAt` | `timestamp` | Defaults to current time |

### Relationships

```text
users (1) ───< siteContent.updatedBy
users (1) ───< mediaAssets.uploadedBy
```

Both foreign keys are declared in `database/ptrp.sql`. The Drizzle migration files create the same tables and columns; `database/ptrp.sql` is the recommended XAMPP import because it also declares the foreign keys.

### Schema import vs. migrations

**Recommended for XAMPP/shared hosting**

```bash
mysql -u root -p < database/ptrp.sql
```

**Drizzle path**

```bash
# Create the database first; migrations do not create it for you.
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS ptrp CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# POSIX
DATABASE_URL="mysql://DB_USER:DB_PASSWORD@127.0.0.1:3306/ptrp" pnpm db:push pnpm db:push

# PowerShell
$env:DATABASE_URL="mysql://DB_USER:DB_PASSWORD@127.0.0.1:3306/ptrp"
pnpm db:push
```

`pnpm db:push` runs `drizzle-kit generate` followed by `drizzle-kit migrate`. Use `pnpm db:migrate` when migrations have already been generated.

### Backup and restore

Back up the database and uploaded media together:

```bash
mysqldump -u ptrp_user -p --single-transaction --routines --triggers ptrp > ptrp-$(date +%Y%m%d).sql
tar -czf uploads-$(date +%Y%m%d).tar.gz uploads/
```

Restore:

```bash
mysql -u ptrp_user -p ptrp < ptrp-YYYYMMDD.sql
tar -xzf uploads-YYYYMMDD.tar.gz
```

Store backups outside the web root and encrypt them if they contain account data.

---

## API Reference

All PHP endpoints are relative to the configured base path, e.g. `http://localhost/PTRP/api`.

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| `GET` | `/platform/config.js` | Public | Returns the same-origin API base URL |
| `POST` | `/contact-messages` | Public, same-origin | Validates and stores a contact message, then attempts SMTP delivery to PTRP administration |
| `GET` | `/admin/contact-messages` | Admin | Lists stored messages and delivery/read status |
| `PATCH` | `/admin/contact-messages/{id}/read` | Admin | Marks a message read |
| `POST` | `/admin/contact-messages/{id}/retry` | Admin | Retries failed or pending SMTP delivery |
| `DELETE` | `/admin/contact-messages/{id}` | Admin | Permanently deletes a stored message |
| `GET` | `/auth/me` | Optional session | Returns the current user or `null` |
| `POST` | `/auth/register` | Public | Creates a standard user account; never grants admin |
| `POST` | `/auth/login` | Public | Signs in with email and password |
| `POST` | `/auth/logout` | Session | Clears the session cookie; same-origin required |
| `POST` | `/auth/forgot-password`, `/auth/reset-password` | Unavailable | Returns 503 until verified email delivery is implemented |
| `GET` | `/content/{slug}` | Public | Returns one **published** content record |
| `GET` | `/admin/overview` | Admin | Counts for content, published records, media, users, admins |
| `GET` | `/admin/content` | Admin | Lists all content records |
| `POST` | `/admin/content` | Admin | Creates or updates a record by slug |
| `DELETE` | `/admin/content/{id}` | Admin | Deletes a content record |
| `GET` | `/admin/media` | Admin | Lists media metadata |
| `POST` | `/admin/media/upload` | Admin | Validates and stores a base64 upload (max 10 MB) |
| `PUT` | `/admin/media/{id}` | Admin | Updates alt text and/or status |
| `GET` | `/admin/users` | Admin | Lists accounts |
| `PATCH` | `/admin/users/{id}/role` | Admin | Sets `user` or `admin`; an admin cannot demote themselves if they are the only admin |
| `GET/POST` | `/schools`, `/teachers`, `/alumni`, `/news`, `/gallery`, `/best-practices` | Public / Admin | Public read of published/approved records; admin CRUD under `/admin/...` |

### Node/tRPC scaffold (optional)

| Procedure | Access | Purpose |
| --- | --- | --- |
| `auth.me` | Public | Current session user |
| `auth.logout` | Public | Clears the Node session cookie |
| `content.get` | Public | Published content by slug |
| `admin.overview` | Admin | Dashboard counts |
| `admin.content.list` / `upsert` / `remove` | Admin | Content management |
| `admin.media.list` / `upload` / `update` | Admin | Media management |
| `admin.users.list` / `setRole` | Admin / owner | Access management |

The tRPC endpoint is mounted at `/api/trpc` by the Express scaffold. It is separate from the PHP REST API used by the browser.

### Upload constraints

Accepted MIME types:

```text
image/png, image/jpeg, image/webp, image/gif, image/svg+xml
video/mp4, video/webm
application/pdf
application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document
application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.presentationml.presentation
text/plain
```

The PHP API verifies the detected MIME type, checks the declared byte length, limits uploads to 10 MB, generates a random filename, and stores metadata in `mediaAssets`.

---

## Authentication and Roles

1. A user registers or signs in at `/portal` with an email address and password.
2. The PHP API stores a password hash in MySQL and issues a signed, HttpOnly session cookie.
3. Newly registered accounts receive the `user` role. Registration never grants administrator access based on email or account order.
4. Every protected API request revalidates the session and checks the required role in MySQL.

The separate Node/tRPC scaffold retains Manus OAuth support; it is not the authentication flow used by the PHP API client.

### Roles

| Role | Capabilities |
| --- | --- |
| `user` | Authenticated account; no administrative access |
| `editor` | Manage page layouts, page banners, media, and navigation |
| `admin` | Manage all available modules, users, and user roles |

The session cookie is `HttpOnly`, `SameSite=Lax`, scoped to the base path, and marked `Secure` when served over HTTPS. Role changes are enforced server-side, not only hidden in the UI.

### First administrator setup

The SQL import does not create an administrator or install a shared default password. Register the intended administrator account normally, then promote that account using a trusted database session:

```sql
UPDATE users SET role = 'admin' WHERE email = 'your-admin@example.com';
```

Replace the example address with the exact account you control and verify the affected row before signing in to `/admin`. Email-based password recovery is disabled until a verified email-delivery service is configured; an administrator can reset an account password from the protected user-management screen.

Password recovery endpoints return an explicit unavailable response until email delivery is implemented; reset tokens are never returned to the browser.

Existing databases may contain accounts created by an earlier schema that seeded a shared administrator credential. Audit existing admin accounts, replace any known or reused passwords, and invalidate old sessions before exposing the deployment publicly; importing the updated SQL does not rewrite existing user records.

---

## Deployment

### Hosting compatibility

| Platform | Status | Notes |
| --- | --- | --- |
| Apache + PHP + MySQL (XAMPP, cPanel, VPS) | **Recommended** | Matches the shipped REST API and `.htaccess` |
| Shared PHP hosting | Supported | Needs PHP 8.1+, MySQL, `mod_rewrite`, and `.htaccess` overrides |
| Docker (Render, Fly.io, Railway) | Supported | Use the repository `Dockerfile` + `docker-compose.yml` |
| Vercel | Static UI only | Vercel cannot execute the PHP API; not a complete deployment |
| Render (Node buildpack) | Node scaffold only | Builds Express/tRPC, not the PHP REST API |

Full step-by-step instructions, including database import, environment configuration, Docker usage, and a production testing checklist, are in [`DEPLOYMENT.md`](./DEPLOYMENT.md).

### Production checklist (Apache + PHP)

1. Provision PHP 8.1+ with `pdo_mysql`, `fileinfo`, `mbstring`, and `allow_url_fopen`.
2. Create a MySQL database and a least-privilege application user.
3. Import `database/ptrp.sql`.
4. Build with the correct base path:
   ```bash
   pnpm install --frozen-lockfile
   pnpm build:static
   ```
5. Upload `dist/public` contents to the document root that serves `/PTRP`.
6. Upload `api/`, root `.htaccess`, and a production `config.php`.
7. Create `uploads/` with `uploads/.htaccess` and grant write access to PHP.
8. Set `base_path`, database credentials, and a unique `manus_jwt_secret` of at least 32 random characters.
9. Register the intended administrator account and promote it through a trusted database session.
10. Enable HTTPS and confirm the session cookie is marked `Secure`.
11. Smoke-test `/`, `/about`, `/network`, `/news`, `/resources`, `/contact`, `/admin`, and `/api/auth/me`.
12. Configure server-side SMTP settings and verify an authorized test message reaches `ptrpresidenteachers100@gmail.com`; until mailbox receipt is confirmed, delivery is not verified.
13. Submit a contact message and verify it is stored in the administrator inbox even when SMTP is unavailable.

### Deploying at the domain root or another subpath

The frontend, PHP `base_path`, and `.htaccess` rewrite base are all aligned to `/PTRP`.

- For a different subpath, rebuild with `pnpm exec vite build --base=/your-path/`, update `base_path` in `config.php`, and update `RewriteBase` in `.htaccess`.
- For the domain root, use `pnpm exec vite build --base=/`, set `base_path` to `/`, and change `RewriteBase` to `/`.
- Keep all three values consistent, or assets, API calls, and cookies will break.

### Online MySQL

1. Create the database with `utf8mb4` and `utf8mb4_unicode_ci`.
2. Create a dedicated user with access only to `ptrp`; do not use `root`.
3. Import `database/ptrp.sql` from a trusted machine.
4. Restrict network access to the application server's IP or private network.
5. Use a strong password and store it only in `config.php` or the platform's secret manager.
6. Prefer a private network or TLS. The PHP `database()` helper builds a plain PDO DSN without explicit TLS attributes; if your provider requires TLS, extend the PDO options (`PDO::MYSQL_ATTR_SSL_*`) before connecting over the public internet.
7. Back up before and after migrations.

### Vercel

The repository includes `vercel.json` for a **static frontend deployment**. Vercel sets `VERCEL=1` during the build, which switches Vite to the domain-root base path and avoids the XAMPP-only `/PTRP` asset paths. Connect the GitHub repository to Vercel and deploy with the detected pnpm project settings, or use the Vercel CLI:

```bash
pnpm install --frozen-lockfile
npx vercel
npx vercel --prod
```

This deploys the public UI and its static pages only. Vercel's official Function runtimes do not include PHP, so it cannot execute `api/index.php`; Vercel also does not provide a MySQL server for this project. The PHP REST API, email/password authentication, admin operations, database, and persistent upload storage therefore remain unavailable in this deployment. The existing browser client calls the PHP REST API, so adding a Vercel rewrite alone does not provide those backend features.

For a complete production site, host the PHP API and MySQL/MariaDB on a PHP-capable provider and deliberately configure a same-origin proxy or update the client, CORS allowlist, secure cookies, and API base URL for that backend. Configure the database with a private network or TLS, and store credentials only in the backend provider's secret manager. Do not put database or server secrets into `VITE_*` variables: Vite embeds those values into public JavaScript.

Verify the static UI after deployment at `/`, `/about`, `/network`, `/impact`, `/news`, `/gallery`, `/alumni`, `/resources`, `/partners`, and `/contact`. Do not treat successful static deployment as verification of sign-in, admin, database, or upload functionality.

### Render / Fly.io / Railway (Docker)

The repository now ships a single-container image that builds the React frontend and serves it together with the PHP REST API on Apache:

```bash
docker build -t ptr-alumni-network .
docker run --rm -p 8080:80 --env-file .env ptr-alumni-network
```

Or with the bundled database:

```bash
docker compose up --build
```

Set the environment variables listed in [`DEPLOYMENT.md`](./DEPLOYMENT.md) (section 6). The container generates `config.php` from those variables on startup.

### Existing deployment artifacts

- `dist/public` — standard Vite output, base `/PTRP/`.
- `PTRP/` — live/XAMPP output created by `pnpm build:live`, base `/PTRP/`.
- Generated route entry folders (`about/`, `news/`, etc.) allow direct navigation on static hosts.

Both `dist/` and `PTRP/` are gitignored. Rebuild them after frontend changes.

---

## Security

### Secrets and configuration

- Never commit `config.php`, `.env`, database dumps, or uploads containing personal data.
- `config.php` is gitignored and explicitly denied by `.htaccess`.
- Keep `manus_jwt_secret` and database passwords server-side.
- The PHP public platform script exposes only the same-origin API base URL; never serialize server configuration.
- Rotate the JWT secret if a session token may have leaked. Rotating it invalidates all sessions.

### Access control

- Administrative endpoints call `requireAdmin()` before any data operation.
- Admin role changes are enforced by the PHP API. Only a trusted database operator should bootstrap the first admin.
- Sessions are signed with HS256 and checked for expiry; the user's current role is re-read from MySQL on protected requests.

### Request handling

- PDO prepared statements are used for database queries.
- Write requests enforce same-origin checks when an `Origin` header is present.
- CORS allows the same host and local development on `localhost`/`127.0.0.1` ports `5500` and `5173` only.
- JSON bodies are limited to 16 MB; uploads are limited to 10 MB.
- Upload MIME types are verified with `finfo`, filenames are randomized, and `uploads/.htaccess` disables PHP execution.
- `Options -Indexes` prevents directory listing.

### Known hardening gaps

- No rate limiting on login, upload, or write endpoints.
- No CSRF token beyond the same-origin check.
- No audit trail for content or role changes.
- No automated dependency or vulnerability scanning in CI.
- The role model has `user`, `editor`, and `admin`; editors are limited to content, banner, media, and navigation management.

### File permissions

- Web root: readable by the web server, not world-writable.
- `uploads/`: writable by the PHP/Apache user only; no execute permission.
- `config.php`: readable by the PHP user only; never served directly.
- Backups: stored outside the web root.

---

## Maintenance and Backups

### Routine checks

```bash
pnpm check          # TypeScript
pnpm test           # Vitest server tests
pnpm format         # Prettier
php -l api/index.php
```

After frontend changes, rebuild both outputs:

```bash
pnpm build:static
pnpm build:live
```

### Updating dependencies

```bash
pnpm outdated
pnpm up --latest
pnpm check
pnpm test
```

Review major upgrades individually, especially React, Vite, Tailwind, and PHP/MySQL drivers.

### Backup schedule

| Asset | Frequency | Method |
| --- | --- | --- |
| MySQL database | Daily or before every deploy | `mysqldump --single-transaction` |
| `uploads/` | Daily | Archive and encrypt |
| `config.php` | On change | Password manager or secret store |
| Source code | On every release | Git tag and remote push |

Test restores periodically. A backup that has never been restored is not verified.

### Monitoring

- Check Apache and PHP error logs after deployments.
- Monitor `GET /api/health` on the Node scaffold, and `GET /api/auth/me` on PHP for a 200 response.
- Verify sign-in and the `Secure` session cookie after changing domains or HTTPS settings.
- Watch disk usage in `uploads/`.

---

## Content Editing

### Public content

Most public copy lives in **`client/src/data/ptrp.ts`**, including:

- Brand, navigation, social links, and section metadata.
- Home content and key numbers.
- Programme overview, vision/mission, impact content.
- All 17 model schools and host colleges.
- Partners.
- News posts and categories.
- Gallery albums.
- Alumni directory preview profiles.
- Resources and contact/join content.

Edit that file, run `pnpm check`, and rebuild. Keep unverified entries labelled as such; do not promote placeholders to verified facts without a source.

### Admin content records

The public router queries `GET /api/content/{slug}` for public routes. A published, valid JSON page layout replaces that route's bundled fallback and is refreshed through the shared query cache after Admin Portal saves. Draft records remain private. Specialized content modules (such as news, gallery, and schools) use their corresponding tables and public endpoints.

### Adding a resource

1. Add the file under `client/public/resources/`.
2. Register it in the `resources` array in `client/src/data/ptrp.ts`.
3. Use a base-relative `href` such as `/resources/your-guide.txt`; the page prepends `BASE_URL`.
4. Keep files small and use plain text or compressed PDFs.

### Adding a route

1. Create the page under `client/src/pages/`.
2. Register it in `client/src/App.tsx` and add a title in `pageTitles`.
3. Add it to `client/src/data/ptrp.ts` (`navItems`, `sectionMeta`) if it should appear in navigation.
4. Add it to `client/public/manus-routes.json` and the `routes` array in `vite.config.ts` so a static route entry is generated.

---

## Contributing

1. Fork the repository and create a branch:
   ```bash
   git checkout -b feature/short-description
   ```
2. Install with `pnpm install`.
3. Make focused changes. Do not commit secrets, `config.php`, `.env`, `uploads/`, `dist/`, or `PTRP/`.
4. Verify:
   ```bash
   pnpm check
   pnpm test
   php -l api/index.php
   pnpm build:static
   ```
5. Test the affected routes in a browser, including mobile width and keyboard navigation.
6. Open a pull request describing the change, the routes affected, and any new configuration.

### Content standards

- Attribute programme facts and images to MINEDUC or the named source.
- Mark unverified districts, contacts, placements, and statistics as pending.
- Do not publish personal contact details without consent.
- Preserve the PTRP brand, MINEDUC-inspired colours, typography, and accessible contrast.
- Prefer small, compressed media and plain-text resources for slow connections.

### Code standards

- TypeScript strict mode is enabled.
- Follow the existing page/component patterns and Tailwind tokens.
- Use the `@/` alias for client imports and `@shared/` for shared modules.
- Keep server-side authorization checks in the API, never only in the UI.
- Add or update tests for authentication, platform configuration, and data-access changes.

---

## Troubleshooting

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| `503 Copy config.php.example to config.php` | Missing PHP configuration | Create `config.php` in the deployed root |
| `401 Please login` | No valid session cookie | Sign in again; check `manus_jwt_secret` and the cookie path |
| `503` during login or registration | Database or configuration unavailable | Check `config.php`, session secret, MySQL status, and PHP extensions |
| `403 Cross-origin request rejected` | Preview origin not allowed | Serve from the same host, or use localhost ports 5500/5173 |
| `403 Administrator access required` | Account role is `user` | Promote the intended account using a trusted database session |
| Database connection error | Wrong credentials or missing `pdo_mysql` | Check `config.php`, MySQL status, and PHP extensions |
| Direct routes return 404 | `mod_rewrite` or `.htaccess` overrides disabled | Enable `mod_rewrite` and `AllowOverride All` |
| Upload fails | Directory permissions, size, or MIME mismatch | Check `uploads/` ownership, 10 MB limit, and allowed types |
| Images under `/manus-storage/` fail | Static asset path or base path mismatch | Verify the built asset path and configured `base_path` |
| Admin changes do not appear publicly | Public pages use static data | Edit `client/src/data/ptrp.ts` and rebuild |
| Language switch only changes some text | Translation coverage is partial | Extend `copy` in `client/src/data/ptrp.ts` |

---

## Credits and Contact

### Programme and content

- **Primary Teacher Residency Program (PTRP)** — Ministry of Education (MINEDUC), Rwanda, and programme partners.
- Programme launch facts and photographs: [MINEDUC — Primary Teacher Residency pilot programme for TTCs launched](https://www.mineduc.gov.rw/news-detail/primary-teacher-residency-pilot-program-for-ttcs-launched).
- Partner organisations named on the site: MINEDUC, Rwanda Basic Education Board (REB), Florida State University Learning Systems Institute (FSU · LSI), Inspire, Educate and Empower Rwanda (IEE), Bridge2Rwanda, and RAINWATER Foundation.

### Project

- Repository: [github.com/honore63/PTR-Program](https://github.com/honore63/PTR-Program)
- Website contact: [ptrpresidenteachers100@gmail.com](mailto:ptrpresidenteachers100@gmail.com)
- Social channels are listed in `client/src/data/ptrp.ts` and on the site footer.

### Built with

React, TypeScript, Vite, Tailwind CSS, wouter, framer-motion, TanStack Query, PHP, MySQL, and Apache.

---

## License

MIT. See the `license` field in `package.json`.
