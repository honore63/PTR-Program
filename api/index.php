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
            throw new ApiError(503, 'Copy config.php.example to config.php and configure XAMPP.');
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
    }
    return $pdo;
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
        && in_array((int) ($parts['port'] ?? 0), [5500, 5173], true)
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
    header('Access-Control-Allow-Headers: Content-Type');
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

function signSession(array $user): string
{
    $settings = config();
    if (empty($settings['manus_jwt_secret']) || empty($settings['manus_project_id'])) {
        throw new ApiError(503, 'Manus authentication is not configured.');
    }
    $header = base64UrlEncode(json_encode(['alg' => 'HS256', 'typ' => 'JWT']));
    $payload = base64UrlEncode(json_encode([
        'openId' => $user['openId'],
        'appId' => $settings['manus_project_id'],
        'name' => $user['name'] ?? '',
        'iat' => time(),
        'exp' => time() + 31536000,
    ]));
    $signature = base64UrlEncode(hash_hmac('sha256', $header . '.' . $payload, $settings['manus_jwt_secret'], true));
    return $header . '.' . $payload . '.' . $signature;
}

function sessionIdentity(): ?array
{
    $token = $_COOKIE['webdev_app_session'] ?? '';
    $parts = explode('.', $token);
    if (count($parts) !== 3 || empty(config()['manus_jwt_secret'])) return null;
    [$header, $payload, $signature] = $parts;
    $expected = base64UrlEncode(hash_hmac('sha256', $header . '.' . $payload, config()['manus_jwt_secret'], true));
    $decoded = base64UrlDecode($payload);
    $jwtHeader = json_decode((string) base64UrlDecode($header), true);
    $claims = json_decode((string) $decoded, true);
    if (!hash_equals($expected, $signature) || ($jwtHeader['alg'] ?? '') !== 'HS256' || !is_array($claims)) return null;
    if (($claims['appId'] ?? '') !== (config()['manus_project_id'] ?? '') || (int) ($claims['exp'] ?? 0) <= time() || empty($claims['openId'])) return null;
    return $claims;
}

function currentUser(bool $required = true): ?array
{
    $identity = sessionIdentity();
    if (!$identity) {
        if ($required) throw new ApiError(401, 'Please login.');
        return null;
    }
    $statement = database()->prepare('SELECT id, openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn FROM users WHERE openId = ? LIMIT 1');
    $statement->execute([$identity['openId']]);
    $user = $statement->fetch();
    if (!$user && $required) throw new ApiError(401, 'Account is not registered. Please sign in again.');
    return $user ?: null;
}

function requireAdmin(): array
{
    $user = currentUser();
    if ($user['role'] !== 'admin') throw new ApiError(403, 'Administrator access required.');
    return $user;
}

function cookieOptions(int $expires): array
{
    $secure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off');
    return ['expires' => $expires, 'path' => basePath() . '/', 'secure' => $secure, 'httponly' => true, 'samesite' => 'Lax'];
}

function oauthRequest(string $path, array $payload): array
{
    $settings = config();
    $base = rtrim((string) ($settings['manus_oauth_api_url'] ?? ''), '/');
    if ($base === '') throw new ApiError(503, 'Set manus_oauth_api_url in config.php.');
    $context = stream_context_create(['http' => [
        'method' => 'POST',
        'header' => "Content-Type: application/json\r\nAccept: application/json\r\n",
        'content' => json_encode($payload),
        'timeout' => 30,
        'ignore_errors' => true,
    ]]);
    $response = @file_get_contents($base . $path, false, $context);
    $status = 0;
    foreach (($http_response_header ?? []) as $line) {
        if (preg_match('/^HTTP\/\S+\s+(\d+)/', $line, $matches)) $status = (int) $matches[1];
    }
    $data = json_decode((string) $response, true);
    if ($status < 200 || $status >= 300 || !is_array($data)) {
        error_log('Manus OAuth request failed with HTTP ' . $status);
        throw new ApiError(502, 'The Manus authentication service could not complete the request.');
    }
    return $data;
}

