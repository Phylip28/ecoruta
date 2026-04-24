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
