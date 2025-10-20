# EduMúsic Leaderboard API (PHP + MariaDB)

Archivos listos para subir a una instancia **My Webapp** en YunoHost (o cualquier hosting PHP 8.x). Proporciona dos endpoints REST:

- `POST /leaderboard/submit` — guardar puntuaciones.
- `GET /leaderboard/top` — recuperar el Top‑10 por juego.

## Preparación de la base de datos

1. Accede a MariaDB y crea la base, usuario y tabla:

```sql
CREATE DATABASE edumusic;
CREATE USER 'edumusic'@'localhost' IDENTIFIED BY 'cambia_esta_clave';
GRANT ALL PRIVILEGES ON edumusic.* TO 'edumusic'@'localhost';
FLUSH PRIVILEGES;

CREATE TABLE edumusic.leaderboard (
  id INT AUTO_INCREMENT PRIMARY KEY,
  game_id VARCHAR(50) NOT NULL,
  initials CHAR(3) NOT NULL,
  score INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_leaderboard_game_score
  ON edumusic.leaderboard (game_id, score DESC, created_at);
```

2. Ajusta las credenciales en `config/db.php`.

## Despliegue

1. Copia el contenido de esta carpeta a tu webapp (por ejemplo, `/var/www/my_webapp/`).
2. Asegúrate de que la raíz pública de la webapp apunta al directorio `public/`.
3. En el panel de My Webapp, habilita PHP 8.x si aún no lo está.
4. Reinicia el servicio PHP-FPM si es necesario (`systemctl restart php8.x-fpm`).

## Endpoints

### `GET /leaderboard/top?game=<ID>`

Devuelve JSON con máximo 10 entradas ordenadas por puntuación descendente.

```json
{
  "game": "solmi",
  "entries": [
    { "initials": "AAA", "score": 42, "created_at": "2025-02-01T12:34:56Z" }
  ]
}
```

Parámetros:
- `game` (opcional, por defecto `default`) — identificador del juego.

### `POST /leaderboard/submit`

Guarda una nueva puntuación. Requiere cabecera `X-API-Key`.

**Headers**
- `Content-Type: application/json`
- `X-API-Key: tu_api_key`

**Body**
```json
{
  "game": "solmi",
  "initials": "ABC",
  "score": 37
}
```

El servidor:
- Limpia las iniciales y las limita a 3 caracteres alfanuméricos.
- Asegura que siempre exista un valor (usa `AAA` si quedan vacías).
- Mantiene solo las 10 mejores puntuaciones por juego.

## Seguridad y CORS

- Cambia la clave `api_key` de `config/db.php`.
- Ajusta `Access-Control-Allow-Origin` en `public/leaderboard.php` si quieres restringir el origen en vez de permitir `*`.

## Integración con EduMúsic

En el frontend actualiza el objeto `LEADERBOARD_DEFAULT` dentro de `js/app.js`:

```js
const LEADERBOARD_DEFAULT = {
  baseUrl: 'leaderboard',
  apiKey: 'tu_api_key'
};
```

La ruta puede ser relativa (misma webapp) o absoluta (`https://tudominio.tld/leaderboard`). También puedes sobrescribir los valores por página usando meta tags:

```html
<meta name="edumusic:leaderboard:base" content="/leaderboard">
<meta name="edumusic:leaderboard:key" content="tu_api_key">
```

El servicio consumirá:
- `POST <baseUrl>/submit`
- `GET  <baseUrl>/top?game=...`
