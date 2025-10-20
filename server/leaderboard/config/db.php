<?php

/**
 * Configuración de la conexión y autenticación del API.
 *
 * Copia este archivo a tu servidor y sustituye los valores por los reales.
 */
return [
    'dsn' => 'mysql:host=localhost;dbname=edumusic;charset=utf8mb4',
    'user' => 'edumusic',
    'pass' => 'cambia_esta_clave',

    /**
     * Clave compartida para proteger los endpoints de escritura.
     * Cambia el valor por una cadena larga y aleatoria.
     */
    'api_key' => 'reemplaza_esta_api_key',

    /**
     * Orígenes permitidos para CORS.
     * Usa ['https://tu-dominio.tld'] si quieres restringirlo.
     */
    'cors_origins' => ['*'],
];
