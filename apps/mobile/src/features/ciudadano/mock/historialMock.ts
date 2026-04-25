import type { EstadoSolicitud, Material } from "../../reciclador/types";

export type HistorialCiudadanoItem = {
  id: string;
  tipo: "emergencia" | "solicitud";
  estado: EstadoSolicitud;
  fecha: string;
  descripcion: string | null;
  material: Material | null;
  recicladorNombre: string | null;
  miniaturaUri: string | null;
};

/** FE-10 — datos de demostración (sin endpoint GET /reportes en MVP). */
export const historialCiudadanoMock: HistorialCiudadanoItem[] = [
  {
    id: "r-1042",
    tipo: "emergencia",
    estado: "en_camino",
    fecha: "2026-04-22T10:15:00",
    descripcion: "Acumulación en andén 12",
    material: null,
    recicladorNombre: "Cooperativa El Bosque",
    miniaturaUri: null,
  },
  {
    id: "s-981",
    tipo: "solicitud",
    estado: "pendiente",
    fecha: "2026-04-21T16:40:00",
    descripcion: "Cartón de mudanza",
    material: "carton",
    recicladorNombre: null,
    miniaturaUri: null,
  },
  {
    id: "s-877",
    tipo: "solicitud",
    estado: "completado",
    fecha: "2026-04-18T09:05:00",
    descripcion: "Vidrio y plástico",
    material: "mixto",
    recicladorNombre: "Red EcoMed",
    miniaturaUri: null,
  },
];
