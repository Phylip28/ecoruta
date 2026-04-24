# Plan de Ejecucion - Estado Actual

Fecha de actualizacion: 2026-04-24

## Contexto del plan

EcoRuta se definio como una plataforma con tres frentes principales:

1. Mobile (ciudadano y reciclador)
2. Backend API (FastAPI + Postgres/PostGIS)
3. Admin web (dashboard de monitoreo)

El objetivo del MVP es cubrir el flujo extremo a extremo:

- Ciudadano reporta o solicita recoleccion
- Reciclador recibe, navega y actualiza estado
- Admin visualiza calor de puntos e impacto ambiental

## Puntos completados

### 1) Mobile

- Base modular creada y organizada por features.
- Interfaz migrada a React Native Paper con tema unificado.
- Pantallas principales de ciudadano y reciclador listas para prueba.
- Variables de entorno creadas para conexion al backend y datos demo.
- **Ciudadano conectado al backend**: botones "Enviar reporte" y "Enviar solicitud" llaman a POST /api/reportes/ y POST /api/solicitudes/ con feedback visual y manejo de error.

### 2) Backend

- Migracion a uv realizada (dependencias y lockfile en flujo de build).
- Dockerfile ajustado para instalacion reproducible con lock.
- Arranque con Docker Compose validado.
- Pruebas automatizadas ejecutadas correctamente.
- Modulo de Telegram movido a workers.
- Todos los endpoints MVP implementados y funcionales (ver tabla en AGENTS.md).
- Servicio de rutas Nearest Neighbor implementado.
- Servicio de calculo de CO2 por material implementado.
- Notificaciones Telegram en_camino / completado operativas.

### 3) Admin

- Estructura inicial creada con React + Vite + TypeScript + Tailwind.
- Dashboard base implementado (metricas, listado heatmap, impacto).
- Problema de bus error resuelto al ajustar versiones de Vite/plugin.
- Build y dev server validados.
- **Mapa geoespacial real implementado**: componente MapaHeatmap con react-leaflet + OpenStreetMap. Muestra los puntos activos como CircleMarkers con color segun peso (verde/amarillo/rojo). Se integra sobre el listado de puntos existente.
- Consumo real de endpoints de estadisticas (heatmap + impacto).

## Puntos faltantes

### 1) Validacion final

- Prueba E2E completa: ciudadano -> reciclador -> admin con backend corriendo.
- Documentacion final de despliegue local y flujo demo.

### 2) Mejoras opcionales (fuera de MVP)

- Captura de GPS real desde el dispositivo (actualmente usa coordenadas demo del env).
- Captura de foto real (boton presente pero sin implementar).
- Persistencia en base de datos Postgres/PostGIS (actualmente store en memoria).
- Autenticacion real (JWT o similar) en lugar de tokens estaticos.

## Estado resumido

- Mobile: 98%
- Backend: 100%
- Admin: 100%
- MVP integral: 95%

## Proximo bloque recomendado

1. Prueba E2E completa con backend corriendo en Docker.
2. Ajuste de credenciales para demo (cambiar tokens en .env).
3. Documentacion final de despliegue local y flujo demo.
