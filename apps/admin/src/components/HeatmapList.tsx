import type { HeatmapPoint } from "../core/api";

type HeatmapListProps = {
  points: HeatmapPoint[];
};

export function HeatmapList({ points }: HeatmapListProps) {
  if (points.length === 0) {
    return (
      <div className="rounded-eco-lg border border-dashed border-eco-gray-300 bg-eco-white p-5 font-sans text-body-sm text-eco-gray-500">
        Sin puntos activos para el mapa de calor.
      </div>
    );
  }

  return (
    <ul className="grid gap-eco-2">
      {points.slice(0, 8).map((point, index) => (
        <li
          key={`${point.latitud}-${point.longitud}-${index}`}
          className="h-14 rounded-eco-md border-b border-eco-gray-200 bg-eco-white px-eco-3 font-sans text-body-sm shadow-eco-sm last:border-b-0 hover:bg-eco-gray-50"
        >
          <span className="font-sans text-label text-eco-gray-900">Punto #{index + 1}</span>
          <span className="ml-2 font-mono text-code text-eco-gray-500">
            {point.latitud.toFixed(5)}, {point.longitud.toFixed(5)} · peso {point.peso}
          </span>
        </li>
      ))}
    </ul>
  );
}
