import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useMemo } from "react";
import { CircleMarker, MapContainer, TileLayer, Tooltip } from "react-leaflet";

import { Map as MapIcon } from "lucide-react";

import { heatColorByWeight } from "../design-system";
import type { HeatmapPoint } from "../core/api";
import { EmptyState } from "./ui/EmptyState";

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

export function MapaHeatmap({ points }: Props) {
  const center = useMemo<[number, number]>(() => {
    if (points.length === 0) return MEDELLIN_CENTER;
    const latAvg = points.reduce((acc, p) => acc + p.latitud, 0) / points.length;
    const lonAvg = points.reduce((acc, p) => acc + p.longitud, 0) / points.length;
    return [latAvg, lonAvg];
  }, [points]);

  useEffect(() => {}, [points]);

  if (points.length === 0) {
    return (
      <div className="h-[min(420px,50vh)] min-h-[200px]">
        <EmptyState
          icon={MapIcon}
          title="Sin densidad en el mapa aún"
          description="Cuando haya reportes con coordenadas, verás círculos con intensidad por barrio. Comprobá la conexión o generá datos de prueba en el backend."
        />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-eco-lg shadow-eco-lg ring-1 ring-eco-gray-200">
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: "min(420px, 50vh)", minHeight: "360px", width: "100%" }}
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {points.map((point, idx) => {
          const fill = heatColorByWeight(point.peso);
          return (
            <CircleMarker
              key={`${point.latitud}-${point.longitud}-${idx}`}
              center={[point.latitud, point.longitud]}
              radius={10 + point.peso * 2}
              pathOptions={{
                color: fill,
                fillColor: fill,
                fillOpacity: 0.55,
                weight: 1.5,
              }}
            >
              <Tooltip>
                <span className="font-mono text-code text-eco-gray-700">
                  {point.latitud.toFixed(5)}, {point.longitud.toFixed(5)}
                  <br />
                  Peso: {point.peso}
                </span>
              </Tooltip>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
