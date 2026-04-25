import { chartColors } from "../../design-system";
import { kpiFicticios, seriePuntosCriticos } from "../../data/adminDemoData";
import type { Impacto } from "../../core/api";
import { MetricCard } from "../MetricCard";
import { BarChart3, Flag, UserCheck, TrendingUp } from "lucide-react";

type StatsPanelProps = {
  impacto: Impacto | null;
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

export function StatsPanel({ impacto }: StatsPanelProps) {
  const mat = impacto?.por_material ?? {};
  const maxCo2 = Math.max(1, ...Object.values(mat));

  const series = [...seriePuntosCriticos];
  const maxSerie = Math.max(1, ...series.map((p) => p.valor));
  const w = 400;
  const h = 160;
  const pad = 28;
  const n = series.length;
  const denom = n > 1 ? n - 1 : 1;
  const plotPts = series.map((p, i) => {
    const x = pad + (i * (w - 2 * pad)) / denom;
    const y = h - pad - (p.valor * (h - 2 * pad)) / maxSerie;
    return { x, y, label: p.semana };
  });
  const lineD = plotPts
    .map((pt, i) => `${i === 0 ? "M" : "L"} ${pt.x} ${pt.y}`)
    .join(" ");
  const firstP = plotPts[0] ?? { x: pad, y: h - pad, label: "" };
  const lastP = plotPts[plotPts.length - 1] ?? firstP;

  return (
    <div className="space-y-6">
      <div className="grid gap-eco-4 sm:grid-cols-3">
        <MetricCard
          title="Recicladores activos (referencia)"
          value={String(kpiFicticios.recicladoresActivos)}
          accent="teal"
          icon={<UserCheck />}
        />
        <MetricCard
          title="Tasa de atención (referencia)"
          value={kpiFicticios.tasaAtencionPct.toFixed(1)}
          unit="%"
          accent="lime"
          icon={<Flag />}
        />
        <MetricCard
          title="Reportes nuevos / semana (referencia)"
          value={String(kpiFicticios.reportesNuevosSemana)}
          accent="yellow"
          icon={<TrendingUp />}
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
        <h2 className="font-display text-h3 text-eco-navy">Reducción de puntos críticos (serie ficticia)</h2>
        <p className="mt-1 max-w-2xl font-sans text-caption text-eco-gray-500">
          Evolución semanal de referencia; pendiente de conectar a series históricas del servicio.
        </p>
        <div className="mt-4 overflow-x-auto">
          <svg
            viewBox={`0 0 ${w} ${h}`}
            className="w-full max-w-xl"
            role="img"
            aria-label="Gráfico de línea: reducción aproximada de puntos críticos por semana"
          >
            <line x1={pad} y1={h - pad} x2={w - pad} y2={h - pad} stroke={c.grid} strokeWidth="1" />
            <path d={lineD} fill="none" stroke={c.primary} strokeWidth="2.5" strokeLinejoin="round" />
            {plotPts.map((pt, i) => (
              <circle key={series[i]?.semana ?? i} cx={pt.x} cy={pt.y} r="4" fill={c.accent} stroke={c.primary} strokeWidth="1" />
            ))}
            <text x={firstP.x - 2} y={h - 8} className="fill-[#6B7280] text-[9px] font-sans" textAnchor="middle">
              {firstP.label}
            </text>
            <text x={lastP.x} y={h - 8} className="fill-[#6B7280] text-[9px] font-sans" textAnchor="middle">
              {lastP.label}
            </text>
            <text x="8" y="24" className="fill-[#6B7280] text-[10px] font-sans" style={{ fontFamily: "system-ui" }}>
              Menos = mejor
            </text>
          </svg>
        </div>
        <ul className="mt-2 flex flex-wrap gap-3 font-sans text-caption text-eco-gray-600">
          {series.map((p) => (
            <li key={p.semana}>
              <span className="font-mono text-eco-navy">{p.semana}</span>: {p.valor} pts.
            </li>
          ))}
        </ul>
      </article>
    </div>
  );
}
