import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useMemo } from "react";
import { CircleMarker, MapContainer, TileLayer, Tooltip } from "react-leaflet";

import type { HeatmapPoint } from "../core/api";

// Fix Leaflet's broken default icon path when bundled with Vite
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

type Props = {
  points: HeatmapPoint[];
};

const MEDELLIN_CENTER: [number, number] = [6.2442, -75.5812];
const MAX_PESO = 10;

function pesoAColor(peso: number): string {
  const t = Math.min(peso / MAX_PESO, 1);
  if (t < 0.4) return "#2E7D32"; // eco-fern — bajo
  if (t < 0.7) return "#F59E0B"; // eco-sun — medio
  return "#B91C1C";              // eco-ember — alto
}

export function MapaHeatmap({ points }: Props) {
  // Recompute center only when points change
  const center = useMemo<[number, number]>(() => {
    if (points.length === 0) return MEDELLIN_CENTER;
    const latAvg = points.reduce((acc, p) => acc + p.latitud, 0) / points.length;
    const lonAvg = points.reduce((acc, p) => acc + p.longitud, 0) / points.length;
    return [latAvg, lonAvg];
  }, [points]);

  // Nothing to do here, but keep the effect for future imperative map ops
  useEffect(() => {}, [points]);

  if (points.length === 0) {
    return (
      <div className="flex h-72 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white text-sm text-slate-500">
        Sin puntos activos para el mapa de calor.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl ring-1 ring-slate-200 shadow-soft">
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: "360px", width: "100%" }}
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {points.map((point, idx) => (
          <CircleMarker
            key={`${point.latitud}-${point.longitud}-${idx}`}
            center={[point.latitud, point.longitud]}
            radius={10 + point.peso * 2}
            pathOptions={{
              color: pesoAColor(point.peso),
              fillColor: pesoAColor(point.peso),
              fillOpacity: 0.55,
              weight: 1.5,
            }}
          >
            <Tooltip>
              <span className="text-xs">
                {point.latitud.toFixed(5)}, {point.longitud.toFixed(5)}
                <br />
                Peso: {point.peso}
              </span>
            </Tooltip>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
