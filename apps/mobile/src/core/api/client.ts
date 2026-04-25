import { env } from "../../config/env";

function buildHeaders(token: string): HeadersInit {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

async function parseError(response: Response): Promise<never> {
  let detail = `Error HTTP ${response.status}`;
  try {
    const body = (await response.json()) as { detail?: string };
    if (body?.detail) detail = body.detail;
  } catch {
    // keep generic message
  }
  throw new Error(detail);
}

export async function getHealth(): Promise<{ status: string; service: string }> {
  const response = await fetch(`${env.apiUrl}/health`);
  if (!response.ok) throw new Error("No fue posible conectar con el backend");
  return response.json();
}

export type ReportePayload = {
  tipo: "emergencia" | "solicitud";
  latitud: number;
  longitud: number;
  foto_url?: string;
  descripcion?: string;
};

export type SolicitudPayload = {
  latitud: number;
  longitud: number;
  foto_url?: string;
  descripcion?: string;
  material: "carton" | "vidrio" | "plastico" | "mixto";
  ciudadano_telegram_id: number;
  kg_estimados?: number;
};

export async function crearReporte(payload: ReportePayload): Promise<{ id: number }> {
  const response = await fetch(`${env.apiUrl}/api/reportes/`, {
    method: "POST",
    headers: buildHeaders(env.tokens.ciudadano),
    body: JSON.stringify(payload),
  });
  if (!response.ok) return parseError(response);
  return response.json();
}

export async function crearSolicitud(payload: SolicitudPayload): Promise<{ id: number }> {
  const response = await fetch(`${env.apiUrl}/api/solicitudes/`, {
    method: "POST",
    headers: buildHeaders(env.tokens.ciudadano),
    body: JSON.stringify(payload),
  });
  if (!response.ok) return parseError(response);
  return response.json();
}

// Raw shape returned by GET /api/ciudadano/historial
type ApiHistorialItem = {
  id: string;
  tipo: "emergencia" | "solicitud";
  estado: "pendiente" | "en_camino" | "completado";
  fecha: string;
  descripcion: string | null;
  material: "carton" | "vidrio" | "plastico" | "mixto" | null;
  reciclador_id: number | null;
  reciclador_nombre: string | null;
  miniatura_uri: string | null;
  kg_estimados: number;
};

export type HistorialItem = {
  id: string;
  tipo: "emergencia" | "solicitud";
  estado: "pendiente" | "en_camino" | "completado";
  fecha: string;
  descripcion: string | null;
  material: "carton" | "vidrio" | "plastico" | "mixto" | null;
  recicladorId: number | null;
  recicladorNombre: string | null;
  miniaturaUri: string | null;
  kgEstimados: number;
};

export async function getHistorialCiudadano(): Promise<HistorialItem[]> {
  const response = await fetch(`${env.apiUrl}/api/ciudadano/historial`, {
    headers: buildHeaders(env.tokens.ciudadano),
  });
  if (!response.ok) return parseError(response);
  const items = (await response.json()) as ApiHistorialItem[];
  return items.map((item) => ({
    id: item.id,
    tipo: item.tipo,
    estado: item.estado,
    fecha: item.fecha,
    descripcion: item.descripcion,
    material: item.material,
    recicladorId: item.reciclador_id,
    recicladorNombre: item.reciclador_nombre,
    miniaturaUri: item.miniatura_uri,
    kgEstimados: item.kg_estimados ?? 0,
  }));
}
