import { HardHat, Leaf, OctagonAlert, Weight } from "lucide-react";

import { MetricCard } from "../../../components/MetricCard";
import { chartColors, tableEstadoBadges, tableTypeBadges } from "../../../design-system";
import { DsSection } from "./DsSection";

export function AdminWebBlock() {
  const barHeights = [40, 65, 50, 90, 35];

  return (
    <DsSection
      id="web-admin"
      title="9. Componentes — Web (Admin)"
      subtitle="Layout §9.1 · KPI §9.2 · Mapa §9.3 · Tabla §9.4 · Gráficas §9.5."
    >
      <h3 className="font-display text-h3 text-eco-navy">9.1 Layout del dashboard</h3>
      <pre className="mt-3 overflow-x-auto rounded-eco-md bg-eco-navy p-4 font-mono text-caption text-eco-sage">
{`┌──────────┬──────────────────────────────────────────┐
│ Sidebar  │  Header (64px)                           │
│ (260px)  │──────────────────────────────────────────│
│          │  KPI Cards (4 columnas)                 │
│  Nav     │──────────────────────────────────────────│
│          │  Mapa (8 cols)     │ Stats (4 cols)      │
│          │──────────────────────────────────────────│
│          │  Tabla reportes (12 cols)                 │
└──────────┴──────────────────────────────────────────┘`}
      </pre>
      <ul className="mt-3 list-inside list-disc font-sans text-body-sm text-eco-gray-700">
        <li>Sidebar: navy, ítem activo teal + borde izquierdo amarillo 3px, texto sage / hover blanco 6%.</li>
        <li>Header: blanco, 64px, sombra sm, breadcrumb + usuario.</li>
      </ul>

      <h3 className="mt-10 font-display text-h3 text-eco-navy">9.2 Tarjetas KPI (implementación actual)</h3>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Reportes activos" value="14" unit="reportes" change={2.4} accent="danger" icon={<OctagonAlert />} />
        <MetricCard title="Kg desviados del relleno" value="128.40" unit="kg" change={-1.2} accent="lime" icon={<Weight />} />
        <MetricCard title="CO₂ ahorrado" value="42.00" unit="kg CO₂" accent="teal" icon={<Leaf />} />
        <MetricCard title="Recicladores activos hoy" value="18" unit="personas" accent="teal" icon={<HardHat />} />
      </div>

      <h3 className="mt-10 font-display text-h3 text-eco-navy">9.3 Mapa — panel de filtros y leyenda</h3>
      <div className="relative mt-3 min-h-[200px] rounded-eco-lg bg-eco-gray-100 ring-1 ring-eco-gray-200">
        <div className="absolute right-3 top-3 max-w-sm rounded-eco-lg bg-eco-white p-3 shadow-eco-lg">
          <p className="font-sans text-label text-eco-gray-900">Filtros</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="rounded-full bg-[rgba(0,92,83,0.15)] px-3 py-1 font-sans text-caption font-medium text-eco-teal">
              Tipo: todos
            </span>
            <span className="rounded-full border border-eco-gray-300 px-3 py-1 font-sans text-caption text-eco-gray-600">
              Fecha
            </span>
            <span className="rounded-full border border-eco-gray-300 px-3 py-1 font-sans text-caption text-eco-gray-600">
              Estado
            </span>
          </div>
        </div>
        <div className="absolute bottom-3 left-3 rounded-eco-md bg-[rgba(255,255,255,0.9)] p-3 shadow-eco-md">
          <p className="font-sans text-caption text-eco-gray-700">Leyenda densidad</p>
          <div
            className="mt-2 h-3 w-40 rounded-full"
            style={{
              background: `linear-gradient(90deg, ${chartColors.primary} 0%, ${chartColors.secondary} 35%, ${chartColors.accent} 70%, ${chartColors.danger} 100%)`,
            }}
          />
          <div className="mt-1 flex justify-between font-sans text-caption text-eco-gray-600">
            <span>Baja</span>
            <span>Alta</span>
          </div>
        </div>
        <p className="absolute inset-0 flex items-center justify-center font-sans text-body-sm text-eco-gray-500">
          Área del mapa (Leaflet + OSM en la app)
        </p>
      </div>
      <p className="mt-2 font-sans text-caption text-eco-gray-500">
        Intensidad heatmap: alta (10+) danger→yellow; media (5–9) yellow→lime; baja (1–4) lime→teal.
      </p>

      <h3 className="mt-10 font-display text-h3 text-eco-navy">9.4 Tabla de reportes</h3>
      <p className="mb-3 font-sans text-body-sm text-eco-gray-600">
        Header gray-50 + label uppercase gray-500 · fila 56px hover gray-50 · bordes gray-200.
      </p>
      <div className="overflow-hidden rounded-eco-lg border border-eco-gray-200 bg-eco-white shadow-eco-sm">
        <div className="flex flex-wrap items-center gap-2 border-b border-eco-gray-200 bg-eco-gray-50 p-3">
          <input
            type="search"
            placeholder="Buscar…"
            className="h-10 w-60 max-w-full rounded-eco-sm border border-eco-gray-300 px-3 font-sans text-body-sm"
            readOnly
          />
          <span className="rounded-eco-sm border border-eco-gray-300 px-3 py-2 font-sans text-caption text-eco-gray-600">
            Tipo ▾
          </span>
        </div>
        <table className="w-full border-collapse font-sans text-body-sm">
          <thead>
            <tr className="bg-eco-gray-50">
              {["ID", "Tipo", "Dirección", "Barrio", "Estado", "Fecha", "Acciones"].map((h) => (
                <th
                  key={h}
                  className="border-b border-eco-gray-200 px-3 py-3 text-left font-sans text-label uppercase tracking-wide text-eco-gray-500"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="h-14 border-b border-eco-gray-200 hover:bg-eco-gray-50">
              <td className="px-3 font-mono text-code text-eco-gray-800">#R-2048</td>
              <td className="px-3">
                <span
                  className="rounded-full px-2 py-1 font-sans text-caption font-medium"
                  style={{
                    backgroundColor: tableTypeBadges.emergencia.bg,
                    color: tableTypeBadges.emergencia.text,
                  }}
                >
                  Emergencia
                </span>
              </td>
              <td className="px-3 text-eco-gray-800">Cra. 43 #12-90</td>
              <td className="px-3 text-eco-gray-600">Belén</td>
              <td className="px-3">
                <span
                  className="rounded-full px-2 py-1 font-sans text-caption font-medium"
                  style={{
                    backgroundColor: tableEstadoBadges.pendiente.bg,
                    color: tableEstadoBadges.pendiente.text,
                  }}
                >
                  Pendiente
                </span>
              </td>
              <td className="px-3 text-eco-gray-600">24 abr 2026</td>
              <td className="px-3 text-eco-teal">Ver</td>
            </tr>
            <tr className="h-14 border-b border-eco-gray-200 hover:bg-eco-gray-50">
              <td className="px-3 font-mono text-code">#S-8831</td>
              <td className="px-3">
                <span
                  className="rounded-full px-2 py-1 font-sans text-caption font-medium"
                  style={{
                    backgroundColor: tableTypeBadges.recoleccion.bg,
                    color: tableTypeBadges.recoleccion.text,
                  }}
                >
                  Recolección
                </span>
              </td>
              <td className="px-3">Calle 10 #34-21</td>
              <td className="px-3 text-eco-gray-600">Laureles</td>
              <td className="px-3">
                <span
                  className="rounded-full px-2 py-1 font-sans text-caption font-medium"
                  style={{
                    backgroundColor: tableEstadoBadges.en_camino.bg,
                    color: tableEstadoBadges.en_camino.text,
                  }}
                >
                  En camino
                </span>
              </td>
              <td className="px-3 text-eco-gray-600">24 abr 2026</td>
              <td className="px-3 text-eco-teal">Asignar</td>
            </tr>
          </tbody>
        </table>
        <div className="flex justify-end gap-2 border-t border-eco-gray-200 bg-eco-white p-3">
          <button type="button" className="rounded-eco-sm border border-eco-gray-300 px-3 py-1.5 font-sans text-caption text-eco-gray-700">
            Anterior
          </button>
          <button type="button" className="rounded-eco-sm border border-eco-gray-300 px-3 py-1.5 font-sans text-caption text-eco-gray-700">
            Siguiente
          </button>
        </div>
      </div>

      <h3 className="mt-10 font-display text-h3 text-eco-navy">9.5 Gráficas — paleta y ejemplos mínimos</h3>
      <p className="mb-3 font-sans text-body-sm text-eco-gray-600">
        Librería recomendada: Recharts. Aquí: barras (teal / barra crítica danger), línea teal 2px con punto activo amarillo, dona con gap 2px
        (conic-gradient).
      </p>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-eco-lg border border-eco-gray-200 bg-eco-white p-4 shadow-eco-sm">
          <p className="font-sans text-caption text-eco-gray-600">Barras por barrio</p>
          <div className="mt-4 flex h-36 items-end justify-between gap-2 border-b border-dotted border-eco-gray-200 px-1">
            {barHeights.map((h, i) => (
              <div
                key={i}
                className="w-full rounded-t-eco-md transition hover:opacity-90"
                style={{
                  height: `${h}%`,
                  backgroundColor: i === 3 ? chartColors.danger : chartColors.primary,
                }}
              />
            ))}
          </div>
          <div className="mt-2 flex justify-between font-sans text-caption text-eco-gray-500">
            <span>Z1</span>
            <span>Z2</span>
            <span>Z3</span>
            <span>Z4</span>
            <span>Z5</span>
          </div>
        </div>
        <div className="rounded-eco-lg border border-eco-gray-200 bg-eco-white p-4 shadow-eco-sm">
          <p className="font-sans text-caption text-eco-gray-600">Línea / área (teal 10%)</p>
          <svg viewBox="0 0 200 100" className="mt-2 h-36 w-full">
            <line x1="0" y1="80" x2="200" y2="80" stroke={chartColors.grid} strokeDasharray="4 4" />
            <polygon
              points="0,80 40,60 80,70 120,35 160,45 200,30 200,80 0,80"
              fill={chartColors.primary}
              opacity={0.1}
            />
            <polyline
              fill="none"
              stroke={chartColors.primary}
              strokeWidth="2"
              points="0,80 40,60 80,70 120,35 160,45 200,30"
            />
            <circle cx="120" cy="35" r="6" fill={chartColors.accent} stroke={chartColors.primary} strokeWidth="2" />
          </svg>
        </div>
        <div className="rounded-eco-lg border border-eco-gray-200 bg-eco-white p-4 shadow-eco-sm">
          <p className="font-sans text-caption text-eco-gray-600">Dona materiales</p>
          <div
            className="mx-auto mt-3 h-32 w-32 rounded-full"
            style={{
              background: `conic-gradient(
                ${chartColors.primary} 0deg 120deg,
                transparent 120deg 122deg,
                ${chartColors.secondary} 122deg 220deg,
                transparent 220deg 222deg,
                ${chartColors.accent} 222deg 300deg,
                transparent 300deg 302deg,
                ${chartColors.muted} 302deg 340deg,
                transparent 340deg 342deg,
                ${chartColors.danger} 342deg 360deg
              )`,
            }}
          />
          <ul className="mt-3 space-y-1 font-sans text-body-sm text-eco-gray-700">
            {[
              ["Teal", chartColors.primary],
              ["Lima", chartColors.secondary],
              ["Amarillo", chartColors.accent],
              ["Salvia", chartColors.muted],
              ["Danger", chartColors.danger],
            ].map(([label, hex]) => (
              <li key={label} className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: hex as string }} />
                {label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </DsSection>
  );
}
