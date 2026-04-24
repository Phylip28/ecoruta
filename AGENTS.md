# EcoRuta — Contexto para agentes de IA

Plataforma de gestión de residuos para Medellín. Conecta ciudadanos con recicladores
mediante rutas optimizadas, mapa de calor geoespacial y notificaciones Telegram.
Desarrollada en hackathon (1 día) — prioridad: claridad y funcionalidad sobre abstracción.

---

## Estructura general

```
apps/
  mobile/   # Expo React Native — ciudadano + reciclador
  admin/    # React + Vite + Tailwind — dashboard admin
backend/    # FastAPI + in-memory store (MVP) + PostGIS listo
```

---

## Comandos esenciales

### Backend

```bash
# Levantar base de datos + backend (requiere .env desde .env.example)
docker compose --env-file .env.example up -d db backend

# Desarrollo local sin Docker
cd backend && uv sync --all-groups
uv run uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Tests
cd backend && uv run pytest -q
```

### Admin (React + Vite)

```bash
cd apps/admin
npm install
npm run dev          # http://localhost:5173
npm run build        # tsc + vite build
```

### Mobile (Expo)

```bash
cd apps/mobile
npm install
npm run start        # Expo Go via QR
```

---

## Backend — decisiones de arquitectura

- **Store en memoria** (`backend/services/store.py`): `InMemoryStore` thread-safe.
  No hay ORM ni migraciones en el MVP. `backend/models/` está vacío intencionalmente.
- **Auth por token Bearer estático** (`backend/api/dependencies.py`):
  Tres tokens fijos (ciudadano / reciclador / admin), definidos en `config.py` y `.env`.
- **Routing**: algoritmo Nearest Neighbor en `backend/services/routing.py`.
- **Carbono**: factores IPCC por material en `backend/services/carbon.py`.
- **Telegram**: envío real si `TELEGRAM_BOT_TOKEN` está presente; no-op silencioso si falta.
- **CORS**: abierto (`["*"]`) para el MVP. Ajustar en producción vía `settings.cors_origins`.

### Rutas disponibles

| Método | Ruta                           | Rol requerido     |
| ------ | ------------------------------ | ----------------- |
| POST   | `/api/reportes/`               | ciudadano, admin  |
| POST   | `/api/solicitudes/`            | ciudadano, admin  |
| GET    | `/api/solicitudes/pendientes`  | reciclador, admin |
| PATCH  | `/api/solicitudes/{id}/estado` | reciclador, admin |
| GET    | `/api/rutas/{reciclador_id}`   | reciclador, admin |
| GET    | `/api/estadisticas/heatmap`    | admin             |
| GET    | `/api/estadisticas/impacto`    | admin             |
| GET    | `/health`                      | público           |

Transiciones de estado válidas: `pendiente → en_camino → completado`.

### Schemas clave (`backend/api/schemas.py`)

- `Material`: `"carton" | "vidrio" | "plastico" | "mixto"`
- `EstadoSolicitud`: `"pendiente" | "en_camino" | "completado"`
- `TipoReporte`: `"emergencia" | "solicitud"`

---

## Admin — decisiones de arquitectura

- Vite 5 + React 19 + TypeScript + Tailwind 3.
- Sin router (SPA de una sola vista).
- API client en `apps/admin/src/core/api.ts` — usa `VITE_API_URL` y `VITE_ADMIN_TOKEN`.
- Mapa de calor: `react-leaflet` + `leaflet` en componente `MapaHeatmap`.
- Colores: tokens personalizados Tailwind definidos en `tailwind.config.js`
  (`eco-moss`, `eco-fern`, `eco-mist`, `shadow-soft`).
- Variables de entorno: copiar `apps/admin/.env.example` → `apps/admin/.env`.

**Problema conocido resuelto**: bus error con Vite 6 — versión fijada en `^5.4.0`.

---

## Mobile — decisiones de arquitectura

- Expo SDK 51 + React Native Paper + TypeScript.
- `apps/mobile/src/config/env.ts`: todas las variables de entorno con fallbacks para dev.
- Vista única con `SegmentedButtons` para cambiar entre rol ciudadano / reciclador.
- API client HTTP en `apps/mobile/src/core/api/client.ts` (health) y
  `apps/mobile/src/features/reciclador/api/recicladorClient.ts` (todas las rutas).
- Variables de entorno: copiar `apps/mobile/.env.example` → `apps/mobile/.env`.

---

## Variables de entorno

| Archivo                                         | Propósito                |
| ----------------------------------------------- | ------------------------ |
| `.env.example` → `.env`                         | Backend + docker-compose |
| `apps/admin/.env.example` → `apps/admin/.env`   | Admin Vite               |
| `apps/mobile/.env.example` → `apps/mobile/.env` | Mobile Expo              |

Los tokens dev por defecto son `ciudadano-dev-token`, `reciclador-dev-token`, `admin-dev-token`.

---

## Convenciones de código

- Python: sin tipado implícito — todas las funciones tienen anotaciones de tipo.
- TypeScript: `type` sobre `interface`; sin `any`.
- Español en UI y nombres de dominio (`solicitud`, `reciclador`, `reporte`).
- Inglés en nombres de funciones técnicas y comentarios de código.
- No crear helpers de un solo uso; preferir funciones inline.

---

## Tests del backend

```bash
cd backend && uv run pytest -q
```

- `tests/conftest.py`: fixtures `client` (TestClient) y `sample_solicitud`.
- `tests/test_api.py`: prueba el flujo E2E via HTTP.
- `tests/test_services.py`: prueba `calcular_ruta` y `calcular_impacto`.
- El store se limpia con `store.clear()` en cada test via `autouse` fixture.
