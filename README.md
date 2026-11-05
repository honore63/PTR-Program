# PTRP Rwanda Connect on XAMPP

The React interface is built to static files and served by Apache. PHP provides the same-origin JSON API and PDO/MySQL access; Node.js is not used as an application server.

## XAMPP setup

1. Start Apache and MySQL from the XAMPP Control Panel. Enable Apache `mod_rewrite`, and use PHP 8.1 or later with PDO MySQL and Fileinfo enabled.
2. In phpMyAdmin, select **Import** and import `database/ptrp.sql` if the `ptrp` database does not already contain the app tables. The script creates the schema.
3. From the project folder run `pnpm install` and `pnpm build:static`. Node.js is needed only at build time to compile the existing React/TypeScript UI; it does not run the deployed app.
4. Create `C:\xampp\htdocs\PTRP`. Copy the contents of `dist\public` into it, then copy the project `api` folder and root `.htaccess` into it.
5. Copy `config.php.example` to `C:\xampp\htdocs\PTRP\config.php`. Set the MySQL credentials and Manus OAuth values described below. Keep this file private; Apache denies direct requests to it.
6. Create `C:\xampp\htdocs\PTRP\uploads`, copy the project `uploads/.htaccess` into it, and grant the Apache service account write access.
7. Register `http://localhost/PTRP/api/oauth/callback` as the Manus OAuth callback. Set `owner_open_id` to the project owner's Manus OpenID so only that account can change administrator roles.
8. Open [http://localhost/PTRP/](http://localhost/PTRP/).

## VS Code Live Server preview

Live Server serves static files only; it cannot execute PHP. To preview the UI at `http://127.0.0.1:5500/` while keeping the PHP/MySQL API active:

1. Start Apache and MySQL in XAMPP.
2. From the project folder run `pnpm build:live`. This creates the compiled site in the ignored `PTRP` folder.
3. Use **Go Live** in VS Code and open `http://127.0.0.1:5500/`. The workspace-root `index.html` forwards to `/PTRP/`, and the page calls the PHP API at the matching local Apache hostname.

The preview origin is allowed by the PHP API only on localhost/127.0.0.1 and port 5500. Login callbacks finish on Apache, after which the PHP session cookie is shared with the same-host preview.

`config.php` settings:

- `db_host`, `db_port`, `db_name`, `db_user`, `db_password`: XAMPP MariaDB connection; database name is `ptrp`.
- `base_path`: leave as `/PTRP` for this setup.
- `manus_project_id`, `manus_oauth_portal_url`, `manus_oauth_api_url`, `manus_jwt_secret`: the existing Manus OAuth app configuration. These values stay server-side except the project ID and login portal URL.
- `manus_api_url`, `manus_api_key`: existing Manus storage credentials used only to load the project's current `/manus-storage/...` images. Newly uploaded media is stored locally.
- `owner_open_id`: the existing project owner identity used by the current role-management policy.

Do not expose `config.php` or commit real secrets. OAuth login will remain unavailable until valid Manus credentials and the callback URL are configured.

## API and data

PHP endpoints provide auth session lookup/logout, published content reads, admin overview, content create/update/delete, media upload/status updates, and user role management. The API uses PDO prepared statements, same-origin checks for writes, an HttpOnly session cookie, and server-side admin/owner checks. Media binaries are stored in `uploads`; metadata is in MySQL.

The SQL file defines the existing `users`, `siteContent`, and `mediaAssets` records with indexes and foreign keys. Public marketing copy and language/theme preferences remain in the existing frontend; admin-published page records are saved to MySQL.

## Development checks

- `pnpm check`: TypeScript check.
- `pnpm test`: existing Vitest tests.
- `C:\xampp\php\php.exe -l api\index.php`: PHP syntax check.
