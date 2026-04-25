import { useMemo } from "react";
import MapView, { Marker, Polyline, type LatLng } from "react-native-maps";

import { Colors } from "../../../design-system";
import type { MapaSolicitudesProps } from "./mapaSolicitudesProps";

function pinColorForSolicitud(tipo: "emergencia" | "solicitud", estado: string): string {
  if (tipo === "emergencia") return "#EF4444";
  if (estado === "en_camino") return "#3B82F6";
  return "#22C55E";
}

export function MapaSolicitudes({
  solicitudes,
  rutaIds,
  recicladorLat,
  recicladorLng,
}: MapaSolicitudesProps) {
  const routeCoords: LatLng[] = useMemo(() => {
    if (rutaIds.length === 0) return [];
    const porId = new Map(solicitudes.map((s) => [s.id, s]));
    const coords: LatLng[] = [];
    for (const id of rutaIds) {
      const s = porId.get(id);
      if (s) coords.push({ latitude: s.latitud, longitude: s.longitud });
    }
    return coords;
  }, [rutaIds, solicitudes]);

  const initialRegion = useMemo(() => {
    if (solicitudes.length === 0) {
      return {
        latitude: recicladorLat,
        longitude: recicladorLng,
        latitudeDelta: 0.06,
        longitudeDelta: 0.06,
      };
    }
    const lats = solicitudes.map((s) => s.latitud);
    const lons = solicitudes.map((s) => s.longitud);
    const minLat = Math.min(...lats, recicladorLat);
    const maxLat = Math.max(...lats, recicladorLat);
    const minLon = Math.min(...lons, recicladorLng);
    const maxLon = Math.max(...lons, recicladorLng);
    const midLat = (minLat + maxLat) / 2;
    const midLon = (minLon + maxLon) / 2;
    return {
      latitude: midLat,
      longitude: midLon,
      latitudeDelta: Math.max(0.02, (maxLat - minLat) * 1.8 || 0.06),
      longitudeDelta: Math.max(0.02, (maxLon - minLon) * 1.8 || 0.06),
    };
  }, [recicladorLat, recicladorLng, solicitudes]);

  return (
    <MapView
      style={{ flex: 1, width: "100%" }}
      initialRegion={initialRegion}
      accessibilityLabel="Mapa de solicitudes pendientes y en camino"
    >
      <Marker
        coordinate={{ latitude: recicladorLat, longitude: recicladorLng }}
        title="Tu posición"
        pinColor="#9CA3AF"
        accessibilityLabel="Marcador de posición del reciclador"
      />
      {solicitudes.map((s) => (
        <Marker
          key={s.id}
          coordinate={{ latitude: s.latitud, longitude: s.longitud }}
          title={`#${s.id} · ${s.material ?? "mixto"}`}
          description={s.tipo === "emergencia" ? "Emergencia" : "Solicitud"}
          pinColor={pinColorForSolicitud(s.tipo, s.estado)}
          accessibilityLabel={`Solicitud ${s.id}, ${s.estado}`}
        />
      ))}
      {routeCoords.length > 1 ? (
        <Polyline
          coordinates={routeCoords}
          strokeColor={Colors.teal}
          strokeWidth={3}
          lineDashPattern={[8, 6]}
        />
      ) : null}
    </MapView>
  );
}
