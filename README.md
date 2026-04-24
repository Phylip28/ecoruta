# 🌿 EcoRuta Inteligente

> Plataforma móvil de gestión de residuos y reciclaje para las comunas de Medellín.
> Conecta ciudadanos con recuperadores ambientales mediante rutas optimizadas y datos georreferenciados.

---

## 📋 Contexto del Proyecto

**Hackathón V2.0 2026 — Universidad Católica Luis Amigo**
**Programa:** Tecnología en Desarrollo de Software
**Tiempo de desarrollo:** 1 día
**Equipo:** 3 integrantes

### Problema
Los recuperadores ambientales (recicladores) de Medellín realizan rutas manuales y extensas
compitiendo contra camiones de basura ordinaria. Los ciudadanos no tienen forma de reportar
puntos críticos ni de solicitar recolección de material reciclable de forma eficiente.

### Solución
Plataforma móvil (Expo React Native) que:
- Permite a ciudadanos reportar puntos críticos y solicitar recolección
- Genera rutas optimizadas para recicladores
- Muestra mapas de calor para decisiones administrativas
- Notifica por Telegram en cada cambio de estado

---

## 🏗️ Arquitectura

```
ecoruta/
├── apps/
│   ├── mobile/              # Expo React Native (ciudadano + reciclador)
│   └── admin/               # React web (dashboard admin)
├── backend/
│   ├── api/                 # FastAPI — rutas HTTP
│   │   ├── routes/
│   │   │   ├── reportes.py
│   │   │   ├── solicitudes.py
│   │   │   ├── rutas.py
│   │   │   └── estadisticas.py
│   ├── services/            # Lógica de negocio
│   │   ├── routing.py       # Algoritmo Nearest Neighbor / Clarke-Wright
│   │   ├── telegram.py      # Notificaciones Bot Telegram
│   │   └── carbon.py        # Cálculo huella de carbono
│   ├── models/              # Modelos SQLAlchemy
│   │   ├── reporte.py
│   │   ├── solicitud.py
│   │   └── reciclador.py
│   └── main.py
├── .env.example
├── .gitignore
├── docker-compose.yml
└── README.md
```

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología | Justificación |
|---|---|---|
| Mobile | Expo SDK 51 + React Native | Acceso a cámara y GPS sin configuración nativa |
| Admin Web | React + Leaflet.js | Dashboard con mapa de calor |
| Backend | FastAPI (Python 3.11) | Rápido de desarrollar, async nativo |
| Base de datos | PostgreSQL 15 + PostGIS | Queries geoespaciales nativas |
| Notificaciones | Telegram Bot API | Gratuita, sin aprobación, HTTP simple |
| Contenedores | Docker + Docker Compose | Deploy local y en AWS |
| IA (opcional) | Claude API Vision | Clasificación de residuos por foto |

---

## 🗄️ Modelo de Base de Datos

```sql
-- Reporte de punto crítico (basura acumulada indebidamente)
CREATE TABLE reportes (
    id          SERIAL PRIMARY KEY,
    tipo        VARCHAR(20) NOT NULL CHECK (tipo IN ('emergencia', 'solicitud')),
    latitud     DECIMAL(9,6) NOT NULL,
    longitud    DECIMAL(9,6) NOT NULL,
    foto_url    TEXT,
    descripcion TEXT,
    estado      VARCHAR(20) DEFAULT 'pendiente'
                CHECK (estado IN ('pendiente', 'en_camino', 'completado')),
    material    VARCHAR(50),  -- cartón, vidrio, plástico, mixto (solo solicitudes)
    ciudadano_telegram_id BIGINT,
    reciclador_id INTEGER REFERENCES recicladores(id),
    kg_estimados DECIMAL(5,2) DEFAULT 0,
    created_at  TIMESTAMP DEFAULT NOW(),
    updated_at  TIMESTAMP DEFAULT NOW(),
    geom        GEOMETRY(Point, 4326)  -- PostGIS
);

-- Recicladores registrados
CREATE TABLE recicladores (
    id          SERIAL PRIMARY KEY,
    nombre      VARCHAR(100) NOT NULL,
    telegram_id BIGINT UNIQUE,
    latitud_actual DECIMAL(9,6),
    longitud_actual DECIMAL(9,6),
    activo      BOOLEAN DEFAULT TRUE,
    kg_totales  DECIMAL(10,2) DEFAULT 0
);
```

---

## 🔌 Endpoints API

```
POST   /api/reportes/              Crear reporte de punto crítico (foto + coords)
POST   /api/solicitudes/           Solicitar recolección de material reciclable
GET    /api/solicitudes/pendientes Listar solicitudes pendientes para reciclador
PATCH  /api/solicitudes/{id}/estado Cambiar estado (pendiente→en_camino→completado)
GET    /api/rutas/{reciclador_id}  Ruta optimizada para reciclador
GET    /api/estadisticas/heatmap   Datos para mapa de calor (admin)
GET    /api/estadisticas/impacto   KG desviados, huella CO2 ahorrada
```

---

## 📱 Historias de Usuario (MVP)

