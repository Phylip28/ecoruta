# Integración de OpenRouteService (ORS) - EcoRuta

Este documento resume los cambios realizados para implementar el cálculo de rutas reales y optimizadas utilizando la API de OpenRouteService.

## 🚀 Cambios Realizados

### 1. Infraestructura y Configuración
- **`config.py`**: Se añadió soporte para la variable de entorno `ORS_API_KEY`.
- **`.env`**: Se preparó el archivo para almacenar el Token de seguridad de ORS.
- **`api/schemas.py`**: Se actualizó el modelo `RutaResponse` para incluir el campo `tiempo_estimado_min`.

### 2. Nuevos Servicios
- **`services/ors.py`**: Cliente HTTP ligero basado en `httpx` para interactuar con ORS. Soporta:
  - `get_matrix`: Para obtener matrices de distancia/tiempo entre múltiples puntos.
  - `get_directions`: Para obtener rutas detalladas.
- **`services/routing_advanced.py`**: Nuevo algoritmo de enrutamiento que sustituye el cálculo matemático (Haversine) por distancias reales de conducción y cálculo de tiempos (ETA).

### 3. Integración en la API
- **`api/routes/rutas.py`**: Se actualizó el endpoint `GET /{reciclador_id}` para ser asíncrono y utilizar el nuevo motor de rutas avanzadas.

### 4. Pruebas y Validación
- **`tests/test_ors_integration.py`**: Script de prueba aislado para validar la API Key y el algoritmo con coordenadas reales (ej. Medellín).

## 🛠️ Cómo usar
1. Asegúrate de tener tu `ORS_API_KEY` en el archivo `.env`.
2. Para probar de forma aislada:
   ```bash
   PYTHONPATH=. python tests/test_ors_integration.py
   ```
3. Para iniciar el servidor:
   ```bash
   uvicorn main:app --reload
   ```

## 📈 Beneficios
- **Rutas reales**: Ya no se calculan distancias "en línea recta", sino considerando calles y sentidos de tráfico.
- **Gestión de tiempo**: Ahora el sistema provee un tiempo estimado de llegada (ETA) para los recicladores.
- **Escalabilidad**: El uso de la matriz de ORS permite optimizar rutas de múltiples puntos de forma eficiente.
