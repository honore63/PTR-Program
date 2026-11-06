<?php
declare(strict_types=1);

if (PHP_SAPI !== 'cli') {
    fwrite(STDERR, "This migration command can only be run from the command line.\n");
    exit(1);
}

$migrationName = $argv[1] ?? '';
if (!preg_match('/^\d{8}_[a-z0-9_-]+\.sql$/i', $migrationName)) {
    fwrite(STDERR, "Usage: php ptrp-migrate YYYYMMDD_migration_name.sql\n");
    exit(2);
}

$migrationDirectory = getenv('MIGRATIONS_DIR') ?: dirname(__DIR__) . '/database/migrations';
$migrationDirectory = realpath($migrationDirectory);
$migrationPath = $migrationDirectory === false
    ? false
    : realpath($migrationDirectory . DIRECTORY_SEPARATOR . basename($migrationName));
if ($migrationDirectory === false || $migrationPath === false || dirname($migrationPath) !== $migrationDirectory) {
    fwrite(STDERR, "The requested migration file does not exist.\n");
    exit(2);
}

$configPath = getenv('PTRP_CONFIG_PATH') ?: dirname(__DIR__) . '/config.php';
if (!is_file($configPath)) {
    fwrite(STDERR, "The application configuration is missing.\n");
    exit(2);
}

$settings = require $configPath;
$dsn = sprintf(
    'mysql:host=%s;port=%d;dbname=%s;charset=utf8mb4',
    $settings['db_host'],
    $settings['db_port'],
    $settings['db_name']
);
$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::MYSQL_ATTR_MULTI_STATEMENTS => true,
];
if (!empty($settings['db_ssl_ca'])) {
    if (!is_file($settings['db_ssl_ca'])) {
        fwrite(STDERR, "The configured MySQL TLS CA file does not exist.\n");
        exit(2);
    }
    $options[PDO::MYSQL_ATTR_SSL_CA] = $settings['db_ssl_ca'];
    $options[PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT] = true;
}
$pdo = new PDO($dsn, $settings['db_user'], $settings['db_password'], $options);
$sql = file_get_contents($migrationPath);
if ($sql === false) {
    fwrite(STDERR, "Could not read the migration file.\n");
    exit(1);
}

$pdo->exec($sql);
fwrite(STDOUT, "Applied migration {$migrationName}.\n");
