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

export type { HeatmapPoint, Impacto };