function redirectManusStorage(string $key): never
{
    $settings = config();
    $base = rtrim((string) ($settings['manus_api_url'] ?? ''), '/');
    $apiKey = (string) ($settings['manus_api_key'] ?? '');
    if ($base === '' || $apiKey === '' || $key === '' || str_contains($key, '..')) {
        throw new ApiError(404, 'Media asset not found.');
    }
    $url = $base . '/v1/storage/presign/get?path=' . rawurlencode($key);
    $context = stream_context_create(['http' => [
        'method' => 'GET',
        'header' => "Authorization: Bearer {$apiKey}\r\nAccept: application/json\r\n",
        'timeout' => 20,
        'ignore_errors' => true,
    ]]);
    $response = @file_get_contents($url, false, $context);
    $data = json_decode((string) $response, true);
    if (empty($data['url']) || !filter_var($data['url'], FILTER_VALIDATE_URL) || !str_starts_with($data['url'], 'https://')) {
        throw new ApiError(502, 'The media storage service could not provide this asset.');
    }
    header('Cache-Control: public, max-age=300');
    header('Location: ' . $data['url'], true, 307);
    exit;
}

function handleOAuthCallback(): never
{
    requireMethod('GET');
    $code = $_GET['code'] ?? '';
    $state = $_GET['state'] ?? '';
    $stateJson = is_string($state) ? base64_decode($state, true) : false;
    $stateData = $stateJson ? json_decode($stateJson, true) : null;
    $nonce = $_COOKIE['ptrp_oauth_state'] ?? '';
    if (!is_string($code) || $code === '' || !is_array($stateData) || empty($stateData['nonce']) || !is_string($nonce) || !hash_equals($nonce, $stateData['nonce'])) {
        throw new ApiError(403, 'Invalid OAuth state. Start sign-in again.');
    }
    $redirectUri = (($_SERVER['HTTPS'] ?? '') !== 'off' && !empty($_SERVER['HTTPS']) ? 'https' : 'http') . '://' . ($_SERVER['HTTP_HOST'] ?? 'localhost') . basePath() . '/api/oauth/callback';
    if (($stateData['redirectUri'] ?? '') !== $redirectUri) throw new ApiError(403, 'OAuth callback URL did not match.');

    $settings = config();
    $token = oauthRequest('/webdev.v1.WebDevAuthPublicService/ExchangeToken', [
        'clientId' => $settings['manus_project_id'],
        'grantType' => 'authorization_code',
        'code' => $code,
        'redirectUri' => $redirectUri,
    ]);
    if (empty($token['accessToken'])) throw new ApiError(502, 'Manus did not return an access token.');
    $info = oauthRequest('/webdev.v1.WebDevAuthPublicService/GetUserInfo', ['accessToken' => $token['accessToken']]);
    if (empty($info['openId'])) throw new ApiError(502, 'Manus did not return a user identity.');

    $ownerOpenId = (string) ($settings['owner_open_id'] ?? '');
    $role = $ownerOpenId !== '' && hash_equals($ownerOpenId, (string) $info['openId']) ? 'admin' : 'user';
    $statement = database()->prepare('INSERT INTO users (openId, name, email, loginMethod, role, lastSignedIn) VALUES (?, ?, ?, ?, ?, NOW()) ON DUPLICATE KEY UPDATE name = VALUES(name), email = VALUES(email), loginMethod = VALUES(loginMethod), lastSignedIn = NOW(), role = IF(VALUES(role) = \'admin\', \'admin\', role)');
    $statement->execute([(string) $info['openId'], $info['name'] ?? null, $info['email'] ?? null, $info['loginMethod'] ?? $info['platform'] ?? null, $role]);
    $userStatement = database()->prepare('SELECT id, openId, name, email, loginMethod, role FROM users WHERE openId = ? LIMIT 1');
    $userStatement->execute([(string) $info['openId']]);
    $user = $userStatement->fetch();
    setcookie('ptrp_oauth_state', '', cookieOptions(time() - 3600));
    setcookie('webdev_app_session', signSession($user), cookieOptions(time() + 31536000));
    header('Location: ' . basePath() . '/', true, 302);
    exit;
}

function inputString(array $data, string $key, int $maxLength, bool $required = false): ?string
{
    $value = $data[$key] ?? null;
    if ($value === null && !$required) return null;
    if (!is_string($value) || ($required && trim($value) === '') || mb_strlen($value) > $maxLength) {
        throw new ApiError(400, 'Invalid ' . $key . '.');
    }
    return $value;
}

