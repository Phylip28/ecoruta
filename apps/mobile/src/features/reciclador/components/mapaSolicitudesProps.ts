import type { Solicitud } from "../types";

export type MapaSolicitudesProps = {
  solicitudes: Solicitud[];
  rutaIds: number[];
  recicladorLat: number;
  recicladorLng: number;
};
