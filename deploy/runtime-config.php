<?php
declare(strict_types=1);

$env = static function (string $key, string $default = ''): string {
    $value = getenv($key);
    return $value === false ? $default : $value;
};

$allowedOrigins = array_values(array_filter(array_map(
    static function (string $origin): string {
        $origin = trim($origin);
        if ($origin !== '' && !preg_match('#^https?://#i', $origin)) {
            $origin = 'https://' . $origin;
        }
        return rtrim($origin, '/');
    },
    explode(',', $env('ALLOWED_ORIGINS'))
)));

$dbUrl = $env('DATABASE_URL', $env('MYSQL_URL'));
$urlHost = null; $urlPort = null; $urlUser = null; $urlPass = null; $urlPath = null;
if ($dbUrl !== '' && (str_starts_with($dbUrl, 'mysql://') || str_starts_with($dbUrl, 'mysql:'))) {
    $parsed = parse_url($dbUrl);
    if ($parsed) {
        $urlHost = $parsed['host'] ?? null;
        $urlPort = isset($parsed['port']) ? (int) $parsed['port'] : null;
        $urlUser = isset($parsed['user']) ? rawurldecode($parsed['user']) : null;
        $urlPass = isset($parsed['pass']) ? rawurldecode($parsed['pass']) : null;
        $urlPath = isset($parsed['path']) ? trim($parsed['path'], '/') : null;
    }
}

return [
    'db_host' => $env('DB_HOST', $urlHost ?? ''),
    'db_port' => (int) $env('DB_PORT', (string) ($urlPort ?? 3306)),
    'db_name' => $env('DB_NAME', $env('MYSQL_DATABASE', $urlPath ?? 'ptrp')),
    'db_user' => $env('DB_USER', $env('MYSQL_USER', $urlUser ?? 'ptrp')),
    'db_password' => $env('DB_PASSWORD', $env('MYSQL_PASSWORD', $urlPass ?? '')),
    'db_ssl_ca' => $env('DB_SSL_CA'),
    'base_path' => $env('BASE_PATH', '/'),
    'manus_jwt_secret' => $env('MANUS_JWT_SECRET'),
    'session_secret' => $env('SESSION_SECRET'),
    'allowed_origins' => $allowedOrigins,
    'public_api_url' => rtrim($env('PUBLIC_API_URL', $env('RENDER_EXTERNAL_URL')), '/'),
    'upload_dir' => $env('UPLOAD_DIR', __DIR__ . '/uploads'),
    'cookie_samesite' => $env('COOKIE_SAMESITE', 'Lax'),
    'admin_email' => $env('ADMIN_EMAIL', 'ptrpresidenteachers100@gmail.com'),
    'smtp_host' => $env('SMTP_HOST', 'smtp.gmail.com'),
    'smtp_port' => (int) $env('SMTP_PORT', '587'),
    'smtp_encryption' => $env('SMTP_ENCRYPTION', 'tls'),
    'smtp_username' => $env('SMTP_USERNAME'),
    'smtp_password' => $env('SMTP_PASSWORD'),
    'smtp_from_email' => $env('SMTP_FROM_EMAIL'),
    'smtp_from_name' => $env('SMTP_FROM_NAME', 'PTR Alumni Network'),
    'social_facebook_app_id' => $env('SOCIAL_FACEBOOK_APP_ID'),
    'social_facebook_app_secret' => $env('SOCIAL_FACEBOOK_APP_SECRET'),
    'social_instagram_app_id' => $env('SOCIAL_INSTAGRAM_APP_ID'),
    'social_instagram_app_secret' => $env('SOCIAL_INSTAGRAM_APP_SECRET'),
    'social_youtube_api_key' => $env('SOCIAL_YOUTUBE_API_KEY'),
    'social_tiktok_app_id' => $env('SOCIAL_TIKTOK_APP_ID'),
    'social_tiktok_app_secret' => $env('SOCIAL_TIKTOK_APP_SECRET'),
    'social_tiktok_redirect_uri' => $env('SOCIAL_TIKTOK_REDIRECT_URI'),
    'social_oauth_callback_base' => $env('SOCIAL_OAUTH_CALLBACK_BASE'),
];
