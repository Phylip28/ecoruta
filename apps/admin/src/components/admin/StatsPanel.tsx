import { chartColors } from "../../design-system";
import type { Impacto, Reporte } from "../../core/api";
import { MetricCard } from "../MetricCard";
import { BarChart3, CheckCircle2, Clock, AlertTriangle, Leaf } from "lucide-react";

type StatsPanelProps = {
  impacto: Impacto | null;
  reportes: Reporte[];
};

const c = chartColors;

function materialLabel(m: string): string {
  const k = m.toLowerCase();
  const map: Record<string, string> = {
    carton: "Cartón",
    vidrio: "Vidrio",
    plastico: "Plástico",
    mixto: "Mixto",
  };
  return map[k] ?? m;
}

export function StatsPanel({ impacto, reportes }: StatsPanelProps) {
  const mat = impacto?.por_material ?? {};
  const maxCo2 = Math.max(1, ...Object.values(mat));

  const total = reportes.length;
  const completadas = reportes.filter((r) => r.estado === "completado").length;
  const pendientes = reportes.filter((r) => r.estado === "pendiente").length;
  const enCamino = reportes.filter((r) => r.estado === "en_camino").length;
  const emergenciasActivas = reportes.filter(
    (r) => r.tipo === "emergencia" && r.estado !== "completado",
  ).length;
  const estadoMaxWidth = Math.max(1, pendientes, enCamino, completadas);

  return (
    <div className="space-y-6">
      <div className="grid gap-eco-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total en store"
          value={String(total)}
          accent="teal"
          icon={<BarChart3 />}
        />
        <MetricCard
          title="Completadas"
          value={String(completadas)}
          accent="lime"
          icon={<CheckCircle2 />}
        />
        <MetricCard
          title="Pendientes / En camino"
          value={String(pendientes + enCamino)}
          accent="yellow"
          icon={<Clock />}
        />
        <MetricCard
          title="Emergencias activas"
          value={String(emergenciasActivas)}
          accent="danger"
          icon={<AlertTriangle />}
        />
      </div>

      <article className="rounded-eco-lg border border-eco-gray-200 bg-eco-white p-5 shadow-eco-md">
        <div className="mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-eco-teal" aria-hidden />
          <h2 className="font-display text-h3 text-eco-navy">kg CO₂ evitado por material (API)</h2>
        </div>
        {Object.keys(mat).length === 0 ? (
          <p className="font-sans text-body-sm text-eco-gray-500">Sin datos de la API. Levanta el backend o envía recolecciones completadas.</p>
        ) : (
          <ul className="space-y-eco-2" role="list">
            {Object.entries(mat).map(([k, v]) => (
              <li key={k} className="grid gap-2 sm:grid-cols-[1fr,6fr,auto] sm:items-center">
                <span className="font-sans text-body-sm text-eco-gray-800">{materialLabel(k)}</span>
                <div
                  className="h-3 w-full max-w-md rounded-full bg-eco-gray-100"
                  role="meter"
                  aria-label={`${materialLabel(k)} ${v.toFixed(1)} kilogramos de CO2`}
                  aria-valuemin={0}
                  aria-valuemax={maxCo2}
                  aria-valuenow={v}
                >
                  <div
                    className="h-3 min-w-0 rounded-full"
                    style={{
                      width: `${(v / maxCo2) * 100}%`,
                      background: `linear-gradient(90deg, ${c.primary}, ${c.secondary})`,
                    }}
                  />
                </div>
                <span className="font-mono text-metric-md text-eco-navy">{v.toFixed(2)} kg</span>
              </li>
            ))}
          </ul>
        )}
      </article>

      <article className="rounded-eco-lg border border-eco-gray-200 bg-eco-white p-5 shadow-eco-md">
        <div className="mb-4 flex items-center gap-2">
          <Leaf className="h-5 w-5 text-eco-lime" aria-hidden />
          <h2 className="font-display text-h3 text-eco-navy">Distribución por estado (API)</h2>
        </div>
        {total === 0 ? (
          <p className="font-sans text-body-sm text-eco-gray-500">Sin datos aún. El store arranca vacío.</p>
        ) : (
          <ul className="space-y-eco-3">
            {[
              { key: "pendiente", label: "Pendiente", count: pendientes, color: "#9CA3AF" },
              { key: "en_camino", label: "En camino", count: enCamino, color: "#00C9A7" },
              { key: "completado", label: "Completado", count: completadas, color: "#84CC16" },
            ].map(({ key, label, count, color }) => (
              <li key={key} className="grid gap-2 sm:grid-cols-[7rem,6fr,auto] sm:items-center">
                <span className="font-sans text-body-sm text-eco-gray-800">{label}</span>
                <div className="h-3 w-full rounded-full bg-eco-gray-100">
                  <div
                    className="h-3 rounded-full transition-all duration-500"
                    style={{ width: `${(count / estadoMaxWidth) * 100}%`, backgroundColor: color }}
                  />
                </div>
                <span className="font-mono text-metric-md text-eco-navy">{count}</span>
              </li>
            ))}
          </ul>
        )}
      </article>
    </div>
  );
}