### HU-1 — Ciudadano reporta punto crítico
- Abrir app → seleccionar "Reportar Emergencia"
- Tomar foto con cámara del celular
- GPS captura coordenadas automáticamente
- Enviar → pin rojo aparece en mapa

### HU-2 — Ciudadano solicita recolección
- Abrir app → seleccionar "Solicitar Recolección"
- Elegir tipo de material: cartón / vidrio / plástico / mixto
- Ingresar Telegram ID para recibir notificaciones
- Enviar → pin verde aparece en mapa del reciclador

### HU-3 — Reciclador ve ruta optimizada
- Reciclador abre app → vista de mapa con pines verdes (solicitudes)
- Sistema calcula ruta Nearest Neighbor desde su ubicación actual
- Reciclador acepta punto → estado cambia a "En Camino"
- Ciudadano recibe notificación Telegram: "Tu reciclador está en camino 🚴"
- Reciclador marca como completado → pin desaparece del mapa
- Ciudadano recibe notificación: "Recolección completada ✅ Desviaste X kg del relleno"

### HU-4 — Admin ve estadísticas
- Dashboard web con mapa de calor de puntos críticos por barrio/comuna
- Métricas: total KG desviados, CO2 ahorrado, puntos críticos activos
- Top 5 comunas con mayor acumulación de residuos

---

## ✅ Criterios de Aceptación (DoD)

- [ ] **Criterio 1:** Captura coordenadas GPS + foto en el reporte
- [ ] **Criterio 2:** Pines en mapa interactivo para rol reciclador
- [ ] **Criterio 3:** Flujo de estado Pendiente → En Camino → Completado con cambio de color del pin
- [ ] **Criterio 4:** Contador de "Residuos desviados del relleno sanitario" visible
- [ ] **Criterio 5:** Cálculo de CO2 ahorrado por recolección (0.5 kg CO2 por kg reciclado aprox.)

---

## 🧮 Algoritmo de Ruta (services/routing.py)

Implementar **Nearest Neighbor** para el MVP:

```python
def calcular_ruta(reciclador_lat, reciclador_lon, solicitudes):
    """
    Algoritmo Nearest Neighbor (greedy) para ruta óptima del reciclador.
    Complejidad: O(n²) — suficiente para n < 50 solicitudes por ruta.
    
    Args:
        reciclador_lat: latitud actual del reciclador
        reciclador_lon: longitud actual del reciclador
        solicitudes: lista de solicitudes pendientes con lat/lon
    
    Returns:
        Lista ordenada de solicitudes (ruta sugerida)
    """
    # 1. Partir desde la posición actual del reciclador
    # 2. En cada paso, ir al punto no visitado más cercano (distancia haversine)
    # 3. Repetir hasta visitar todos los puntos
    pass
```

> **Siguiente iteración:** Reemplazar con Clarke-Wright Savings para rutas con múltiples recicladores.

---

## 📣 Notificaciones Telegram (services/telegram.py)

```python
TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
TELEGRAM_API = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}"

async def notificar_ciudadano(telegram_id: int, mensaje: str):
    """Envía mensaje al ciudadano via Telegram Bot API."""
    # POST https://api.telegram.org/bot{token}/sendMessage
    # body: { chat_id: telegram_id, text: mensaje }
    pass

# Mensajes por estado:
# en_camino   → "🚴 Tu reciclador está en camino. ¡Gracias por reciclar!"
# completado  → "✅ Recolección completada. Desviaste {kg} kg del relleno La Pradera."
```

> **Setup:** Crear bot con @BotFather en Telegram. El ciudadano debe iniciar conversación
> con el bot primero (limitación de la API gratuita).

---

## 🌱 Indicador de Sostenibilidad

```python
def calcular_impacto(kg_recolectados: float, material: str) -> dict:
    """
    Calcula huella de carbono ahorrada según tipo de material.
    Fuente: valores estándar IPCC para reciclaje vs. disposición en relleno.
    """
    factores_co2 = {
        "plastico": 1.5,   # kg CO2 ahorrado por kg reciclado
        "carton":   0.9,
        "vidrio":   0.3,
        "mixto":    0.8,   # promedio conservador
    }
    co2_ahorrado = kg_recolectados * factores_co2.get(material, 0.8)
    return {
        "kg_desviados": kg_recolectados,
        "co2_ahorrado_kg": round(co2_ahorrado, 2),
        "equivalente": f"{round(co2_ahorrado / 0.12, 1)} km en auto no recorridos"
    }
```

---

## 🤖 IA Opcional — Clasificación por Foto (diferenciador)

```python
async def clasificar_residuo_por_foto(imagen_base64: str) -> str:
    """
    Llama a Claude Vision para identificar el tipo de material en la foto.
    Enriquece automáticamente el campo 'material' sin que el ciudadano lo sepa.
    """
    # POST https://api.anthropic.com/v1/messages
    # model: claude-sonnet-4-20250514
    # content: [{ type: image, ... }, { type: text, text: "¿Qué tipo de residuo reciclable ves?" }]
    # Respuesta esperada: "plástico" | "cartón" | "vidrio" | "mixto" | "no reciclable"
    pass
```

---

## 🐳 Docker Compose

