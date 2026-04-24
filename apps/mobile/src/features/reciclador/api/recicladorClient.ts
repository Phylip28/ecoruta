import { env } from "../../../config/env";
import {
  type CrearSolicitudPayload,
  type EstadoSolicitud,
  type RutaResponse,
  type Solicitud,
} from "../types";

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
    if (body?.detail) {
      detail = body.detail;
    }
  } catch {
    // Keep generic message when backend does not return JSON.
  }

  throw new Error(detail);
}

export async function listarSolicitudesPendientes(): Promise<Solicitud[]> {
  const response = await fetch(`${env.apiUrl}/api/solicitudes/pendientes`, {
    headers: buildHeaders(env.tokens.reciclador),
  });

  if (!response.ok) {
    return parseError(response);
  }

  return response.json();
}

export async function obtenerRutaReciclador(params: {
  recicladorId: number;
  latitudActual: number;
  longitudActual: number;
}): Promise<RutaResponse> {
  const query = new URLSearchParams({
    latitud_actual: params.latitudActual.toString(),
    longitud_actual: params.longitudActual.toString(),
  });

  const response = await fetch(
    `${env.apiUrl}/api/rutas/${params.recicladorId}?${query.toString()}`,
    {
      headers: buildHeaders(env.tokens.reciclador),
    }
  );

  if (!response.ok) {
    return parseError(response);
  }

  return response.json();
}

export async function actualizarEstadoSolicitud(
  solicitudId: number,
  estado: EstadoSolicitud
): Promise<Solicitud> {
  const response = await fetch(
    `${env.apiUrl}/api/solicitudes/${solicitudId}/estado`,
    {
      method: "PATCH",
      headers: buildHeaders(env.tokens.reciclador),
      body: JSON.stringify({ estado }),
    }
  );

  if (!response.ok) {
    return parseError(response);
  }

  return response.json();
}

export async function crearSolicitudDemo(
  payload: CrearSolicitudPayload
): Promise<Solicitud> {
  const response = await fetch(`${env.apiUrl}/api/solicitudes/`, {
    method: "POST",
    headers: buildHeaders(env.tokens.ciudadano),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    return parseError(response);
  }

  return response.json();
}