function routeRequest(): void
{
    sendCorsHeaders();
    if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
        http_response_code(204);
        return;
    }
    $settings = config();
    $path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
    $storagePrefix = basePath() . '/manus-storage/';
    if (str_starts_with($path, $storagePrefix)) {
        redirectManusStorage(rawurldecode(substr($path, strlen($storagePrefix))));
    }
    $prefix = basePath() . '/api';
    $route = str_starts_with($path, $prefix) ? substr($path, strlen($prefix)) : '';
    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

    if ($route === '/platform/config.js' && $method === 'GET') {
        header('Content-Type: application/javascript; charset=utf-8');
        header('Cache-Control: no-store');
        $scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
        $origin = $scheme . '://' . ($_SERVER['HTTP_HOST'] ?? 'localhost');
        $public = [
            'projectId' => $settings['manus_project_id'] ?? '',
            'oauthPortalUrl' => $settings['manus_oauth_portal_url'] ?? '',
            'apiUrl' => '',
            'apiBrowserKey' => '',
            'apiBaseUrl' => $origin . basePath() . '/api/',
            'oauthCallbackUrl' => $origin . basePath() . '/api/oauth/callback',
        ];
        echo 'window.__MANUS_CONFIG__=' . json_encode($public, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT) . ';';
        return;
    }
    if ($route === '/oauth/callback') { handleOAuthCallback(); }
    if ($route === '/auth/me') { requireMethod('GET'); respond(currentUser(false)); }
    if ($route === '/auth/logout') {
        requireMethod('POST'); requireSameOrigin();
        setcookie('webdev_app_session', '', cookieOptions(time() - 3600));
        respond(['success' => true]);
    }
    if (preg_match('#^/content/([a-zA-Z0-9_-]{1,120})$#', $route, $matches)) {
        requireMethod('GET');
        $statement = database()->prepare("SELECT id, slug, title, summary, body, status, updatedBy, createdAt, updatedAt FROM siteContent WHERE slug = ? AND status = 'published' LIMIT 1");
        $statement->execute([$matches[1]]);
        respond($statement->fetch() ?: null);
    }

    requireAdmin();
    if ($route === '/admin/overview') {
        requireMethod('GET');
        $row = database()->query("SELECT (SELECT COUNT(*) FROM siteContent) AS contentCount, (SELECT COUNT(*) FROM siteContent WHERE status = 'published') AS publishedCount, (SELECT COUNT(*) FROM mediaAssets) AS mediaCount, (SELECT COUNT(*) FROM users) AS userCount, (SELECT COUNT(*) FROM users WHERE role = 'admin') AS adminCount")->fetch();
        respond(array_map('intval', $row));
    }
    if ($route === '/admin/content' && $method === 'GET') {
        $rows = database()->query('SELECT * FROM siteContent ORDER BY updatedAt DESC')->fetchAll();
        respond($rows);
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
    if ($route === '/admin/users' && $method === 'GET') {
        respond(database()->query('SELECT id, name, email, role, lastSignedIn FROM users ORDER BY lastSignedIn DESC')->fetchAll());
    }
    if (preg_match('#^/admin/users/(\d+)/role$#', $route, $matches) && $method === 'PATCH') {
        requireSameOrigin(); $actor = currentUser(); $data = jsonBody();
        $owner = (string) ($settings['owner_open_id'] ?? '');
        if ($owner === '' || !hash_equals($owner, (string) $actor['openId'])) throw new ApiError(403, 'Only the project owner can change administrator access.');
        $role = $data['role'] ?? '';
        $targetId = (int) $matches[1];
        if (!in_array($role, ['user', 'admin'], true)) throw new ApiError(400, 'Invalid role.');
        if ($targetId === (int) $actor['id'] && $role === 'user') throw new ApiError(400, 'The project owner must retain administrator access.');
        $statement = database()->prepare('UPDATE users SET role = ? WHERE id = ?'); $statement->execute([$role, $targetId]);
        respond(['success' => true]);
    }

    throw new ApiError(404, 'API endpoint not found.');
}

try {
    routeRequest();
} catch (ApiError $error) {
    respond(['error' => $error->getMessage()], $error->status);
} catch (Throwable $error) {
    error_log('PTRP API error: ' . $error->getMessage());
    respond(['error' => 'The request could not be completed. Check PHP and MySQL configuration.'], 500);
}