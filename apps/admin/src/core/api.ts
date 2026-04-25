const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:8000";
const adminToken = import.meta.env.VITE_ADMIN_TOKEN ?? "admin-dev-token";

type HeatmapPoint = {
  latitud: number;
  longitud: number;
  peso: number;
};

type Impacto = {
  kg_desviados_total: number;
  co2_ahorrado_total_kg: number;
  por_material: Record<string, number>;
};

type Reporte = {
  id: number;
  tipo: "emergencia" | "solicitud";
  estado: "pendiente" | "en_camino" | "completado";
  latitud: number;
  longitud: number;
  foto_url: string | null;
  descripcion: string | null;
  material: "carton" | "vidrio" | "plastico" | "mixto" | null;
  ciudadano_telegram_id: number | null;
  reciclador_id: number | null;
  kg_estimados: number;
  created_at: string;
  updated_at: string;
};

async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${apiUrl}${path}`, {
    headers: {
      Authorization: `Bearer ${adminToken}`,
    },
  });

  if (!response.ok) {
    const message = `Error ${response.status} al consultar ${path}`;
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

export function getHealth() {
  return apiGet<{ status: string; service: string }>("/health");
}

export function getHeatmap() {
  return apiGet<HeatmapPoint[]>("/api/estadisticas/heatmap");
}

export function getImpacto() {
  return apiGet<Impacto>("/api/estadisticas/impacto");
}

export function getReportes() {
  return apiGet<Reporte[]>("/api/reportes/");
}

async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${apiUrl}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${adminToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const message = `Error ${response.status} al POST ${path}`;
    throw new Error(message);
  }
  return response.json() as Promise<T>;
}

type RutaResponse = {
  reciclador_id: number;
  orden: Reporte[];
  distancia_total_km: number;
  tiempo_estimado_min: number | null;
};

export function createSolicitud(payload: {
  latitud: number;
  longitud: number;
  material: "carton" | "vidrio" | "plastico" | "mixto";
  ciudadano_telegram_id: number;
  kg_estimados: number;
  descripcion?: string;
}) {
  return apiPost<Reporte>("/api/solicitudes/", payload);
}

export function createReporte(payload: {
  tipo: "emergencia" | "solicitud";
  latitud: number;
  longitud: number;
  descripcion?: string;
}) {
  return apiPost<Reporte>("/api/reportes/", payload);
}

export function getRuta(recicladorId: number, lat: number, lon: number) {
  return apiGet<RutaResponse>(
    `/api/rutas/${recicladorId}?latitud_actual=${lat}&longitud_actual=${lon}`,
  );
}

export type { HeatmapPoint, Impacto, Reporte, RutaResponse };
