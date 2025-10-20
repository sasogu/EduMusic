<?php

declare(strict_types=1);

function lb_json_response(array $data, int $status = 200, array $config = []): void
{
    header('Content-Type: application/json; charset=utf-8');

    $origins = $config['cors_origins'] ?? ['*'];
    if (in_array('*', $origins, true)) {
        header('Access-Control-Allow-Origin: *');
    } else {
        $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
        if ($origin && in_array($origin, $origins, true)) {
            header('Access-Control-Allow-Origin: ' . $origin);
            header('Vary: Origin');
        }
    }
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, X-API-Key');

    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

function lb_connect(array $config): PDO
{
    $pdo = new PDO(
        $config['dsn'],
        $config['user'],
        $config['pass'],
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]
    );

    return $pdo;
}

function lb_normalize_initials(?string $raw): string
{
    if ($raw === null) {
        return 'AAA';
    }
    $upper = strtoupper($raw);
    $clean = preg_replace('/[^A-Z0-9]/', '', $upper) ?? '';
    $trimmed = substr($clean, 0, 3);
    return $trimmed !== '' ? $trimmed : 'AAA';
}

function lb_format_timestamp($value): string
{
    if (!$value) {
        return gmdate('c');
    }
    if ($value instanceof DateTimeInterface) {
        $clone = clone $value;
        return $clone->setTimezone(new DateTimeZone('UTC'))->format('c');
    }
    try {
        $dt = new DateTime((string) $value);
        return $dt->setTimezone(new DateTimeZone('UTC'))->format('c');
    } catch (Throwable $e) {
        return gmdate('c');
    }
}

function handle_leaderboard_request(string $method, string $uri, array $config): void
{
    if ($method === 'OPTIONS') {
        lb_json_response(['ok' => true], 204, $config);
    }

    $pdo = null;
    $apiBase = rtrim($uri, '/');

    if ($apiBase === '/leaderboard/top' && $method === 'GET') {
        $gameId = $_GET['game'] ?? 'default';
        $gameId = trim($gameId);
        if ($gameId === '') {
            $gameId = 'default';
        }
        $pdo = lb_connect($config);
        $stmt = $pdo->prepare(
            'SELECT initials, score, created_at
             FROM leaderboard
             WHERE game_id = :game
             ORDER BY score DESC, created_at ASC
             LIMIT 10'
        );
        $stmt->execute([':game' => $gameId]);
        lb_json_response([
            'game' => $gameId,
            'entries' => array_map(
                static function (array $row): array {
                    return [
                        'initials' => lb_normalize_initials($row['initials'] ?? null),
                        'score' => isset($row['score']) ? (int) $row['score'] : 0,
                        'created_at' => lb_format_timestamp($row['created_at'] ?? null),
                    ];
                },
                $stmt->fetchAll()
            ),
        ], 200, $config);
    }

    if ($apiBase === '/leaderboard/submit' && $method === 'POST') {
        $apiKey = $_SERVER['HTTP_X_API_KEY'] ?? '';
        if (($config['api_key'] ?? '') === '' || !hash_equals($config['api_key'], $apiKey)) {
            lb_json_response(['error' => 'invalid_api_key'], 401, $config);
        }

        $payload = json_decode(file_get_contents('php://input') ?: 'null', true);
        if (!is_array($payload)) {
            lb_json_response(['error' => 'invalid_payload'], 400, $config);
        }

        $gameId = isset($payload['game']) ? trim((string)$payload['game']) : 'default';
        if ($gameId === '') {
            $gameId = 'default';
        }
        $initials = lb_normalize_initials($payload['initials'] ?? null);
        $score = isset($payload['score']) ? (int)$payload['score'] : null;
        if (!is_int($score)) {
            lb_json_response(['error' => 'invalid_score'], 400, $config);
        }

        $pdo = lb_connect($config);
        $insert = $pdo->prepare(
            'INSERT INTO leaderboard (game_id, initials, score)
             VALUES (:game, :initials, :score)'
        );
        $insert->execute([
            ':game' => $gameId,
            ':initials' => $initials,
            ':score' => $score,
        ]);

        // Mantener solo el Top-10 para cada juego.
        $cleanup = $pdo->prepare(
            'DELETE FROM leaderboard
             WHERE game_id = :game
             AND id NOT IN (
               SELECT id FROM (
                 SELECT id
                 FROM leaderboard
                 WHERE game_id = :game
                 ORDER BY score DESC, created_at ASC
                 LIMIT 10
               ) AS limited
             )'
        );
        $cleanup->execute([':game' => $gameId]);

        lb_json_response(['status' => 'ok'], 200, $config);
    }

    lb_json_response(['error' => 'not_found'], 404, $config);
}
