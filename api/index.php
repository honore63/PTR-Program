<?php
declare(strict_types=1);

final class ApiError extends RuntimeException
{
    public function __construct(public readonly int $status, string $message)
    {
        parent::__construct($message);
    }
}

function respond(mixed $data, int $status = 200): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode($data, JSON_UNESCAPED_SLASHES | JSON_INVALID_UTF8_SUBSTITUTE);
    exit;
}

function config(): array
{
    static $config;
    if ($config === null) {
        $configPath = dirname(__DIR__) . '/config.php';
        if (!is_file($configPath)) {
            $configPath = dirname(__DIR__) . '/config.php.example';
        }
        if (!is_file($configPath)) {
            throw new ApiError(503, 'Configuration file missing. Please create config.php.');
        }
        $config = require $configPath;
    }
    return $config;
}

function database(): PDO
{
    static $pdo;
    if (!$pdo) {
        $settings = config();
        $dsn = sprintf('mysql:host=%s;port=%d;dbname=%s;charset=utf8mb4', $settings['db_host'], $settings['db_port'], $settings['db_name']);
        $pdo = new PDO($dsn, $settings['db_user'], $settings['db_password'], [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
        ensureDatabaseSchema($pdo);
    }
    return $pdo;
}

function ensureDatabaseSchema(PDO $pdo): void
{
    static $migrated = false;
    if ($migrated) return;
    $migrated = true;

    try {
        $columns = $pdo->query("SHOW COLUMNS FROM users")->fetchAll(PDO::FETCH_COLUMN);
        if (!in_array('passwordHash', $columns, true)) {
            $pdo->exec("ALTER TABLE users ADD COLUMN passwordHash VARCHAR(255) NULL AFTER email");
        }
        if (!in_array('resetToken', $columns, true)) {
            $pdo->exec("ALTER TABLE users ADD COLUMN resetToken VARCHAR(128) NULL AFTER role");
        }
        if (!in_array('resetTokenExpires', $columns, true)) {
            $pdo->exec("ALTER TABLE users ADD COLUMN resetTokenExpires DATETIME NULL AFTER resetToken");
        }
        $pdo->exec("ALTER TABLE users MODIFY COLUMN openId VARCHAR(64) NULL");

    } catch (Throwable $e) {
        error_log('Database schema migration notice: ' . $e->getMessage());
    }
}

function basePath(): string
{
    return '/' . trim((string) (config()['base_path'] ?? '/PTRP'), '/');
}

function jsonBody(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === false || strlen($raw) > 16000000) {
        throw new ApiError(413, 'Request body is too large.');
    }
    if (trim($raw) === '') return [];
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        throw new ApiError(400, 'A JSON request body is required.');
    }
    return $data;
}

function requireMethod(string $method): void
{
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== $method) {
        header('Allow: ' . $method);
        throw new ApiError(405, 'Method not allowed.');
    }
}

function isTrustedOrigin(string $origin): bool
{
    $scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
    $expected = $scheme . '://' . ($_SERVER['HTTP_HOST'] ?? 'localhost');
    if (hash_equals($expected, $origin)) return true;

    $parts = parse_url($origin);
    $requestHost = strtolower(preg_replace('/:\\d+$/', '', (string) ($_SERVER['HTTP_HOST'] ?? 'localhost')));
    return ($parts['scheme'] ?? '') === 'http'
        && strtolower((string) ($parts['host'] ?? '')) === $requestHost
        && in_array((int) ($parts['port'] ?? 0), [3000, 5173, 5500, 80, 443], true)
        && in_array($requestHost, ['localhost', '127.0.0.1'], true);
}

function sendCorsHeaders(): void
{
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if ($origin === '') return;
    if (!isTrustedOrigin($origin)) throw new ApiError(403, 'Cross-origin request rejected.');
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
    header('Vary: Origin');
}

function requireSameOrigin(): void
{
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if ($origin === '') return;
    if (!isTrustedOrigin($origin)) throw new ApiError(403, 'Cross-origin request rejected.');
}

function base64UrlEncode(string $value): string
{
    return rtrim(strtr(base64_encode($value), '+/', '-_'), '=');
}

function base64UrlDecode(string $value): string|false
{
    return base64_decode(strtr($value, '-_', '+/') . str_repeat('=', (4 - strlen($value) % 4) % 4), true);
}

function getSessionSecret(): string
{
    $settings = config();
    $secret = (string) ($settings['manus_jwt_secret'] ?? '');
    if (strlen($secret) < 32) {
        throw new ApiError(503, 'A session signing secret of at least 32 characters must be configured.');
    }
    return $secret;
}

function signSession(array $user): string
{
    $secret = getSessionSecret();
    $header = base64UrlEncode(json_encode(['alg' => 'HS256', 'typ' => 'JWT']));
    $payload = base64UrlEncode(json_encode([
        'uid' => (int) $user['id'],
        'email' => $user['email'] ?? '',
        'role' => $user['role'] ?? 'user',
        'name' => $user['name'] ?? '',
        'iat' => time(),
        'exp' => time() + (86400 * 30), // 30-day session
    ]));
    $signature = base64UrlEncode(hash_hmac('sha256', $header . '.' . $payload, $secret, true));
    return $header . '.' . $payload . '.' . $signature;
}

