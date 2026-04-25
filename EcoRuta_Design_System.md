# EcoRuta Inteligente — Design System v1.0

> Design system para la Hackathon V2.0 · Universidad Católica Luis Amigo  
> Stack: Expo · React Native · TypeScript (Mobile) | FastAPI · Python (Web Admin)

---

## Índice

1. [Principios de Diseño](#1-principios-de-diseño)
2. [Paleta de Colores](#2-paleta-de-colores)
3. [Tipografía](#3-tipografía)
4. [Espaciado y Grid](#4-espaciado-y-grid)
5. [Iconografía](#5-iconografía)
6. [Tokens de Diseño](#6-tokens-de-diseño)
7. [Componentes — Mobile (Ciudadano)](#7-componentes--mobile-ciudadano)
8. [Componentes — Mobile (Reciclador)](#8-componentes--mobile-reciclador)
9. [Componentes — Web (Admin)](#9-componentes--web-admin)
10. [Componentes Compartidos](#10-componentes-compartidos)
11. [Patrones de Navegación](#11-patrones-de-navegación)
12. [Accesibilidad](#12-accesibilidad)
13. [Motion & Animaciones](#13-motion--animaciones)
14. [Guía de Implementación](#14-guía-de-implementación)

---

## 1. Principios de Diseño

El design system de EcoRuta está guiado por cuatro principios que responden directamente a los tres perfiles de usuario y al contexto de uso al aire libre.

### 1.1 Claridad Radical
Cada pantalla tiene **una acción principal visible**. No hay ambigüedad sobre qué hacer a continuación. Aplica especialmente al Reciclador, que opera en movimiento y bajo el sol.

### 1.2 Inclusión Digital
La interfaz funciona para usuarios con baja alfabetización digital. Los íconos siempre acompañan al texto. Los mensajes de error explican el problema **y** la solución.

### 1.3 Legibilidad en Exterior
El contraste mínimo en la app del Reciclador es WCAG AA en condiciones normales y WCAG AAA en elementos críticos (botón principal, contador de recolección), pensando en pantallas bajo luz solar directa.

### 1.4 Datos como Acción
Para el Admin, cada métrica va acompañada de una acción posible. El dashboard no es decorativo; es operativo.

---

## 2. Paleta de Colores

### 2.1 Colores Base (Paleta "Green Globe on Moss")

| Token | Hex | Nombre | Uso Principal |
|---|---|---|---|
| `color-navy` | `#042940` | Abismo Marino | Fondos oscuros, texto principal en fondos claros |
| `color-teal` | `#005C53` | Bosque Profundo | Color de marca, headers, elementos de confianza |
| `color-lime` | `#9FC131` | Lima Activa | Acciones secundarias, estados "en camino" |
| `color-yellow` | `#DBF227` | Destello Solar | CTA principal (especialmente Reciclador), alertas positivas |
| `color-sage` | `#D6D58E` | Salvia | Fondos suaves, estados deshabilitados, elementos neutros |
| `color-white` | `#FFFFFF` | Blanco | Fondos de tarjetas, texto sobre fondos oscuros |
| `color-black` | `#0A0A0A` | Negro Profundo | Texto de alta legibilidad sobre fondos amarillos/claros |

### 2.2 Escala de Grises (derivada de la paleta)

| Token | Hex | Uso |
|---|---|---|
| `color-gray-900` | `#111827` | Texto principal |
| `color-gray-700` | `#374151` | Texto secundario |
| `color-gray-500` | `#6B7280` | Placeholders, metadata |
| `color-gray-300` | `#D1D5DB` | Bordes, divisores |
| `color-gray-100` | `#F3F4F6` | Fondos alternativos |
| `color-gray-50`  | `#F9FAFB` | Fondo de página (Admin) |

### 2.3 Colores Semánticos

| Token | Hex Base | Función |
|---|---|---|
| `color-success` | `#9FC131` (lime) | Recolección completada, estado OK |
| `color-warning` | `#DBF227` (yellow) | Alertas, pendiente de atención |
| `color-danger` | `#D94F3D` | Errores, reporte de emergencia crítico |
| `color-info` | `#005C53` (teal) | Información neutra, tooltips |

> **Nota**: `color-danger` (`#D94F3D`) es el único color fuera de la paleta principal. Se usa exclusivamente para estados de error y el badge "Reporte de Emergencia" para diferenciarlo claramente del flujo de recolección.

### 2.4 Combinaciones de Contraste Aprobadas

Las siguientes combinaciones superan el ratio WCAG AA (4.5:1 para texto normal, 3:1 para texto grande):

| Fondo | Texto/Ícono | Ratio | Uso |
|---|---|---|---|
| `#DBF227` (amarillo) | `#042940` (navy) | ~9.2:1 ✅ AAA | Botón CTA Reciclador |
| `#042940` (navy) | `#FFFFFF` (blanco) | ~15.4:1 ✅ AAA | Header oscuro |
| `#005C53` (teal) | `#FFFFFF` (blanco) | ~8.1:1 ✅ AAA | Botones primarios |
| `#9FC131` (lime) | `#042940` (navy) | ~5.1:1 ✅ AA | Botones secundarios |
| `#FFFFFF` (blanco) | `#042940` (navy) | ~15.4:1 ✅ AAA | Tarjetas de contenido |
| `#D6D58E` (sage) | `#042940` (navy) | ~4.8:1 ✅ AA | Estado deshabilitado |

> ⚠️ **NUNCA** usar `#DBF227` como color de texto sobre fondo blanco (ratio 1.2:1). El amarillo es exclusivo para fondos.

---

## 3. Tipografía

### 3.1 Familias Tipográficas

**Display / Headings: `Sora`**
- Geométrica, moderna, excelente legibilidad en tamaños grandes
- Pesos usados: `600` (SemiBold), `700` (Bold), `800` (ExtraBold)
- Instalación: `@expo-google-fonts/sora`

**Body / UI: `DM Sans`**
- Sans-serif humanista, alta legibilidad en texto continuo y UI
- Pesos usados: `400` (Regular), `500` (Medium), `700` (Bold)
- Instalación: `@expo-google-fonts/dm-sans`

**Monoespaciado / Datos: `DM Mono`**
- Para métricas numéricas, coordenadas, contadores
- Peso usado: `500` (Medium)
- Instalación: `@expo-google-fonts/dm-mono`

### 3.2 Escala Tipográfica — Mobile (React Native)

Todos los valores en `sp` (scale-independent pixels) para respetar accesibilidad del sistema.

| Token | Familia | Peso | Tamaño | Line Height | Uso |
|---|---|---|---|---|---|
| `text-display` | Sora | 800 | 32sp | 40sp | Pantallas de bienvenida |
| `text-heading-1` | Sora | 700 | 28sp | 36sp | Título de sección principal |
| `text-heading-2` | Sora | 700 | 22sp | 30sp | Subtítulos, nombres de sección |
| `text-heading-3` | Sora | 600 | 18sp | 26sp | Encabezados de tarjeta |
| `text-body-lg` | DM Sans | 400 | 17sp | 26sp | Texto de lectura principal (Ciudadano) |
| `text-body-md` | DM Sans | 400 | 15sp | 22sp | Texto estándar |
| `text-body-sm` | DM Sans | 400 | 13sp | 20sp | Metadata, etiquetas |
| `text-label-lg` | DM Sans | 700 | 16sp | 20sp | Labels de botones grandes |
| `text-label-md` | DM Sans | 700 | 14sp | 18sp | Labels de botones estándar |
| `text-caption` | DM Sans | 500 | 12sp | 16sp | Timestamps, ayudas contextuales |
| `text-metric` | DM Mono | 500 | 28sp | 34sp | Contadores, cifras de impacto |
| `text-metric-sm` | DM Mono | 500 | 20sp | 26sp | Métricas secundarias |

### 3.3 Escala Tipográfica — Web Admin

Valores en `rem` (base 16px).

| Token | Familia | Peso | Tamaño | Line Height | Uso |
|---|---|---|---|---|---|
| `text-display` | Sora | 800 | 2.5rem | 3rem | Hero de dashboard |
| `text-h1` | Sora | 700 | 2rem | 2.5rem | Título de página |
| `text-h2` | Sora | 700 | 1.5rem | 2rem | Sección de dashboard |
| `text-h3` | Sora | 600 | 1.25rem | 1.75rem | Encabezado de card/widget |
| `text-h4` | Sora | 600 | 1.125rem | 1.5rem | Sub-sección |
| `text-body` | DM Sans | 400 | 1rem | 1.625rem | Texto general |
| `text-body-sm` | DM Sans | 400 | 0.875rem | 1.375rem | Texto secundario, tablas |
| `text-label` | DM Sans | 700 | 0.875rem | 1.25rem | Labels de inputs, tabla headers |
| `text-caption` | DM Sans | 500 | 0.75rem | 1.125rem | Fechas, metadata |
| `text-metric-xl` | DM Mono | 500 | 3rem | 3.5rem | KPI principal del dashboard |
| `text-metric-lg` | DM Mono | 500 | 2rem | 2.5rem | KPI secundario |
| `text-metric-md` | DM Mono | 500 | 1.5rem | 2rem | Métricas de tarjetas |
| `text-code` | DM Mono | 500 | 0.875rem | 1.375rem | Coordenadas, IDs |

### 3.4 Reglas de Uso Tipográfico

- **Reciclador**: Tamaño mínimo de texto informativo es `text-body-md` (15sp). Nunca usar `text-caption` en elementos accionables.
- **Ciudadano**: Los mensajes de error y confirmación usan `text-body-lg` (17sp) para asegurar lectura cómoda.
- **Admin**: Las métricas numéricas siempre usan `DM Mono` para alineación tabular y diferenciación visual.
- `textTransform: 'uppercase'` solo para labels de estado (badges), nunca para texto de lectura.

---

## 4. Espaciado y Grid

### 4.1 Escala Base de Espaciado (múltiplos de 4)

| Token | Valor | Uso típico |
|---|---|---|
| `space-1` | 4dp/px | Separación mínima entre elementos inline |
| `space-2` | 8dp/px | Padding interno de chips/badges |
| `space-3` | 12dp/px | Gap entre ícono y texto en botones |
| `space-4` | 16dp/px | Padding horizontal estándar de pantalla |
| `space-5` | 20dp/px | Separación entre elementos de lista |
| `space-6` | 24dp/px | Padding de tarjetas |
| `space-8` | 32dp/px | Separación entre secciones |
| `space-10` | 40dp/px | Margen superior de secciones principales |
| `space-12` | 48dp/px | Espaciado generoso en pantallas de bienvenida |
| `space-16` | 64dp/px | Separación de bloques grandes (Admin) |

### 4.2 Grid — Mobile

```
Columnas:    4 columnas
Gutter:      16dp (space-4)
Margin H:    16dp (space-4)
```

- Los botones de acción principal (CTA) ocupan **4 columnas** (ancho completo menos margins).
- Los botones secundarios ocupan **2 columnas** (side by side).
- Las tarjetas de resumen pueden ser de **2 columnas** en modo lista o **4 columnas** en pantalla completa.

### 4.3 Grid — Web Admin

```
Columnas:    12 columnas
Gutter:      24px
Margin H:    32px (hasta 1280px), auto-centrado con max-width: 1440px
```

**Breakpoints:**

| Nombre | Rango | Comportamiento |
|---|---|---|
| `sm` | < 768px | Columna única, menú colapsado (no aplica al Admin típico) |
| `md` | 768–1023px | 2 columnas en cards, sidebar oculto |
| `lg` | 1024–1279px | 3 columnas en cards, sidebar visible (240px) |
| `xl` | ≥ 1280px | Layout completo, sidebar (260px), área de trabajo |

### 4.4 Alturas Mínimas de Toque (Mobile)

| Elemento | Altura mínima | Ancho mínimo |
|---|---|---|
| Botón principal (Reciclador) | 64dp | 100% - 32dp |
| Botón principal (Ciudadano) | 56dp | 100% - 32dp |
| Botón secundario | 48dp | 140dp |
| Item de lista accionable | 64dp | 100% |
| Tab bar item | 56dp | — |
| Chip/Badge (no accionable) | 28dp | — |
| Chip/Badge (accionable) | 40dp | 88dp |
| Input de formulario | 52dp | 100% |

> **Regla de oro del Reciclador**: Todo elemento interactivo tiene **mínimo 64dp de altura** y al menos 20dp de espacio táctil alrededor si es un ícono suelto.

---

## 5. Iconografía

### 5.1 Biblioteca de Íconos

**Librería principal**: `@expo/vector-icons` — familia **MaterialCommunityIcons**

Justificación: Consistencia en Android/iOS, íconos específicos de reciclaje y medio ambiente disponibles.

### 5.2 Tamaños de Íconos

| Contexto | Tamaño | Token |
|---|---|---|
| Ícono en botón CTA | 28dp | `icon-xl` |
| Ícono en botón estándar | 22dp | `icon-lg` |
| Ícono en lista / nav | 24dp | `icon-md` |
| Ícono de estado/badge | 16dp | `icon-sm` |
| Ícono en tab bar | 26dp | `icon-nav` |
| Ícono en mapa (pin) | 32dp | `icon-pin` |

### 5.3 Catálogo de Íconos del Proyecto

| Función | Ícono (MaterialCommunityIcons) | Color |
|---|---|---|
| Reporte de emergencia | `alert-octagon` | `color-danger` |
| Solicitud de recolección | `recycle` | `color-teal` |
| Punto pendiente | `map-marker-alert` | `color-warning` |
| En camino | `map-marker-path` | `color-lime` |
| Completado | `check-circle` | `color-success` |
| Ruta optimizada | `routes` | `color-teal` |
| Peso/Cantidad recolectada | `weight-kilogram` | `color-navy` |
| CO₂ ahorrado | `leaf` | `color-lime` |
| Mapa de calor | `fire` | `color-danger` |
| Reciclador (rol) | `account-hard-hat` | `color-teal` |
| Ciudadano (rol) | `account` | `color-navy` |
| Admin (rol) | `shield-account` | `color-navy` |
| Cámara/Foto | `camera` | `color-gray-700` |
| Ubicación actual | `crosshairs-gps` | `color-teal` |
| Materiales: Cartón | `package-variant` | `color-navy` |
| Materiales: Plástico | `bottle-soda` | `color-lime` |
| Materiales: Vidrio | `glass-fragile` | `color-info` |
| Materiales: Metal | `wrench` | `color-gray-700` |
| Estadísticas | `chart-bar` | `color-navy` |
| Notificación | `bell-badge` | `color-warning` |

### 5.4 Reglas de Uso

- Los íconos siempre acompañan texto en elementos accionables para el perfil **Ciudadano**.
- En el perfil **Reciclador**, los íconos pueden ir solos solo si el contexto es completamente claro (ej: botón "+" para confirmar recolección en la pantalla de ruta activa).
- Nunca rotar íconos de flechas de dirección; usar los específicos de la librería.
- En el mapa, los pins de "Reporte de Emergencia" y "Solicitud de Recolección" deben ser **visualmente distintos** en forma y color, no solo en color.

---

## 6. Tokens de Diseño

### 6.1 Border Radius

| Token | Valor | Uso |
|---|---|---|
| `radius-sm` | 6dp/px | Chips, badges, inputs pequeños |
| `radius-md` | 12dp/px | Botones secundarios, tarjetas pequeñas |
| `radius-lg` | 16dp/px | Tarjetas principales, modales |
| `radius-xl` | 24dp/px | Bottom sheets, paneles de mapa |
| `radius-full` | 9999dp/px | Botones FAB, avatares, indicadores de estado |

### 6.2 Sombras (Elevación)

Para React Native, usar `shadow*` props (iOS) + `elevation` (Android).

| Token | iOS Shadow | Android Elevation | Uso |
|---|---|---|---|
| `shadow-none` | — | 0 | Elementos planos, sobre fondos de color |
| `shadow-sm` | offset(0,1) blur:2 opacity:0.08 | 1 | Tarjetas sutiles |
| `shadow-md` | offset(0,4) blur:8 opacity:0.12 | 4 | Tarjetas estándar |
| `shadow-lg` | offset(0,8) blur:16 opacity:0.15 | 8 | Bottom sheets, modales |
| `shadow-xl` | offset(0,16) blur:32 opacity:0.18 | 16 | Overlay, drawer |

Para Web Admin (CSS):
```css
--shadow-sm:  0 1px 3px rgba(4,41,64,0.08), 0 1px 2px rgba(4,41,64,0.06);
--shadow-md:  0 4px 6px rgba(4,41,64,0.07), 0 2px 4px rgba(4,41,64,0.06);
--shadow-lg:  0 10px 15px rgba(4,41,64,0.10), 0 4px 6px rgba(4,41,64,0.05);
--shadow-xl:  0 20px 25px rgba(4,41,64,0.10), 0 10px 10px rgba(4,41,64,0.04);
```

### 6.3 Opacidades

| Token | Valor | Uso |
|---|---|---|
| `opacity-disabled` | 0.38 | Elementos deshabilitados |
| `opacity-overlay` | 0.72 | Overlay oscuro sobre mapa |
| `opacity-hint` | 0.60 | Texto de placeholder |
| `opacity-pressed` | 0.85 | Estado pressed de botón |

### 6.4 Duración de Animaciones

| Token | Duración | Curva | Uso |
|---|---|---|---|
| `duration-fast` | 100ms | `ease-out` | Feedback inmediato (press) |
| `duration-normal` | 200ms | `ease-in-out` | Transiciones de estado |
| `duration-slow` | 350ms | `ease-in-out` | Aparición de modales/sheets |
| `duration-deliberate` | 500ms | `ease-in-out` | Animaciones de carga, onboarding |

---

## 7. Componentes — Mobile (Ciudadano)

### 7.1 Botón de Acción Principal (CTA)

El botón más importante en la pantalla del ciudadano. Debe ser inconfundible.

```typescript
interface CitizenCTAProps {
  label: string;
  icon: string; // MaterialCommunityIcons name
  onPress: () => void;
  variant: 'emergency' | 'collection'; // Reporte vs Solicitud
  disabled?: boolean;
}
```

**Especificaciones visuales:**

| Propiedad | Valor `emergency` | Valor `collection` |
|---|---|---|
| Background | `#D94F3D` | `#005C53` |
| Texto | `#FFFFFF` | `#FFFFFF` |
| Tipografía | `text-label-lg` (Sora 700) | `text-label-lg` (Sora 700) |
| Altura | 64dp | 64dp |
| Border radius | `radius-lg` (16dp) | `radius-lg` (16dp) |
| Ícono | `alert-octagon` 28dp | `recycle` 28dp |
| Padding H | 24dp | 24dp |
| Gap ícono-texto | 12dp | 12dp |
| Sombra | `shadow-md` | `shadow-md` |

**Estados:**
- **Default**: Fondo sólido, sombra visible
- **Pressed**: Opacidad `opacity-pressed` (0.85), escala `0.97`, duración `duration-fast`
- **Disabled**: Background `color-sage`, texto `color-gray-500`, sin sombra
- **Loading**: Reemplazar texto por `ActivityIndicator` del mismo color que el texto

### 7.2 Tarjeta de Reporte

Muestra un reporte creado por el ciudadano.

```typescript
interface ReportCardProps {
  type: 'emergency' | 'collection';
  address: string;
  materials?: string[]; // Solo para 'collection'
  status: 'pending' | 'in_progress' | 'completed';
  timestamp: Date;
  imageUri?: string;
  onPress: () => void;
}
```

**Especificaciones visuales:**
- Background: `color-white`
- Border radius: `radius-lg` (16dp)
- Sombra: `shadow-md`
- Padding: `space-6` (24dp) todos los lados
- Border izquierdo: 4dp color según `type` (`color-danger` / `color-teal`)
- Imagen: 80×80dp, `radius-md`, esquina superior derecha
- Separador entre tarjetas: `space-4` (16dp)

**Badge de estado:**

| Status | Texto | Color fondo | Color texto |
|---|---|---|---|
| `pending` | Pendiente | `#DBF227` | `#042940` |
| `in_progress` | En camino | `#9FC131` | `#042940` |
| `completed` | Completado | `#005C53` | `#FFFFFF` |

### 7.3 Formulario de Reporte (Ciudadano)

**Campo de tipo de material (Chips seleccionables):**

```
Cartón    Plástico    Vidrio    Metal    Otro
```

- Chip no seleccionado: Fondo `color-gray-100`, borde `color-gray-300` 1dp, texto `color-gray-700`
- Chip seleccionado: Fondo `color-teal`, texto `color-white`, sin borde
- Altura chip: 40dp, padding H: 16dp, radius: `radius-full`
- Gap entre chips: `space-2` (8dp), disposición en `flexWrap: 'wrap'`

**Campo de ubicación (automático):**
- Muestra dirección textual obtenida de reverse geocoding
- Ícono `crosshairs-gps` en `color-teal` a la izquierda
- Fondo `color-gray-50`, borde `color-gray-300`
- Texto en `text-body-md`, no editable directamente

**Campo de foto:**
- Área táctil 100% ancho, altura 160dp
- Fondo `color-gray-100`, borde punteado `color-gray-300` 2dp, radius `radius-lg`
- Estado vacío: ícono `camera` 48dp `color-gray-500` centrado + texto "Toca para agregar foto"
- Estado con foto: imagen en `cover`, botón de eliminar superpuesto (24dp, `color-danger`)

**Mensaje descriptivo de ayuda:**
- Usando `text-body-md` DM Sans Regular
- Color `color-gray-700`
- Ícono informativo `information` 16dp a la izquierda del texto
- Fondo `color-gray-50`, padding `space-3`, radius `radius-sm`

### 7.4 Mensajes de Feedback (Ciudadano)

Los mensajes deben ser **descriptivos**: explicar qué pasó y qué sigue.

**Toast / Snackbar:**
- Aparece desde la parte inferior, duración 4 segundos
- Mínimo 2 líneas de texto reservadas
- Tipografía `text-body-md`
- Variantes:

| Tipo | Fondo | Texto | Ícono |
|---|---|---|---|
| Éxito | `#005C53` | `#FFFFFF` | `check-circle` |
| Error | `#D94F3D` | `#FFFFFF` | `alert-circle` |
| Info | `#042940` | `#FFFFFF` | `information` |
| Advertencia | `#DBF227` | `#042940` | `alert` |

**Texto de ejemplo (éxito):** "¡Tu reporte fue enviado! Un reciclador lo verá pronto."
**Texto de ejemplo (error):** "No pudimos guardar tu reporte. Revisa tu conexión a internet e intenta de nuevo."

### 7.5 Estado Vacío (Ciudadano)

Cuando no hay reportes activos.

- Ilustración SVG centrada (160×160dp) usando los colores de la paleta
- Título: `text-heading-2`, `color-navy`
- Descripción: `text-body-lg`, `color-gray-700`, máximo 2 líneas, centrado
- Botón CTA debajo del texto

---

## 8. Componentes — Mobile (Reciclador)

> **Principio rector**: El Reciclador trabaja bajo el sol, en movimiento, con las manos a veces ocupadas. Cada interacción debe ser **un solo toque**, la información crítica debe ser **legible a brazo extendido**.

### 8.1 Panel de Ruta Activa (Componente estrella)

Es el componente más importante de la app del Reciclador. Ocupa la parte inferior de la pantalla sobre el mapa.

```typescript
interface ActiveRoutePanelProps {
  nextPoint: CollectionPoint;
  totalPoints: number;
  completedPoints: number;
  collectedKg: number;
  estimatedKgRemaining: number;
  onArrived: () => void;    // Botón principal
  onSkip: () => void;       // Botón secundario (saltar punto)
}
```

**Especificaciones visuales:**

```
┌─────────────────────────────────────────────────┐
│  PRÓXIMO PUNTO            ●●●○○  3 de 5         │
│─────────────────────────────────────────────────│
│  📦 Cra. 70 # 45-23, Laureles         →  350m  │
│  Plástico · Cartón                              │
│                                                 │
│  [  ✓  YA LLEGUÉ  ]    [ Saltar →  ]            │
│                                                 │
│  Recolectado hoy: ━━━━━━━━░░░░  12.5 kg        │
└─────────────────────────────────────────────────┘
```

- **Fondo del panel**: `color-navy` (`#042940`)
- **Header "PRÓXIMO PUNTO"**: `text-caption` uppercase, `color-sage`
- **Indicador de progreso**: puntos circulares 8dp, completados en `color-yellow`, pendientes en `color-gray-700`
- **Dirección**: `text-heading-3` Sora 600, `color-white`
- **Distancia**: `text-metric-sm` DM Mono, `color-yellow`, alineado derecha
- **Materiales**: chips pequeños (28dp), fondo `color-teal` semitransparente, texto `color-white`
- **Botón "YA LLEGUÉ"**: 64dp altura, fondo `color-yellow`, texto `color-black` `text-label-lg`, `radius-lg`
- **Botón "Saltar"**: 64dp altura, fondo transparente, borde `color-sage` 1dp, texto `color-sage`
- **Barra de progreso**: `color-lime` sobre `color-gray-700`, altura 6dp, radius `radius-full`
- **Texto recolectado**: `text-metric` DM Mono `color-yellow`
- **Border radius superior**: `radius-xl` (24dp)
- **Sombra**: `shadow-xl`

### 8.2 Pin de Mapa (Reciclador)

Los pins en el mapa deben ser distinguibles de lejos.

| Tipo | Forma | Color fondo | Color borde | Ícono |
|---|---|---|---|---|
| Solicitud de recolección (pendiente) | Teardrop | `#DBF227` | `#042940` | `recycle` 16dp navy |
| Solicitud (siguiente en ruta) | Teardrop grande | `#005C53` | `#DBF227` | `recycle` 20dp white |
| Reporte de emergencia | Hexágono | `#D94F3D` | `#FFFFFF` | `alert-octagon` 16dp white |
| Punto completado | Círculo | `#9FC131` | `#FFFFFF` | `check` 14dp white |

**Tamaños de pins:**
- Estándar: 44×54dp
- Siguiente en ruta: 56×68dp (20% más grande para destacar)

### 8.3 Confirmación de Recolección (Bottom Sheet)

Aparece al presionar "YA LLEGUÉ". Diseño para ser operado con una sola mano.

```
┌─────────────────────────────────────┐
│  ════ (handle)                      │
│                                     │
│  ✓  Cra. 70 # 45-23                 │
│     Solicitud de Recolección        │
│                                     │
│  ¿Cuánto material recolectaste?     │
│                                     │
│  [  -  ]  [ 2.5 kg ]  [  +  ]      │
│                                     │
│  Material: [ Plástico ] [Cartón]    │
│                                     │
│  [  CONFIRMAR RECOLECCIÓN  ]        │
│  [ Cancelar ]                       │
└─────────────────────────────────────┘
```

- Fondo: `color-white`
- Handle: 40×4dp, `color-gray-300`, centrado, `radius-full`
- Título dirección: `text-heading-3`, `color-navy`
- Pregunta: `text-body-lg`, `color-gray-700`
- Botones `-` y `+`: 56×56dp, `radius-full`, fondo `color-teal`, ícono `color-white` 24dp
- Valor central: `text-metric` DM Mono, `color-navy`, ancho mínimo 100dp
- Botón confirmar: 64dp, fondo `color-yellow`, texto `color-black`, `text-label-lg`
- Botón cancelar: texto solamente, `text-label-md`, `color-gray-500`

### 8.4 Indicador de Recolección del Día (Widget persistente)

Visible en todas las pantallas del Reciclador como un chip fijo en la parte superior derecha del mapa.

```
┌────────────────┐
│ 🍃  12.5 kg   │
│  hoy           │
└────────────────┘
```

- Fondo: `color-navy` con opacidad 0.90
- Ícono `leaf` `color-lime` 18dp
- Número: `text-metric-sm` `color-yellow`
- "hoy": `text-caption` `color-sage`
- Border radius: `radius-xl`
- Padding: 10dp V / 14dp H
- Sombra: `shadow-lg`
- Posición: top: 16dp, right: 16dp (sobre el mapa)

### 8.5 Cambio de Estado del Punto

El flujo es lineal: **Pendiente → En Camino → Completado**

El Reciclador nunca escribe nada. Los estados se cambian con botones grandes.

| Estado | Color Fondo Tarjeta | Acción disponible | Botón |
|---|---|---|---|
| Pendiente | `color-white` | Marcar "En Camino" | Azul teal, 56dp |
| En Camino | `color-teal` 10% | Confirmar llegada | Amarillo, 64dp |
| Completado | `color-lime` 15% | (Solo visualización) | — |

---

## 9. Componentes — Web (Admin)

### 9.1 Layout del Dashboard

```
┌──────────┬──────────────────────────────────────────┐
│          │  Header (64px)                            │
│ Sidebar  │──────────────────────────────────────────│
│ (260px)  │                                          │
│          │  KPI Cards (4 columnas)                  │
│  Nav     │──────────────────────────────────────────│
│  Items   │  Mapa de Calor (8 cols) | Stats (4 cols) │
│          │──────────────────────────────────────────│
│          │  Tabla de Reportes Recientes (12 cols)   │
│          │                                          │
└──────────┴──────────────────────────────────────────┘
```

**Sidebar:**
- Ancho: 260px fijo
- Fondo: `color-navy` (`#042940`)
- Logo EcoRuta: parte superior, padding 24px
- Separador de secciones: línea 1px `color-teal` 40% opacidad
- Item activo: fondo `color-teal`, borde izquierdo 3px `color-yellow`, texto `color-white`
- Item inactivo: texto `color-sage`, hover fondo `rgba(255,255,255,0.06)`
- Tipografía nav: `text-body` DM Sans Medium

**Header:**
- Fondo: `color-white`
- Altura: 64px
- Sombra: `shadow-sm`
- Contiene: breadcrumb (izquierda), nombre de admin + avatar (derecha)

### 9.2 Tarjetas KPI

Los 4 KPIs principales del dashboard.

```typescript
interface KPICardProps {
  title: string;
  value: number | string;
  unit?: string;
  change?: number; // % respecto al período anterior
  icon: string;
  color: 'teal' | 'lime' | 'yellow' | 'danger';
}
```

**Especificaciones:**
- Ancho: 3 de 12 columnas (grid)
- Padding: 24px
- Border radius: `radius-lg` (16px)
- Fondo: `color-white`
- Sombra: `shadow-md`
- Border top: 4px del color del KPI
- Ícono: 48×48px, fondo 12% del color del KPI, `radius-md`, ícono 24px del color
- Valor: `text-metric-xl` DM Mono
- Título: `text-label` DM Sans Bold, `color-gray-700`, uppercase
- Cambio positivo: flecha arriba `color-success` + porcentaje
- Cambio negativo: flecha abajo `color-danger` + porcentaje
- Período: `text-caption` `color-gray-500`

**Los 4 KPIs principales:**

| KPI | Ícono | Color | Unidad |
|---|---|---|---|
| Reportes activos | `alert-octagon` | danger | reportes |
| Kg desviados del relleno | `weight-kilogram` | lime | kg |
| CO₂ ahorrado | `leaf` | teal | kg CO₂ |
| Recicladores activos hoy | `account-hard-hat` | teal | personas |

### 9.3 Mapa de Calor (Componente Admin)

Integrado con Leaflet.js o MapLibre GL (open source).

**Capas del mapa:**
- **Capa base**: OpenStreetMap (sin costo de licencia ✅)
- **Capa de calor**: `leaflet-heat` o `maplibre-gl-heatmap`
- **Capa de pins**: Solicitudes y reportes individuales

**Controles del mapa (panel superpuesto):**
```
┌────────────────────────────────────────┐
│ Filtros                                │
│ [Tipo] [Fecha] [Estado] [Barrio]  [✕] │
└────────────────────────────────────────┘
```

- Panel: fondo `color-white`, `shadow-lg`, `radius-lg`, posición top-right del mapa
- Badges de filtro activo: fondo `color-teal` 15%, texto `color-teal`, `radius-full`
- Intensidad del heatmap:
  - Alta densidad (10+ reportes): `#D94F3D` → `#DBF227`
  - Media densidad (5-9): `#DBF227` → `#9FC131`
  - Baja densidad (1-4): `#9FC131` → `#005C53`

**Leyenda del mapa:**
- Posición: bottom-left
- Gradiente de colores con texto "Baja" / "Alta" concentración
- Fondo `rgba(255,255,255,0.90)`, `shadow-md`, `radius-md`

### 9.4 Tabla de Reportes

```typescript
interface ReportTableProps {
  reports: Report[];
  onViewDetail: (id: string) => void;
  onAssignRecycler: (id: string) => void;
}
```

**Especificaciones:**
- Header: fondo `color-gray-50`, texto `text-label` uppercase `color-gray-500`
- Fila: altura 56px, hover fondo `color-gray-50`
- Separador: borde `color-gray-200` 1px
- Columnas: ID (código), Tipo (badge), Dirección, Barrio, Estado (badge), Fecha, Acciones
- Paginación: estilo minimalista, fondo `color-white`, bordes `color-gray-300`
- Filtro rápido sobre la tabla: input de búsqueda 240px + dropdowns de tipo/estado

**Badge de tipo en tabla:**

| Tipo | Fondo | Texto |
|---|---|---|
| Emergencia | `#FDECEA` | `#D94F3D` |
| Recolección | `#E6F4F1` | `#005C53` |

**Badge de estado en tabla:**

| Estado | Fondo | Texto |
|---|---|---|
| Pendiente | `#FEFDE7` | `#8A7600` |
| En Camino | `#EDF7E1` | `#4A6B1A` |
| Completado | `#E6F4F1` | `#005C53` |

### 9.5 Gráficas (Chart Components)

**Librería recomendada**: Recharts (open source, basada en D3.js)

**Paleta de colores para gráficas:**
```javascript
const CHART_COLORS = {
  primary: '#005C53',
  secondary: '#9FC131',
  accent: '#DBF227',
  muted: '#D6D58E',
  danger: '#D94F3D',
  grid: '#E5E7EB',
  text: '#6B7280',
};
```

**Línea/Área (tendencias temporales):**
- Línea: `color-teal`, grosor 2px
- Área bajo la línea: `color-teal` al 10%
- Punto activo: `color-yellow`, borde `color-teal` 2px, radio 6px
- Cuadrícula: `color-gray-200`, líneas punteadas

**Barras (comparación por barrio/zona):**
- Barra normal: `color-teal`
- Barra destacada (barrio más crítico): `color-danger`
- Barra hover: 15% más claro
- Etiquetas: `text-caption` DM Sans

**Dona/Pie (distribución de materiales):**
- Sectores en orden: `color-teal`, `color-lime`, `color-yellow`, `color-sage`, `color-danger`
- Gap entre sectores: 2px
- Leyenda debajo con swatches de 12×12px y `text-body-sm`

---

## 10. Componentes Compartidos

Componentes que aparecen en más de un perfil de usuario.

### 10.1 Pantalla de Selección de Rol

Primera pantalla después del login. Tres tarjetas grandes.

```
┌─────────────────────────────────────┐
│          EcoRuta Inteligente        │
│         ¿Quién eres hoy?           │
│                                     │
│  ┌─────────┐  ┌─────────┐          │
│  │ 👤      │  │ ♻️      │          │
│  │Ciudadano│  │Reciclador│         │
│  └─────────┘  └─────────┘          │
│       ┌─────────┐                  │
│       │ 🛡️ Admin│                  │
│       └─────────┘                  │
└─────────────────────────────────────┘
```

- Fondo de pantalla: `color-navy`
- Tarjeta rol: 160×180dp, `radius-xl`, fondo `color-teal`, sombra `shadow-lg`
- Ícono de rol: 64×64dp, fondo `rgba(219,242,39,0.2)`, ícono 36dp `color-yellow`
- Nombre del rol: `text-heading-3` `color-white`
- Tarjeta activa/hover: borde 2px `color-yellow`, escala 1.03

### 10.2 Estado de Carga (Skeleton)

Reemplaza el contenido mientras carga. Nunca usar spinners solos sin indicar qué está cargando.

**Mobile:**
- Rectángulos gris claro `color-gray-200` animados con shimmer (`color-gray-100` de izquierda a derecha)
- Duración shimmer: 1400ms loop
- Simular la estructura de la tarjeta que cargará

**Web Admin:**
- Mismo principio pero en formato de tabla/card del dashboard

### 10.3 Bottom Sheet (Modal de fondo)

Componente de React Native para iOS/Android.

- Handle: 40×4dp centrado en la parte superior, `color-gray-300`
- Fondo: `color-white`
- Border radius superior: `radius-xl` (24dp)
- Sombra: `shadow-xl`
- Backdrop: negro 72% opacidad
- Gesto de cierre: swipe hacia abajo o tocar backdrop

### 10.4 Notificaciones Push (Visual)

**Ciudadano:**
- "Tu solicitud fue aceptada por un reciclador"
- "Tu reporte de emergencia fue atendido"

**Reciclador:**
- "Nueva solicitud a 300m de ti" (con badge de distancia)
- "Tienes 3 puntos en tu ruta de hoy"

**Visual de notificación en-app:**
- Banner desde la parte superior
- Altura 72dp, padding H 16dp
- Fondo `color-navy`, texto `color-white`
- Ícono relevante a la izquierda 24dp `color-yellow`
- Deslizable hacia la derecha para descartar

---

## 11. Patrones de Navegación

### 11.1 Ciudadano — Mobile

**Estructura:** Tab Bar inferior de 4 ítems

| Tab | Ícono | Label |
|---|---|---|
| Inicio | `home` | Inicio |
| Reportar | `plus-circle` | Reportar |
| Mis Reportes | `format-list-bulleted` | Mis reportes |
| Perfil | `account` | Perfil |

**Tab "Reportar"**: botón central elevado sobre el tab bar, 60×60dp `radius-full`, fondo `color-teal`, ícono `plus` 28dp `color-white`, sombra `shadow-lg`.

**Especificaciones Tab Bar:**
- Altura: 56dp + safe area inferior (iOS)
- Fondo: `color-white`
- Border top: 1dp `color-gray-200`
- Tab activo: ícono + texto `color-teal`
- Tab inactivo: ícono + texto `color-gray-500`
- Tipografía: `text-caption` DM Sans Medium

### 11.2 Reciclador — Mobile

**Estructura:** Sin tab bar. Pantalla principal = Mapa + Panel de ruta.

**Navegación:** Drawer lateral (solo si es necesario salir del flujo principal)
- Mapa de Ruta (principal, siempre visible)
- Historial del día (acceso secundario)
- Mi perfil (acceso secundario)

**Razón:** El Reciclador no debe buscar la app de las rutas entre tabs. La app abre directamente en el mapa con la ruta activa.

**Header del Reciclador:**
- Altura 56dp
- Fondo `color-navy`
- Izquierda: hamburger menu 24dp `color-sage`
- Centro: "EcoRuta" en Sora 700 `color-white`
- Derecha: widget de kg recolectados (compacto)

### 11.3 Admin — Web

**Estructura:** Sidebar izquierdo fijo + área de contenido

**Secciones del sidebar:**
```
🗺️  Dashboard
🔥  Mapa de Calor
📋  Reportes
♻️  Solicitudes
👷  Recicladores
📊  Estadísticas
⚙️  Configuración
```

**Breadcrumb** (en header): Dashboard › Reportes › Detalle #1234

---

## 12. Accesibilidad

### 12.1 Requisitos Mínimos

| Criterio | Requerimiento | Aplica a |
|---|---|---|
| Contraste texto normal | ≥ 4.5:1 (WCAG AA) | Todos |
| Contraste texto grande (18sp+) | ≥ 3:1 (WCAG AA) | Todos |
| Contraste UI crítica (Reciclador exterior) | ≥ 7:1 (WCAG AAA) | Reciclador |
| Área táctil mínima | 44×44dp | Mobile |
| Área táctil CTA Reciclador | 64×(ancho completo) | Reciclador |
| Labels para lectores de pantalla | `accessibilityLabel` en todos los botones | Mobile |
| `role` semántico | `accessibilityRole` correcto | Mobile |

### 12.2 Implementación en React Native

```typescript
// Botón CTA del Reciclador
<TouchableOpacity
  accessibilityLabel="Ya llegué al punto de recolección en Cra. 70 # 45-23"
  accessibilityRole="button"
  accessibilityHint="Confirma tu llegada para registrar la recolección"
  style={styles.ctaButton}
  onPress={handleArrived}
>
  ...
</TouchableOpacity>

// Badge de estado
<View
  accessibilityLabel="Estado: Pendiente"
  accessibilityRole="text"
>
  ...
</View>
```

### 12.3 Consideraciones de Modo Oscuro

La app del **Reciclador** puede implementar un modo de "Alto Contraste Solar":
- Fondo pantalla: `color-navy` (`#042940`) — reduce deslumbramiento
- Texto principal: `color-white`
- CTA: `color-yellow` con texto `color-black` (máximo contraste)

Este modo puede activarse automáticamente según brillo de pantalla o manualmente desde configuración.

---

## 13. Motion & Animaciones

### 13.1 Principios

- Las animaciones **comunican información** (cambio de estado, éxito/error).
- Nunca animar solo por decoración en interfaces de alta carga cognitiva (Reciclador en ruta).
- Duración máxima de una transición de pantalla: 300ms.

### 13.2 Animaciones Definidas

**Transición de pantalla (Mobile):**
- Stack navigation: slide horizontal, 250ms `ease-in-out`
- Modal/Bottom sheet: slide vertical desde abajo, 350ms `ease-out`

**Cambio de estado de punto (Reciclador):**
- Pin del mapa pasa de amarillo a verde: animación de escala 1→1.3→1, 300ms, luego color fade
- Barra de progreso: fill animado de izquierda a derecha, 500ms `ease-in-out`

**Contador de KG (Reciclador):**
- Al confirmar recolección, el número incrementa con animación tipo odómetro
- Duración: 800ms, `ease-out`

**Feedback de botón pressed:**
- Escala: 1.0 → 0.97, 100ms `ease-out`
- Retorno: 0.97 → 1.0, 150ms `ease-in`

**Skeleton Shimmer:**
```javascript
// Animación con Reanimated 2
const shimmer = useSharedValue(0);
useEffect(() => {
  shimmer.value = withRepeat(
    withTiming(1, { duration: 1400, easing: Easing.linear }),
    -1,
    false
  );
}, []);
```

**Notificación Toast:**
- Entrada: slide desde abajo + fade-in, 300ms `ease-out`
- Salida: fade-out, 200ms `ease-in`
- Auto-dismiss: 4000ms

---

## 14. Guía de Implementación

### 14.1 Estructura de Carpetas (Frontend)

```
src/
├── design-system/
│   ├── tokens/
│   │   ├── colors.ts       ← Todos los colores como constantes
│   │   ├── typography.ts   ← Estilos de texto como StyleSheet
│   │   ├── spacing.ts      ← Escala de espaciado
│   │   └── shadows.ts      ← Sombras por plataforma
│   ├── components/
│   │   ├── shared/         ← Componentes comunes
│   │   ├── citizen/        ← Componentes exclusivos del Ciudadano
│   │   ├── recycler/       ← Componentes exclusivos del Reciclador
│   │   └── admin/          ← Componentes del Admin (web)
│   └── index.ts            ← Barrel export
```

### 14.2 Archivo de Tokens (colors.ts)

```typescript
// src/design-system/tokens/colors.ts

export const Colors = {
  // Base palette
  navy:    '#042940',
  teal:    '#005C53',
  lime:    '#9FC131',
  yellow:  '#DBF227',
  sage:    '#D6D58E',
  white:   '#FFFFFF',
  black:   '#0A0A0A',

  // Semantic
  danger:  '#D94F3D',
  success: '#9FC131', // alias lime
  warning: '#DBF227', // alias yellow
  info:    '#005C53', // alias teal

  // Grays
  gray900: '#111827',
  gray700: '#374151',
  gray500: '#6B7280',
  gray300: '#D1D5DB',
  gray100: '#F3F4F6',
  gray50:  '#F9FAFB',

  // Transparency utils
  navyAlpha: (opacity: number) => `rgba(4,41,64,${opacity})`,
  tealAlpha: (opacity: number) => `rgba(0,92,83,${opacity})`,
} as const;
```

### 14.3 Archivo de Tokens (typography.ts)

```typescript
// src/design-system/tokens/typography.ts
import { StyleSheet } from 'react-native';

export const Typography = StyleSheet.create({
  display: {
    fontFamily: 'Sora_800ExtraBold',
    fontSize: 32,
    lineHeight: 40,
  },
  heading1: {
    fontFamily: 'Sora_700Bold',
    fontSize: 28,
    lineHeight: 36,
  },
  heading2: {
    fontFamily: 'Sora_700Bold',
    fontSize: 22,
    lineHeight: 30,
  },
  heading3: {
    fontFamily: 'Sora_600SemiBold',
    fontSize: 18,
    lineHeight: 26,
  },
  bodyLg: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 17,
    lineHeight: 26,
  },
  bodyMd: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 15,
    lineHeight: 22,
  },
  labelLg: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 16,
    lineHeight: 20,
  },
  metric: {
    fontFamily: 'DMMono_500Medium',
    fontSize: 28,
    lineHeight: 34,
  },
  metricSm: {
    fontFamily: 'DMMono_500Medium',
    fontSize: 20,
    lineHeight: 26,
  },
  caption: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 12,
    lineHeight: 16,
  },
});
```

### 14.4 Archivo de Tokens (spacing.ts)

```typescript
// src/design-system/tokens/spacing.ts

export const Spacing = {
  s1:  4,
  s2:  8,
  s3:  12,
  s4:  16,  // Margin horizontal de pantalla
  s5:  20,
  s6:  24,  // Padding de tarjetas
  s8:  32,
  s10: 40,
  s12: 48,
  s16: 64,  // Altura botón CTA Reciclador
} as const;

export const BorderRadius = {
  sm:   6,
  md:   12,
  lg:   16,
  xl:   24,
  full: 9999,
} as const;
```

### 14.5 Dependencias de Fuentes (Expo)

```bash
npx expo install \
  @expo-google-fonts/sora \
  @expo-google-fonts/dm-sans \
  @expo-google-fonts/dm-mono \
  expo-font
```

```typescript
// app/_layout.tsx
import {
  useFonts,
  Sora_600SemiBold,
  Sora_700Bold,
  Sora_800ExtraBold,
} from '@expo-google-fonts/sora';
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
} from '@expo-google-fonts/dm-sans';
import {
  DMMono_500Medium,
} from '@expo-google-fonts/dm-mono';
```

### 14.6 Dependencias de Íconos (Expo)

```bash
npx expo install @expo/vector-icons
```

```typescript
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Uso
<MaterialCommunityIcons name="recycle" size={24} color={Colors.teal} />
```

### 14.7 Librerías de Mapa (Open Source — sin licencia)

**Mobile:**
```bash
npm install react-native-maps
# Usa MapLibre o Google Maps (requiere key gratuita)
# Alternativa 100% open source:
npm install @maplibre/maplibre-react-native
```

**Web Admin:**
```bash
npm install leaflet react-leaflet leaflet-heat
# Tiles de OpenStreetMap: sin costo ✅
```

### 14.8 Checklist por Pantalla

Antes de dar por terminada cualquier pantalla, verificar:

**Mobile:**
- [ ] ¿El botón principal tiene mínimo 56dp de altura? (64dp para Reciclador)
- [ ] ¿Todos los elementos interactivos tienen `accessibilityLabel`?
- [ ] ¿Los mensajes de error son descriptivos (problema + solución)?
- [ ] ¿El contraste de texto cumple WCAG AA mínimo?
- [ ] ¿No hay texto menor a 12sp?
- [ ] ¿Los íconos tienen etiqueta de texto visible o `accessibilityLabel`?
- [ ] ¿Funciona con Dynamic Type activado en iOS?

**Reciclador (adicional):**
- [ ] ¿La información más importante es lo primero visible?
- [ ] ¿No hay campos de texto libre? (solo selección, botones)
- [ ] ¿Todos los botones son mínimo 64dp de altura?
- [ ] ¿El contraste es AAA en elementos críticos?
- [ ] ¿El contador de kg recolectados es visible desde cualquier pantalla?

**Admin Web:**
- [ ] ¿Cada métrica tiene una acción posible asociada?
- [ ] ¿El mapa usa tiles de OpenStreetMap (sin costo)?
- [ ] ¿Las gráficas tienen tooltips al hover?
- [ ] ¿La tabla es filtrable y paginable?
- [ ] ¿El layout funciona en pantallas desde 1024px?

---

## Resumen Visual de Perfiles

| Atributo | Ciudadano | Reciclador | Admin |
|---|---|---|---|
| Plataforma | Mobile | Mobile | Web |
| Navegación | Tab Bar 4 ítems | Pantalla única (mapa) | Sidebar |
| Fondo principal | `color-white` | `color-navy` | `color-gray-50` |
| CTA color | `color-teal` / `color-danger` | `color-yellow` | `color-teal` |
| Texto CTA color | `color-white` | `color-black` | `color-white` |
| Altura CTA | 64dp | 64dp | 48px |
| Tamaño texto mínimo | 15sp | 15sp | 14px |
| Input de texto | ✅ | ❌ (solo botones) | ✅ |
| Fuente datos | `text-body-lg` | `text-heading-3` + DM Mono | DM Mono (métricas) |

---

*EcoRuta Inteligente Design System v1.0 — Hackathon V2.0 UCLA 2026*  
*Paleta "Green Globe On Moss" por Jeni Burnell*
