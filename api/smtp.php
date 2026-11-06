<?php
declare(strict_types=1);

function smtpReadReply($socket, array $expectedCodes): string
{
    $response = '';
    do {
        $line = fgets($socket, 2048);
        if ($line === false) {
            $meta = stream_get_meta_data($socket);
            throw new RuntimeException(!empty($meta['timed_out']) ? 'SMTP server timed out.' : 'SMTP server closed the connection.');
        }
        $response .= $line;
    } while (strlen($line) >= 4 && $line[3] === '-');

    $code = (int) substr($response, 0, 3);
    if (!in_array($code, $expectedCodes, true)) {
        throw new RuntimeException('SMTP server returned an unexpected response code ' . $code . '.');
    }
    return $response;
}

function smtpWriteCommand($socket, string $command, array $expectedCodes): string
{
    $payload = $command . "\r\n";
    $written = 0;
    while ($written < strlen($payload)) {
        $count = fwrite($socket, substr($payload, $written));
        if ($count === false || $count === 0) {
            throw new RuntimeException('Could not write to the SMTP server.');
        }
        $written += $count;
    }
    return smtpReadReply($socket, $expectedCodes);
}

function smtpEncodeHeader(string $value): string
{
    $words = [];
    for ($offset = 0, $length = mb_strlen($value, 'UTF-8'); $offset < $length; $offset += 42) {
        $chunk = mb_substr($value, $offset, 42, 'UTF-8');
        $words[] = '=?UTF-8?B?' . base64_encode($chunk) . '?=';
    }
    return implode("\r\n ", $words);
}

function sendContactEmail(array $message): void
{
    $settings = config();
    $host = trim((string) ($settings['smtp_host'] ?? ''));
    $port = (int) ($settings['smtp_port'] ?? 587);
    $encryption = strtolower(trim((string) ($settings['smtp_encryption'] ?? 'tls')));
    $username = trim((string) ($settings['smtp_username'] ?? ''));
    $password = (string) ($settings['smtp_password'] ?? '');
    $fromEmail = trim((string) ($settings['smtp_from_email'] ?? '')) ?: $username;
    $fromName = trim((string) ($settings['smtp_from_name'] ?? 'PTR Alumni Network'));

    if ($host === '' || $username === '' || $password === '') {
        throw new RuntimeException('SMTP host, username, and password must be configured.');
    }
    if ($port < 1 || $port > 65535 || !in_array($encryption, ['tls', 'ssl'], true)) {
        throw new RuntimeException('SMTP port or encryption setting is invalid.');
    }
    if (!filter_var($username, FILTER_VALIDATE_EMAIL) || !filter_var($fromEmail, FILTER_VALIDATE_EMAIL)) {
        throw new RuntimeException('SMTP sender address is invalid.');
    }

    $scheme = $encryption === 'ssl' ? 'ssl://' : 'tcp://';
    $context = stream_context_create([
        'ssl' => [
            'verify_peer' => true,
            'verify_peer_name' => true,
            'peer_name' => $host,
        ],
    ]);
    $socket = @stream_socket_client(
        $scheme . $host . ':' . $port,
        $errorCode,
        $errorMessage,
        12,
        STREAM_CLIENT_CONNECT,
        $context,
    );
    if ($socket === false) {
        throw new RuntimeException('Could not connect to the configured SMTP server.');
    }

    stream_set_timeout($socket, 15);
    try {
        smtpReadReply($socket, [220]);
        $hostName = preg_replace('/[^A-Za-z0-9.-]/', '', (string) (gethostname() ?: 'ptrp.local'));
        smtpWriteCommand($socket, 'EHLO ' . ($hostName ?: 'ptrp.local'), [250]);
        if ($encryption === 'tls') {
            smtpWriteCommand($socket, 'STARTTLS', [220]);
            $cryptoEnabled = stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT);
            if ($cryptoEnabled !== true) {
                throw new RuntimeException('Could not establish a verified TLS connection to the SMTP server.');
            }
            smtpWriteCommand($socket, 'EHLO ' . ($hostName ?: 'ptrp.local'), [250]);
        }

        smtpWriteCommand($socket, 'AUTH LOGIN', [334]);
        smtpWriteCommand($socket, base64_encode($username), [334]);
        smtpWriteCommand($socket, base64_encode($password), [235]);
        smtpWriteCommand($socket, 'MAIL FROM:<' . $fromEmail . '>', [250]);
        smtpWriteCommand($socket, 'RCPT TO:<ptrpresidenteachers100@gmail.com>', [250, 251]);
        smtpWriteCommand($socket, 'DATA', [354]);

        $body = implode("\r\n", [
            'New message from the PTR Alumni Network website',
            '',
            'Name: ' . $message['senderName'],
            'Email: ' . $message['senderEmail'],
            'Subject: ' . $message['subject'],
            'Submitted: ' . $message['createdAt'],
            '',
            $message['message'],
        ]);
        $headers = [
            'Date: ' . gmdate('D, d M Y H:i:s') . ' +0000',
            'From: ' . smtpEncodeHeader($fromName) . ' <' . $fromEmail . '>',
            'To: <ptrpresidenteachers100@gmail.com>',
            'Reply-To: <' . $message['senderEmail'] . '>',
            'Subject: ' . smtpEncodeHeader('PTRP website contact: ' . $message['subject']),
            'Message-ID: <ptrp-contact-' . (int) $message['id'] . '@' . $hostName . '>',
            'MIME-Version: 1.0',
            'Content-Type: text/plain; charset=UTF-8',
            'Content-Transfer-Encoding: base64',
        ];
        $data = implode("\r\n", $headers) . "\r\n\r\n" . chunk_split(base64_encode($body), 76, "\r\n") . ".\r\n";
        $written = 0;
        while ($written < strlen($data)) {
            $count = fwrite($socket, substr($data, $written));
            if ($count === false || $count === 0) {
                throw new RuntimeException('Could not write the contact email to the SMTP server.');
            }
            $written += $count;
        }
        smtpReadReply($socket, [250]);
        smtpWriteCommand($socket, 'QUIT', [221]);
    } finally {
        fclose($socket);
    }
}