function sessionIdentity(): ?array
{
    $token = $_COOKIE['ptrp_session'] ?? $_COOKIE['webdev_app_session'] ?? '';
    if ($token === '' && !empty($_SERVER['HTTP_AUTHORIZATION'])) {
        if (preg_match('/Bearer\s+(\S+)/i', $_SERVER['HTTP_AUTHORIZATION'], $m)) {
            $token = $m[1];
        }
    }
    if ($token === '') return null;
    $parts = explode('.', $token);
    if (count($parts) !== 3) return null;
    [$header, $payload, $signature] = $parts;
    $secret = getSessionSecret();
    $expected = base64UrlEncode(hash_hmac('sha256', $header . '.' . $payload, $secret, true));
    if (!hash_equals($expected, $signature)) return null;

    $jwtHeader = json_decode((string) base64UrlDecode($header), true);
    $claims = json_decode((string) base64UrlDecode($payload), true);
    if (($jwtHeader['alg'] ?? '') !== 'HS256' || !is_array($claims)) return null;
    if ((int) ($claims['exp'] ?? 0) <= time()) return null;
    return $claims;
}

function currentUser(bool $required = true): ?array
{
    $identity = sessionIdentity();
    if (!$identity) {
        if ($required) throw new ApiError(401, 'Please login.');
        return null;
    }
    $uid = $identity['uid'] ?? 0;
    if ($uid > 0) {
        $statement = database()->prepare('SELECT id, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn FROM users WHERE id = ? LIMIT 1');
        $statement->execute([$uid]);
    } else {
        // Fallback for legacy session containing openId
        $statement = database()->prepare('SELECT id, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn FROM users WHERE openId = ? OR email = ? LIMIT 1');
        $statement->execute([$identity['openId'] ?? '', $identity['email'] ?? '']);
    }
    $user = $statement->fetch();
    if (!$user && $required) throw new ApiError(401, 'Account not found. Please log in again.');
    return $user ?: null;
}

function requireAdmin(): array
{
    $user = currentUser(true);
    if (($user['role'] ?? '') !== 'admin') throw new ApiError(403, 'Administrator access required.');
    return $user;
}

function cookieOptions(int $expires): array
{
    $secure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off');
    return [
        'expires' => $expires,
        'path' => basePath() . '/',
        'secure' => $secure,
        'httponly' => true,
        'samesite' => 'Lax'
    ];
}

function inputString(array $data, string $key, int $maxLength, bool $required = false): ?string
{
    $value = $data[$key] ?? null;
    if ($value === null && !$required) return null;
    if (!is_string($value) || ($required && trim($value) === '') || mb_strlen($value) > $maxLength) {
        throw new ApiError(400, 'Invalid ' . $key . '.');
    }
    return trim($value);
}

function serveLocalFile(string $filePath): never
{
    if (!is_file($filePath)) {
        throw new ApiError(404, 'Asset not found.');
    }
    $mime = mime_content_type($filePath) ?: 'application/octet-stream';
    $ext = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));
    $mimes = [
        'jpg' => 'image/jpeg', 'jpeg' => 'image/jpeg', 'png' => 'image/png',
        'webp' => 'image/webp', 'gif' => 'image/gif', 'svg' => 'image/svg+xml',
        'pdf' => 'application/pdf', 'mp4' => 'video/mp4', 'webm' => 'video/webm',
        'txt' => 'text/plain', 'json' => 'application/json'
    ];
    if (isset($mimes[$ext])) $mime = $mimes[$ext];

    header('Content-Type: ' . $mime);
    header('Content-Length: ' . filesize($filePath));
    header('Cache-Control: public, max-age=86400');
    readfile($filePath);
    exit;
}

