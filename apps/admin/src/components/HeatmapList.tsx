import type { HeatmapPoint } from "../core/api";

type HeatmapListProps = {
  points: HeatmapPoint[];
};

export function HeatmapList({ points }: HeatmapListProps) {
  if (points.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-5 text-sm text-slate-500">
        Sin puntos activos para el mapa de calor.
      </div>
    );
  }

  return (
    <ul className="grid gap-2">
      {points.slice(0, 8).map((point, index) => (
        <li
          key={`${point.latitud}-${point.longitud}-${index}`}
          className="rounded-xl bg-white px-3 py-2 text-sm shadow-soft ring-1 ring-slate-200"
        >
          <span className="font-semibold text-slate-700">Punto #{index + 1}</span>
          <span className="ml-2 text-slate-500">
            {point.latitud.toFixed(5)}, {point.longitud.toFixed(5)} · peso {point.peso}
          </span>
        </li>
      ))}
    </ul>
  );
}
