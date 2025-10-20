<?php

declare(strict_types=1);

$config = require __DIR__ . '/../config/db.php';

require __DIR__ . '/leaderboard.php';

handle_leaderboard_request(
    $_SERVER['REQUEST_METHOD'] ?? 'GET',
    parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?? '/',
    $config
);