```yaml
version: "3.9"
services:
  db:
    image: postgis/postgis:15-3.3
    environment:
      POSTGRES_DB: ecoruta
      POSTGRES_USER: ecoruta
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  backend:
    build: ./backend
    depends_on:
      - db
    ports:
      - "8000:8000"
    env_file: .env
    volumes:
      - ./backend:/app

  admin:
    build: ./apps/admin
    ports:
      - "3000:3000"

volumes:
  pgdata:
```

> **Mobile:** No entra en Docker. Expo Go en el celular apunta a `http://{IP_LOCAL}:8000`

---

## ⚙️ Variables de Entorno (.env.example)

```env
# Base de datos
DB_HOST=db
DB_PORT=5432
DB_NAME=ecoruta
DB_USER=ecoruta
DB_PASSWORD=cambia_esto

# Telegram
TELEGRAM_BOT_TOKEN=your_bot_token_here

# Claude API (opcional - clasificación de residuos)
ANTHROPIC_API_KEY=your_key_here

# Backend
API_URL=http://localhost:8000
```

---

## 📅 Plan de Desarrollo (1 día)

### 🌅 Mañana — Cimientos (3-4 horas)

**DevOps (tú):**
- [ ] Crear repo GitHub con estructura de carpetas
- [ ] Subir `.gitignore`, `.env.example`, `docker-compose.yml`
- [ ] Levantar PostgreSQL + PostGIS con Docker Compose
- [ ] Verificar conexión a BD desde el backend
- [ ] Proteger rama `main` — PRs obligatorios

**Dev Backend:**
- [ ] Inicializar FastAPI con estructura de carpetas
- [ ] Modelos SQLAlchemy + migraciones iniciales
- [ ] Endpoint `POST /api/reportes/` funcional
- [ ] Endpoint `GET /api/solicitudes/pendientes` funcional
- [ ] Crear bot Telegram con @BotFather

**Dev Mobile:**
- [ ] Inicializar Expo con `npx create-expo-app`
- [ ] Navegación entre vistas: Ciudadano / Reciclador
- [ ] Pantalla de reporte: botón cámara + captura GPS

---

### ☀️ Tarde — Features MVP (4-5 horas)

**DevOps:**
- [ ] Inicializar app React admin (`apps/admin/`)
- [ ] Mapa Leaflet.js base con pines
- [ ] Plugin `leaflet.heat` para mapa de calor
- [ ] Consumir `/api/estadisticas/heatmap`

**Dev Backend:**
- [ ] `PATCH /api/solicitudes/{id}/estado` con lógica de estados
- [ ] `services/telegram.py` — notificación en cada cambio de estado
- [ ] `services/routing.py` — algoritmo Nearest Neighbor
- [ ] `GET /api/rutas/{reciclador_id}` funcional

**Dev Mobile:**
- [ ] Pantalla Mapa Reciclador con pines (react-native-maps)
- [ ] Botones de cambio de estado en cada pin
- [ ] Colores por estado: 🟡 Pendiente | 🔵 En Camino | ✅ Completado

---

### 🌙 Noche — Cierre y Pitch (2-3 horas)

**Todo el equipo:**
- [ ] Prueba end-to-end completa (ciudadano → reciclador → admin)
- [ ] Contador de KG desviados visible en mobile y admin
- [ ] `services/carbon.py` — cálculo CO2 conectado al flujo
- [ ] Slides del pitch (ver estructura abajo)
- [ ] Grabar demo de respaldo por si falla el live demo

---

## 🎤 Estructura del Pitch (15 min)

| Tiempo | Sección | Contenido |
|---|---|---|
| 3 min | Problema | Mostrar foto real de punto crítico en Medellín. Enunciar el problema humano del reciclador. |
| 7 min | Demo en vivo | HU-1 reporte con foto → HU-2 solicitud → HU-3 reciclador acepta y completa → notificación Telegram llega en vivo → HU-4 admin ve mapa de calor |
| 3 min | Arquitectura | Monorepo modular, PostGIS, algoritmo de rutas, IA con Claude Vision |
| 2 min | Próximos pasos | Clarke-Wright multi-reciclador, predicción de puntos críticos con ML, integración Emvarias |

---

## 🚀 Próximos Pasos (post-hackathon)

- [ ] Algoritmo Clarke-Wright para múltiples recicladores simultáneos
- [ ] Predicción de puntos críticos con datos históricos (ML)
- [ ] Sistema de gamificación completo para ciudadanos (puntos, insignias)
- [ ] Integración con Emvarias para rutas de camiones ordinarios
- [ ] App nativa con notificaciones push reales (Expo Notifications)
- [ ] Método Húngaro para asignación óptima reciclador ↔ solicitudes

---

## 👥 Equipo

| Rol | Responsabilidad |
|---|---|
| DevOps / Líder técnico | Repo, Docker, Admin dashboard, coordinación |
| Dev Backend | FastAPI, BD, algoritmo de rutas, Telegram |
| Dev Mobile | Expo, vistas ciudadano y reciclador, mapas |

---

## 📄 Licencia

MIT — Hackathón V2.0 2026, Universidad Católica Luis Amigo
