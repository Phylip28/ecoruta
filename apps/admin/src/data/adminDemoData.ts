/**
 * Datos de demostración para tablas y KPI ficticios (sin persistencia).
 * Coherente con el dominio del producto (tipo, estados, materiales).
 */

export type DemoTipoReporte = "emergencia" | "solicitud";
export type DemoEstado = "pendiente" | "en_camino" | "completado";
export type DemoMaterial = "carton" | "vidrio" | "plastico" | "mixto";

export type ReporteDemo = {
  id: string;
  tipo: DemoTipoReporte;
  estado: DemoEstado;
  comuna: string;
  barrio: string;
  descripcion: string;
  creado: string;
  reciclador: string | null;
};

export type SolicitudDemo = {
  id: string;
  material: DemoMaterial;
  kg: number;
  estado: DemoEstado;
  comuna: string;
  creado: string;
  ciudadano: string;
  reciclador: string | null;
};

export type RecicladorDemo = {
  id: string;
  nombre: string;
  zona: string;
  activas: number;
  completadas_mes: number;
  rating: number;
  telegram: string;
};

export const reportesDemo: ReporteDemo[] = [
  {
    id: "R-1042",
    tipo: "emergencia",
    estado: "en_camino",
    comuna: "Comuna 10 — La Candelaria",
    barrio: "El Poblado (borde)",
    descripcion: "Cúmulo voluminoso cerca a canal; acceso restringido.",
    creado: "2026-04-24 08:12",
    reciclador: "Luisa Mora",
  },
  {
    id: "R-1041",
    tipo: "solicitud",
    estado: "pendiente",
    comuna: "Comuna 5 — Castilla",
    barrio: "Niquía",
    descripcion: "Recolección cartón y plástico — patio compartido.",
    creado: "2026-04-23 17:40",
    reciclador: null,
  },
  {
    id: "R-1038",
    tipo: "emergencia",
    estado: "completado",
    comuna: "Comuna 2 — Santa Cruz",
    barrio: "Moscú 1",
    descripcion: "Vertimiento en márgenes vía. Atendido con evidencia.",
    creado: "2026-04-22 11:05",
    reciclador: "Héctor Ruiz",
  },
  {
    id: "R-1034",
    tipo: "solicitud",
    estado: "completado",
    comuna: "Comuna 6 — Doce de Octubre",
    barrio: "Santander",
    descripcion: "Solicitud de vidrio y mixto — 12 kg aprox.",
    creado: "2026-04-21 09:20",
    reciclador: "Héctor Ruiz",
  },
  {
    id: "R-1029",
    tipo: "solicitud",
    estado: "pendiente",
    comuna: "Comuna 3 — Manrique",
    barrio: "Nuevo Horizonte",
    descripcion: "Material empaquetado en punto limpio comunitario.",
    creado: "2026-04-20 15:30",
    reciclador: null,
  },
];

export const solicitudesDemo: SolicitudDemo[] = [
  {
    id: "S-2201",
    material: "plastico",
    kg: 4.5,
    estado: "en_camino",
    comuna: "Comuna 4 — Aranjuez",
    creado: "2026-04-24 10:00",
    ciudadano: "cid_883921",
    reciclador: "Luisa Mora",
  },
  {
    id: "S-2200",
    material: "carton",
    kg: 12,
    estado: "pendiente",
    comuna: "Comuna 1 — Popular",
    creado: "2026-04-24 09:15",
    ciudadano: "cid_120441",
    reciclador: null,
  },
  {
    id: "S-2194",
    material: "vidrio",
    kg: 8.2,
    estado: "completado",
    comuna: "Comuna 11 — Laureles",
    creado: "2026-04-23 14:22",
    ciudadano: "cid_220019",
    reciclador: "Héctor Ruiz",
  },
  {
    id: "S-2188",
    material: "mixto",
    kg: 22,
    estado: "completado",
    comuna: "Comuna 7 — Robledo",
    creado: "2026-04-22 16:00",
    ciudadano: "cid_441200",
    reciclador: "Héctor Ruiz",
  },
  {
    id: "S-2181",
    material: "plastico",
    kg: 3.1,
    estado: "pendiente",
    comuna: "Comuna 12 — Poblado",
    creado: "2026-04-22 08:45",
    ciudadano: "cid_900011",
    reciclador: null,
  },
];

export const recicladoresDemo: RecicladorDemo[] = [
  {
    id: "REC-12",
    nombre: "Héctor Ruiz",
    zona: "Norte — 6,7,8",
    activas: 4,
    completadas_mes: 38,
    rating: 4.8,
    telegram: "@hector_rec",
  },
  {
    id: "REC-15",
    nombre: "Luisa Mora",
    zona: "Centro y Occidente",
    activas: 2,
    completadas_mes: 31,
    rating: 4.6,
    telegram: "@lu_mora",
  },
  {
    id: "REC-09",
    nombre: "Carlos Pineda",
    zona: "Sur y Laureles",
    activas: 0,
    completadas_mes: 22,
    rating: 4.3,
    telegram: "@cp_recicla",
  },
];

/** Serie de demostración: evolución de puntos críticos (hasta conectar a históricos). */
export const seriePuntosCriticos = [
  { semana: "S14", valor: 14 },
  { semana: "S15", valor: 12 },
  { semana: "S16", valor: 9 },
  { semana: "S17", valor: 7 },
] as const;

export const kpiFicticios = {
  recicladoresActivos: 12,
  tasaAtencionPct: 87.4,
  reportesNuevosSemana: 23,
} as const;