function routeRequest(): void
{
    sendCorsHeaders();
    if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
        http_response_code(204);
        return;
    }

    $path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

    // Support serving local files under /storage/, /manus-storage/ (for backwards compatibility), and /uploads/
    $storagePrefixes = [
        basePath() . '/storage/',
        basePath() . '/manus-storage/',
        basePath() . '/uploads/'
    ];

    foreach ($storagePrefixes as $prefix) {
        if (str_starts_with($path, $prefix)) {
            $rel = rawurldecode(substr($path, strlen($prefix)));
            if (str_contains($rel, '..')) throw new ApiError(400, 'Invalid path');

            // Look in client/public/storage, client/public/manus-storage, or uploads/
            $candidates = [
                dirname(__DIR__) . '/uploads/' . $rel,
                dirname(__DIR__) . '/client/public/storage/' . $rel,
                dirname(__DIR__) . '/client/public/manus-storage/' . $rel,
                dirname(__DIR__) . '/client/public/' . $rel,
            ];
            foreach ($candidates as $cand) {
                if (is_file($cand)) serveLocalFile($cand);
            }
            throw new ApiError(404, 'Media asset not found.');
        }
    }

    $prefix = basePath() . '/api';
    $route = str_starts_with($path, $prefix) ? substr($path, strlen($prefix)) : '';

    // ---------- Platform Config (Frontend API resolution) ----------
    if ($route === '/platform/config.js' && $method === 'GET') {
        header('Content-Type: application/javascript; charset=utf-8');
        header('Cache-Control: no-store');
        $scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
        $origin = $scheme . '://' . ($_SERVER['HTTP_HOST'] ?? 'localhost');
        $public = [
            'apiBaseUrl' => $origin . basePath() . '/api/',
            'appName' => 'PTR Alumni Network',
            'version' => '1.0.0',
        ];
        $json = json_encode($public, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT);
        echo 'window.__PTRP_CONFIG__=' . $json . '; window.__MANUS_CONFIG__=window.__PTRP_CONFIG__;';
        return;
    }

    // =========================================================================
    // Independent Authentication
    // =========================================================================

    // Current logged-in user check
    if ($route === '/auth/me') {
        requireMethod('GET');
        respond(currentUser(false));
    }

    // Login with Email & Password
    if ($route === '/auth/login' && $method === 'POST') {
        requireSameOrigin();
        $data = jsonBody();
        $email = strtolower((string) inputString($data, 'email', 320, true));
        $password = (string) ($data['password'] ?? '');
        if ($password === '') throw new ApiError(400, 'Password is required.');

        $stmt = database()->prepare('SELECT * FROM users WHERE LOWER(email) = ? LIMIT 1');
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        if (!$user || empty($user['passwordHash']) || !password_verify($password, $user['passwordHash'])) {
            throw new ApiError(401, 'Invalid email or password.');
        }

        // Update lastSignedIn
        database()->prepare('UPDATE users SET lastSignedIn = NOW() WHERE id = ?')->execute([$user['id']]);

        // Issue secure session cookie
        $sessionToken = signSession($user);
        setcookie('ptrp_session', $sessionToken, cookieOptions(time() + (86400 * 30)));

        respond([
            'id' => (int) $user['id'],
            'name' => $user['name'],
            'email' => $user['email'],
            'role' => $user['role'],
            'lastSignedIn' => date('c'),
        ]);
    }

    // Registration for users / residents
    if ($route === '/auth/register' && $method === 'POST') {
        requireSameOrigin();
        $data = jsonBody();
        $name = inputString($data, 'name', 255, true);
        $email = strtolower((string) inputString($data, 'email', 320, true));
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) throw new ApiError(400, 'Please provide a valid email address.');
        $password = (string) ($data['password'] ?? '');
        if (strlen($password) < 8) throw new ApiError(400, 'Password must be at least 8 characters long.');

        // Check if email already registered
        $check = database()->prepare('SELECT id FROM users WHERE LOWER(email) = ? LIMIT 1');
        $check->execute([$email]);
        if ($check->fetch()) {
            throw new ApiError(409, 'An account with this email is already registered. Please log in.');
        }

        $role = 'user';

        $passwordHash = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);
        $stmt = database()->prepare('INSERT INTO users (name, email, passwordHash, role, loginMethod, lastSignedIn) VALUES (?, ?, ?, ?, \'local\', NOW())');
        $stmt->execute([$name, $email, $passwordHash, $role]);
        $newId = (int) database()->lastInsertId();

        $fetch = database()->prepare('SELECT id, name, email, role, lastSignedIn FROM users WHERE id = ?');
        $fetch->execute([$newId]);
        $newUser = $fetch->fetch();

        $sessionToken = signSession($newUser);
        setcookie('ptrp_session', $sessionToken, cookieOptions(time() + (86400 * 30)));

        respond($newUser, 201);
    }

    // Logout
    if ($route === '/auth/logout' && $method === 'POST') {
        requireSameOrigin();
        setcookie('ptrp_session', '', cookieOptions(time() - 3600));
        setcookie('webdev_app_session', '', cookieOptions(time() - 3600));
        respond(['success' => true]);
    }

    // Email delivery is not configured; do not generate or expose reset tokens.
    if ($route === '/auth/forgot-password' && $method === 'POST') {
        requireSameOrigin();
        throw new ApiError(503, 'Password recovery is not configured. Please contact a network administrator.');
    }

    // Do not accept reset tokens until a verified email delivery flow is configured.
    if ($route === '/auth/reset-password' && $method === 'POST') {
        requireSameOrigin();
        throw new ApiError(503, 'Password recovery is not configured. Please contact a network administrator.');
    }

    // Change password (authenticated user)
    if ($route === '/auth/change-password' && $method === 'POST') {
        requireSameOrigin();
        $user = currentUser(true);
        $data = jsonBody();
        $currentPassword = (string) ($data['currentPassword'] ?? '');
        $newPassword = (string) ($data['newPassword'] ?? '');
        if (strlen($newPassword) < 8) throw new ApiError(400, 'New password must be at least 8 characters.');

        $stmt = database()->prepare('SELECT passwordHash FROM users WHERE id = ? LIMIT 1');
        $stmt->execute([$user['id']]);
        $row = $stmt->fetch();
        if (!$row || !password_verify($currentPassword, $row['passwordHash'] ?? '')) {
            throw new ApiError(400, 'Current password is incorrect.');
        }

        $passwordHash = password_hash($newPassword, PASSWORD_BCRYPT, ['cost' => 12]);
        database()->prepare('UPDATE users SET passwordHash = ? WHERE id = ?')->execute([$passwordHash, $user['id']]);
        respond(['success' => true, 'message' => 'Password changed successfully.']);
    }

    // =========================================================================
    // Public Content Endpoints
    // =========================================================================

    if (preg_match('#^/content/([a-zA-Z0-9_-]{1,120})$#', $route, $matches) && $method === 'GET') {
        $statement = database()->prepare("SELECT id, slug, title, summary, body, status, updatedBy, createdAt, updatedAt FROM siteContent WHERE slug = ? AND status = 'published' LIMIT 1");
        $statement->execute([$matches[1]]);
        respond($statement->fetch() ?: null);
    }
    if ($route === '/schools' && $method === 'GET') {
        respond(database()->query("SELECT * FROM schools WHERE status = 'published' ORDER BY name ASC")->fetchAll());
    }
    if ($route === '/teachers' && $method === 'GET') {
        respond(database()->query("SELECT t.*, s.name AS schoolName FROM teachers t LEFT JOIN schools s ON s.id = t.schoolId WHERE t.status = 'approved' ORDER BY t.fullName ASC")->fetchAll());
    }
    if ($route === '/alumni' && $method === 'GET') {
        respond(database()->query("SELECT a.*, s.name AS schoolName FROM alumni a LEFT JOIN schools s ON s.id = a.schoolId WHERE a.status = 'approved' ORDER BY a.fullName ASC")->fetchAll());
    }
    if ($route === '/news' && $method === 'GET') {
        respond(database()->query("SELECT * FROM newsArticles WHERE status = 'published' ORDER BY COALESCE(publishedAt, createdAt) DESC")->fetchAll());
    }
    if (preg_match('#^/news/([a-zA-Z0-9_-]{1,120})$#', $route, $matches) && $method === 'GET') {
        $statement = database()->prepare("SELECT * FROM newsArticles WHERE slug = ? AND status = 'published' LIMIT 1");
        $statement->execute([$matches[1]]);
        respond($statement->fetch() ?: null);
    }
    if ($route === '/gallery' && $method === 'GET') {
        respond(database()->query("SELECT * FROM galleryItems WHERE status = 'approved' ORDER BY createdAt DESC")->fetchAll());
    }
    if ($route === '/best-practices' && $method === 'GET') {
        respond(database()->query("SELECT * FROM bestPractices WHERE status = 'published' ORDER BY updatedAt DESC")->fetchAll());
    }

    // =========================================================================
    // Administrator-Protected Endpoints
    // =========================================================================
    requireAdmin();

    if ($route === '/admin/overview' && $method === 'GET') {
        $row = database()->query("SELECT
            (SELECT COUNT(*) FROM siteContent) AS contentCount,
            (SELECT COUNT(*) FROM siteContent WHERE status = 'published') AS publishedCount,
            (SELECT COUNT(*) FROM mediaAssets) AS mediaCount,
            (SELECT COUNT(*) FROM users) AS userCount,
            (SELECT COUNT(*) FROM users WHERE role = 'admin') AS adminCount,
            (SELECT COUNT(*) FROM schools) AS schoolCount,
            (SELECT COUNT(*) FROM teachers) AS teacherCount,
            (SELECT COUNT(*) FROM alumni) AS alumniCount,
            (SELECT COUNT(*) FROM newsArticles) AS newsCount,
            (SELECT COUNT(*) FROM galleryItems) AS galleryCount,
            (SELECT COUNT(*) FROM bestPractices) AS practiceCount,
            (SELECT COUNT(*) FROM teachers WHERE status = 'pending') AS pendingTeachers,
            (SELECT COUNT(*) FROM alumni WHERE status = 'pending') AS pendingAlumni
        ")->fetch();
        respond(array_map('intval', $row));
    }

    // ---------- Content ----------
    if ($route === '/admin/content' && $method === 'GET') {
        respond(database()->query('SELECT * FROM siteContent ORDER BY updatedAt DESC')->fetchAll());
    }
    if ($route === '/admin/content' && $method === 'POST') {
        requireSameOrigin();
        $user = currentUser(); $data = jsonBody();
        $slug = inputString($data, 'slug', 120, true);
        $title = inputString($data, 'title', 255, true);
        $summary = inputString($data, 'summary', 500);
        $body = inputString($data, 'body', 100000, true);
        $status = $data['status'] ?? '';
        if (!in_array($status, ['draft', 'published'], true)) throw new ApiError(400, 'Invalid content status.');
        $statement = database()->prepare('INSERT INTO siteContent (slug, title, summary, body, status, updatedBy) VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE title = VALUES(title), summary = VALUES(summary), body = VALUES(body), status = VALUES(status), updatedBy = VALUES(updatedBy)');
        $statement->execute([$slug, $title, $summary, $body, $status, $user['id']]);
        $fetch = database()->prepare('SELECT * FROM siteContent WHERE slug = ? LIMIT 1'); $fetch->execute([$slug]);
        respond($fetch->fetch());
    }
    if (preg_match('#^/admin/content/(\d+)$#', $route, $matches) && $method === 'DELETE') {
        requireSameOrigin();
        $statement = database()->prepare('DELETE FROM siteContent WHERE id = ?'); $statement->execute([(int) $matches[1]]);
        respond(['success' => true]);
    }

    // ---------- Media ----------
    if ($route === '/admin/media' && $method === 'GET') {
        respond(database()->query('SELECT * FROM mediaAssets ORDER BY createdAt DESC')->fetchAll());
    }
    if ($route === '/admin/media/upload' && $method === 'POST') {
        requireSameOrigin();
        $user = currentUser(); $data = jsonBody();
        $filename = inputString($data, 'filename', 255, true);
        $mimeType = inputString($data, 'mimeType', 120, true);
        $altText = inputString($data, 'altText', 255);
        $base64 = inputString($data, 'base64', 14000000, true);
        $bytes = base64_decode($base64, true);
        if ($bytes === false || strlen($bytes) !== (int) ($data['size'] ?? -1) || strlen($bytes) > 10485760) throw new ApiError(400, 'Upload size validation failed.');
        $finfo = new finfo(FILEINFO_MIME_TYPE); $detected = $finfo->buffer($bytes) ?: '';
        $allowed = ['image/png','image/jpeg','image/webp','image/gif','image/svg+xml','video/mp4','video/webm','application/pdf','application/vnd.ms-powerpoint','application/vnd.openxmlformats-officedocument.presentationml.presentation','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document','text/plain'];
        if (!in_array($mimeType, $allowed, true) || ($detected !== $mimeType && !($mimeType === 'image/svg+xml' && $detected === 'text/plain'))) throw new ApiError(400, 'Unsupported or mismatched upload type.');
        $directory = dirname(__DIR__) . '/uploads';
        if (!is_dir($directory) && !mkdir($directory, 0750, true) && !is_dir($directory)) throw new ApiError(500, 'Upload directory is unavailable.');
        $extension = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
        $key = bin2hex(random_bytes(16)) . ($extension !== '' ? '.' . preg_replace('/[^a-z0-9]/', '', $extension) : '');
        if (file_put_contents($directory . '/' . $key, $bytes, LOCK_EX) === false) throw new ApiError(500, 'Could not save uploaded file.');
        $url = basePath() . '/uploads/' . rawurlencode($key);
        $statement = database()->prepare('INSERT INTO mediaAssets (filename, storageKey, url, mimeType, size, altText, status, uploadedBy) VALUES (?, ?, ?, ?, ?, ?, \'approved\', ?)');
        $statement->execute([basename($filename), $key, $url, $mimeType, strlen($bytes), $altText, $user['id']]);
        $fetch = database()->prepare('SELECT * FROM mediaAssets WHERE id = ?'); $fetch->execute([(int) database()->lastInsertId()]);
        respond($fetch->fetch(), 201);
    }
    if (preg_match('#^/admin/media/(\d+)$#', $route, $matches) && $method === 'PUT') {
        requireSameOrigin(); $data = jsonBody(); $updates = []; $values = [];
        if (array_key_exists('altText', $data)) { $updates[] = 'altText = ?'; $values[] = inputString($data, 'altText', 255); }
        if (array_key_exists('status', $data)) {
            if (!in_array($data['status'], ['pending', 'approved', 'archived'], true)) throw new ApiError(400, 'Invalid media status.');
            $updates[] = 'status = ?'; $values[] = $data['status'];
        }
        if (!$updates) throw new ApiError(400, 'No media fields to update.');
        $values[] = (int) $matches[1];
        $statement = database()->prepare('UPDATE mediaAssets SET ' . implode(', ', $updates) . ' WHERE id = ?'); $statement->execute($values);
        $fetch = database()->prepare('SELECT * FROM mediaAssets WHERE id = ?'); $fetch->execute([(int) $matches[1]]);
        respond($fetch->fetch() ?: null);
    }

    // ---------- Users & Roles ----------
    if ($route === '/admin/users' && $method === 'GET') {
        respond(database()->query('SELECT id, name, email, role, loginMethod, createdAt, lastSignedIn FROM users ORDER BY lastSignedIn DESC')->fetchAll());
    }
    if ($route === '/admin/users' && $method === 'POST') {
        requireSameOrigin();
        $data = jsonBody();
        $name = inputString($data, 'name', 255, true);
        $email = strtolower((string) inputString($data, 'email', 320, true));
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) throw new ApiError(400, 'Valid email required.');
        $password = (string) ($data['password'] ?? '');
        if (strlen($password) < 12) throw new ApiError(400, 'Password must be at least 12 characters.');
        $role = $data['role'] ?? 'user';
        if (!in_array($role, ['user', 'admin'], true)) throw new ApiError(400, 'Invalid role.');

        $check = database()->prepare('SELECT id FROM users WHERE LOWER(email) = ? LIMIT 1');
        $check->execute([$email]);
        if ($check->fetch()) throw new ApiError(409, 'User with this email already exists.');

        $passwordHash = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);
        $stmt = database()->prepare('INSERT INTO users (name, email, passwordHash, role, loginMethod) VALUES (?, ?, ?, ?, \'local\')');
        $stmt->execute([$name, $email, $passwordHash, $role]);
        $id = (int) database()->lastInsertId();
        $fetch = database()->prepare('SELECT id, name, email, role, loginMethod, createdAt, lastSignedIn FROM users WHERE id = ?');
        $fetch->execute([$id]);
        respond($fetch->fetch(), 201);
    }
    if (preg_match('#^/admin/users/(\d+)/role$#', $route, $matches) && $method === 'PATCH') {
        requireSameOrigin();
        $actor = currentUser();
        $data = jsonBody();
        $role = $data['role'] ?? '';
        $targetId = (int) $matches[1];
        if (!in_array($role, ['user', 'admin'], true)) throw new ApiError(400, 'Invalid role.');
        if ($targetId === (int) $actor['id'] && $role === 'user') {
            $adminCount = (int) database()->query("SELECT COUNT(*) FROM users WHERE role = 'admin'")->fetchColumn();
            if ($adminCount <= 1) {
                throw new ApiError(400, 'You are the only administrator. Grant another administrator role before demoting yourself.');
            }
        }
        $statement = database()->prepare('UPDATE users SET role = ? WHERE id = ?');
        $statement->execute([$role, $targetId]);
        respond(['success' => true]);
    }
    if (preg_match('#^/admin/users/(\d+)$#', $route, $matches) && $method === 'DELETE') {
        requireSameOrigin();
        $actor = currentUser();
        $targetId = (int) $matches[1];
        if ($targetId === (int) $actor['id']) throw new ApiError(400, 'Cannot delete your own account.');
        database()->prepare('DELETE FROM users WHERE id = ?')->execute([$targetId]);
        respond(['success' => true]);
    }
    if (preg_match('#^/admin/users/(\d+)/reset-password$#', $route, $matches) && $method === 'POST') {
        requireSameOrigin();
        $targetId = (int) $matches[1];
        $data = jsonBody();
        $password = (string) ($data['password'] ?? '');
        if (strlen($password) < 8) throw new ApiError(400, 'Password must be at least 8 characters.');
        $hash = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);
        database()->prepare('UPDATE users SET passwordHash = ?, resetToken = NULL, resetTokenExpires = NULL WHERE id = ?')->execute([$hash, $targetId]);
        respond(['success' => true, 'message' => 'User password updated successfully.']);
    }

    // ---------- Schools ----------
    if ($route === '/admin/schools' && $method === 'GET') {
        respond(database()->query('SELECT * FROM schools ORDER BY name ASC')->fetchAll());
    }
    if ($route === '/admin/schools' && $method === 'POST') {
        requireSameOrigin(); $data = jsonBody();
        $name = inputString($data, 'name', 255, true);
        $district = inputString($data, 'district', 120, true);
        $description = inputString($data, 'description', 5000);
        $imageUrl = inputString($data, 'imageUrl', 700);
        $latitude = (isset($data['latitude']) && $data['latitude'] !== '') ? (float) $data['latitude'] : null;
        $longitude = (isset($data['longitude']) && $data['longitude'] !== '') ? (float) $data['longitude'] : null;
        $status = $data['status'] ?? 'published';
        if (!in_array($status, ['draft', 'published'], true)) throw new ApiError(400, 'Invalid school status.');
        $id = isset($data['id']) ? (int) $data['id'] : 0;
        if ($id > 0) {
            $statement = database()->prepare('UPDATE schools SET name=?, district=?, description=?, imageUrl=?, latitude=?, longitude=?, status=? WHERE id=?');
            $statement->execute([$name, $district, $description, $imageUrl, $latitude, $longitude, $status, $id]);
        } else {
            $statement = database()->prepare('INSERT INTO schools (name, district, description, imageUrl, latitude, longitude, status) VALUES (?,?,?,?,?,?,?)');
            $statement->execute([$name, $district, $description, $imageUrl, $latitude, $longitude, $status]);
            $id = (int) database()->lastInsertId();
        }
        $fetch = database()->prepare('SELECT * FROM schools WHERE id = ?'); $fetch->execute([$id]);
        respond($fetch->fetch());
    }
    if (preg_match('#^/admin/schools/(\d+)$#', $route, $matches) && $method === 'DELETE') {
        requireSameOrigin();
        $statement = database()->prepare('DELETE FROM schools WHERE id = ?'); $statement->execute([(int) $matches[1]]);
        respond(['success' => true]);
    }

    // ---------- Teachers ----------
    if ($route === '/admin/teachers' && $method === 'GET') {
        respond(database()->query('SELECT t.*, s.name AS schoolName FROM teachers t LEFT JOIN schools s ON s.id = t.schoolId ORDER BY t.fullName ASC')->fetchAll());
    }
    if ($route === '/admin/teachers' && $method === 'POST') {
        requireSameOrigin(); $data = jsonBody();
        $fullName = inputString($data, 'fullName', 255, true);
        $email = inputString($data, 'email', 320);
        $phone = inputString($data, 'phone', 64);
        $schoolId = (isset($data['schoolId']) && $data['schoolId'] !== '') ? (int) $data['schoolId'] : null;
        $bio = inputString($data, 'bio', 5000);
        $photoUrl = inputString($data, 'photoUrl', 700);
        $status = $data['status'] ?? 'pending';
        if (!in_array($status, ['pending', 'approved', 'inactive'], true)) throw new ApiError(400, 'Invalid teacher status.');
        $id = isset($data['id']) ? (int) $data['id'] : 0;
        if ($id > 0) {
            $statement = database()->prepare('UPDATE teachers SET fullName=?, email=?, phone=?, schoolId=?, bio=?, photoUrl=?, status=? WHERE id=?');
            $statement->execute([$fullName, $email, $phone, $schoolId, $bio, $photoUrl, $status, $id]);
        } else {
            $statement = database()->prepare('INSERT INTO teachers (fullName, email, phone, schoolId, bio, photoUrl, status) VALUES (?,?,?,?,?,?,?)');
            $statement->execute([$fullName, $email, $phone, $schoolId, $bio, $photoUrl, $status]);
            $id = (int) database()->lastInsertId();
        }
        $fetch = database()->prepare('SELECT t.*, s.name AS schoolName FROM teachers t LEFT JOIN schools s ON s.id = t.schoolId WHERE t.id = ?'); $fetch->execute([$id]);
        respond($fetch->fetch());
    }
    if (preg_match('#^/admin/teachers/(\d+)$#', $route, $matches) && $method === 'DELETE') {
        requireSameOrigin();
        $statement = database()->prepare('DELETE FROM teachers WHERE id = ?'); $statement->execute([(int) $matches[1]]);
        respond(['success' => true]);
    }

    // ---------- Alumni ----------
    if ($route === '/admin/alumni' && $method === 'GET') {
        respond(database()->query('SELECT a.*, s.name AS schoolName FROM alumni a LEFT JOIN schools s ON s.id = a.schoolId ORDER BY a.fullName ASC')->fetchAll());
    }
    if ($route === '/admin/alumni' && $method === 'POST') {
        requireSameOrigin(); $data = jsonBody();
        $fullName = inputString($data, 'fullName', 255, true);
        $email = inputString($data, 'email', 320);
        $phone = inputString($data, 'phone', 64);
        $graduationYear = (isset($data['graduationYear']) && $data['graduationYear'] !== '') ? (int) $data['graduationYear'] : null;
        $schoolId = (isset($data['schoolId']) && $data['schoolId'] !== '') ? (int) $data['schoolId'] : null;
        $bio = inputString($data, 'bio', 5000);
        $status = $data['status'] ?? 'pending';
        if (!in_array($status, ['pending', 'approved', 'rejected'], true)) throw new ApiError(400, 'Invalid alumni status.');
        $id = isset($data['id']) ? (int) $data['id'] : 0;
        if ($id > 0) {
            $statement = database()->prepare('UPDATE alumni SET fullName=?, email=?, phone=?, graduationYear=?, schoolId=?, bio=?, status=? WHERE id=?');
            $statement->execute([$fullName, $email, $phone, $graduationYear, $schoolId, $bio, $status, $id]);
        } else {
            $statement = database()->prepare('INSERT INTO alumni (fullName, email, phone, graduationYear, schoolId, bio, status) VALUES (?,?,?,?,?,?,?)');
            $statement->execute([$fullName, $email, $phone, $graduationYear, $schoolId, $bio, $status]);
            $id = (int) database()->lastInsertId();
        }
        $fetch = database()->prepare('SELECT a.*, s.name AS schoolName FROM alumni a LEFT JOIN schools s ON s.id = a.schoolId WHERE a.id = ?'); $fetch->execute([$id]);
        respond($fetch->fetch());
    }
    if (preg_match('#^/admin/alumni/(\d+)$#', $route, $matches) && $method === 'DELETE') {
        requireSameOrigin();
        $statement = database()->prepare('DELETE FROM alumni WHERE id = ?'); $statement->execute([(int) $matches[1]]);
        respond(['success' => true]);
    }

    // ---------- News ----------
    if ($route === '/admin/news' && $method === 'GET') {
        respond(database()->query('SELECT * FROM newsArticles ORDER BY COALESCE(publishedAt, createdAt) DESC')->fetchAll());
    }
    if ($route === '/admin/news' && $method === 'POST') {
        requireSameOrigin(); $user = currentUser(); $data = jsonBody();
        $slug = inputString($data, 'slug', 120, true);
        $title = inputString($data, 'title', 255, true);
        $category = inputString($data, 'category', 80, true);
        $excerpt = inputString($data, 'excerpt', 1000);
        $body = inputString($data, 'body', 100000, true);
        $imageUrl = inputString($data, 'imageUrl', 700);
        $status = $data['status'] ?? 'draft';
        if (!in_array($status, ['draft', 'published'], true)) throw new ApiError(400, 'Invalid news status.');
        $publishedAt = ($status === 'published') ? date('Y-m-d H:i:s') : null;
        $id = isset($data['id']) ? (int) $data['id'] : 0;
        if ($id > 0) {
            $statement = database()->prepare('UPDATE newsArticles SET slug=?, title=?, category=?, excerpt=?, body=?, imageUrl=?, status=?, publishedAt=COALESCE(publishedAt, ?) WHERE id=?');
            $statement->execute([$slug, $title, $category, $excerpt, $body, $imageUrl, $status, $publishedAt, $id]);
        } else {
            $statement = database()->prepare('INSERT INTO newsArticles (slug, title, category, excerpt, body, imageUrl, status, publishedAt, createdBy) VALUES (?,?,?,?,?,?,?,?,?)');
            $statement->execute([$slug, $title, $category, $excerpt, $body, $imageUrl, $status, $publishedAt, $user['id']]);
            $id = (int) database()->lastInsertId();
        }
        $fetch = database()->prepare('SELECT * FROM newsArticles WHERE id = ?'); $fetch->execute([$id]);
        respond($fetch->fetch());
    }
    if (preg_match('#^/admin/news/(\d+)$#', $route, $matches) && $method === 'DELETE') {
        requireSameOrigin();
        $statement = database()->prepare('DELETE FROM newsArticles WHERE id = ?'); $statement->execute([(int) $matches[1]]);
        respond(['success' => true]);
    }

    // ---------- Gallery ----------
    if ($route === '/admin/gallery' && $method === 'GET') {
        respond(database()->query('SELECT * FROM galleryItems ORDER BY createdAt DESC')->fetchAll());
    }
    if ($route === '/admin/gallery' && $method === 'POST') {
        requireSameOrigin(); $user = currentUser(); $data = jsonBody();
        $title = inputString($data, 'title', 255, true);
        $caption = inputString($data, 'caption', 1000);
        $url = inputString($data, 'url', 700, true);
        $mediaType = $data['mediaType'] ?? 'image';
        if (!in_array($mediaType, ['image', 'video'], true)) throw new ApiError(400, 'Invalid media type.');
        $category = inputString($data, 'category', 80);
        $status = $data['status'] ?? 'approved';
        if (!in_array($status, ['pending', 'approved', 'archived'], true)) throw new ApiError(400, 'Invalid gallery status.');
        $id = isset($data['id']) ? (int) $data['id'] : 0;
        if ($id > 0) {
            $statement = database()->prepare('UPDATE galleryItems SET title=?, caption=?, url=?, mediaType=?, category=?, status=? WHERE id=?');
            $statement->execute([$title, $caption, $url, $mediaType, $category, $status, $id]);
        } else {
            $statement = database()->prepare('INSERT INTO galleryItems (title, caption, url, mediaType, category, status, createdBy) VALUES (?,?,?,?,?,?,?)');
            $statement->execute([$title, $caption, $url, $mediaType, $category, $status, $user['id']]);
            $id = (int) database()->lastInsertId();
        }
        $fetch = database()->prepare('SELECT * FROM galleryItems WHERE id = ?'); $fetch->execute([$id]);
        respond($fetch->fetch());
    }
    if (preg_match('#^/admin/gallery/(\d+)$#', $route, $matches) && $method === 'DELETE') {
        requireSameOrigin();
        $statement = database()->prepare('DELETE FROM galleryItems WHERE id = ?'); $statement->execute([(int) $matches[1]]);
        respond(['success' => true]);
    }

    // ---------- Best practices ----------
    if ($route === '/admin/best-practices' && $method === 'GET') {
        respond(database()->query('SELECT * FROM bestPractices ORDER BY updatedAt DESC')->fetchAll());
    }
    if ($route === '/admin/best-practices' && $method === 'POST') {
        requireSameOrigin(); $data = jsonBody();
        $title = inputString($data, 'title', 255, true);
        $category = inputString($data, 'category', 80, true);
        $summary = inputString($data, 'summary', 1000);
        $body = inputString($data, 'body', 100000, true);
        $documentUrl = inputString($data, 'documentUrl', 700);
        $imageUrl = inputString($data, 'imageUrl', 700);
        $status = $data['status'] ?? 'draft';
        if (!in_array($status, ['draft', 'published'], true)) throw new ApiError(400, 'Invalid practice status.');
        $id = isset($data['id']) ? (int) $data['id'] : 0;
        if ($id > 0) {
            $statement = database()->prepare('UPDATE bestPractices SET title=?, category=?, summary=?, body=?, documentUrl=?, imageUrl=?, status=? WHERE id=?');
            $statement->execute([$title, $category, $summary, $body, $documentUrl, $imageUrl, $status, $id]);
        } else {
            $statement = database()->prepare('INSERT INTO bestPractices (title, category, summary, body, documentUrl, imageUrl, status) VALUES (?,?,?,?,?,?,?)');
            $statement->execute([$title, $category, $summary, $body, $documentUrl, $imageUrl, $status]);
            $id = (int) database()->lastInsertId();
        }
        $fetch = database()->prepare('SELECT * FROM bestPractices WHERE id = ?'); $fetch->execute([$id]);
        respond($fetch->fetch());
    }
    if (preg_match('#^/admin/best-practices/(\d+)$#', $route, $matches) && $method === 'DELETE') {
        requireSameOrigin();
        $statement = database()->prepare('DELETE FROM bestPractices WHERE id = ?'); $statement->execute([(int) $matches[1]]);
        respond(['success' => true]);
    }

    throw new ApiError(404, 'API endpoint not found: ' . $route);
}

try {
    routeRequest();
} catch (ApiError $error) {
    respond(['error' => $error->getMessage()], $error->status);
} catch (Throwable $error) {
    error_log('PTRP API error: ' . $error->getMessage());
    respond(['error' => 'The request could not be completed: ' . $error->getMessage()], 500);
}
