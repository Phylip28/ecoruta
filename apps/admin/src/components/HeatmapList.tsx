import { MapPin } from "lucide-react";

import type { HeatmapPoint } from "../core/api";
import { EmptyState } from "./ui/EmptyState";

type HeatmapListProps = {
  points: HeatmapPoint[];
};

export function HeatmapList({ points }: HeatmapListProps) {
  if (points.length === 0) {
    return <EmptyState icon={MapPin} title="Ningún punto en la cola" description="La API de heatmap aún no devuelve coordenadas." />;
  }

  return (
    <ul className="grid max-h-[min(480px,55vh)] gap-2 overflow-y-auto pr-1" role="list" aria-label="Puntos de calor">
      {points.slice(0, 8).map((point, index) => (
        <li
          key={`${point.latitud}-${point.longitud}-${index}`}
          className="flex flex-col justify-center gap-0.5 rounded-eco-md border border-eco-gray-200 bg-gradient-to-r from-eco-white to-eco-gray-50 px-eco-3 py-2.5 text-left shadow-eco-sm transition duration-eco-fast hover:border-eco-teal/20 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex min-w-0 items-center gap-2">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[rgba(0,92,83,0.1)] font-sans text-caption font-bold text-eco-teal">
              {index + 1}
            </span>
            <span className="font-sans text-label text-eco-navy">Punto #{index + 1}</span>
          </div>
          <div className="pl-8 font-mono text-caption text-eco-gray-600 sm:pl-0 sm:text-right">
            {point.latitud.toFixed(5)} · {point.longitud.toFixed(5)}
            <span className="ml-1 text-eco-teal">· peso {point.peso}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}
