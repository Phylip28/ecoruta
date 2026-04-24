export type EstadoSolicitud = "pendiente" | "en_camino" | "completado";
export type Material = "carton" | "vidrio" | "plastico" | "mixto";

export type Solicitud = {
  id: number;
  tipo: "solicitud" | "emergencia";
  estado: EstadoSolicitud;
  latitud: number;
  longitud: number;
  foto_url: string | null;
  descripcion: string | null;
  material: Material | null;
  ciudadano_telegram_id: number | null;
  reciclador_id: number | null;
  kg_estimados: number;
  created_at: string;
  updated_at: string;
};

export type RutaResponse = {
  reciclador_id: number;
  orden: Solicitud[];
  distancia_total_km: number;
};

export type CrearSolicitudPayload = {
  latitud: number;
  longitud: number;
  foto_url?: string;
  descripcion?: string;
  material: Material;
  ciudadano_telegram_id: number;
  kg_estimados: number;
};
