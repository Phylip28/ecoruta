import { useOutletContext } from "react-router-dom";
import {
  BarChart3,
  ClipboardList,
  Flame,
  HardHat,
  Leaf,
  Recycle,
  OctagonAlert,
  Radio,
  Weight,
} from "lucide-react";

import type { AdminOutletContext, DashboardNavId } from "../../pages/DashboardPage";
import type { HeatmapPoint, Impacto } from "../../core/api";
import { MetricCard } from "../MetricCard";
import {
  recicladoresDemo,
  reportesDemo,
  solicitudesDemo,
} from "../../data/adminDemoData";
import { tableEstadoBadges, tableTypeBadges } from "../../design-system";
import { CardGridSkeleton, MetricRowSkeleton, SkeletonBlock } from "../ui/Skeleton";

type DashboardOverviewProps = {
  heatmap: HeatmapPoint[];
  impacto: Impacto | null;
  backendOk: boolean;
  backendStatusText: string;
  /** Carga inicial de datos (API aún no respondió) */
  showDataSkeleton: boolean;
};

function QuickCard({
  title,
  description,
  stat,
  statLabel,
  navId,
  icon: Icon,
  accent,
}: {
  title: string;
  description: string;
  stat: string;
  statLabel: string;
  navId: DashboardNavId;
  icon: typeof Flame;
  accent: "teal" | "navy" | "warning";
}) {
  const { setNavActive } = useOutletContext<AdminOutletContext>();
  const accentRing =
    accent === "teal"
      ? "ring-eco-teal/20 hover:border-eco-teal/40"
      : accent === "warning"
        ? "ring-eco-yellow/15 hover:border-eco-yellow/50"
        : "ring-eco-navy/10 hover:border-eco-navy/25";

  return (
    <div
      className={`flex flex-col justify-between rounded-eco-lg border border-eco-gray-200 bg-eco-white p-5 shadow-eco-sm transition duration-eco-normal hover:shadow-eco-md ${accentRing} ring-1`}
    >
      <div>
        <div className="mb-3 flex items-center gap-2">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-eco-md ${
              accent === "teal" ? "bg-[rgba(0,92,83,0.1)] text-eco-teal" : ""
            } ${accent === "navy" ? "bg-[rgba(4,41,64,0.08)] text-eco-navy" : ""} ${
              accent === "warning" ? "bg-[rgba(219,242,39,0.15)] text-[#5c6b00]" : ""
            }`}
          >
            <Icon className="h-5 w-5" aria-hidden />
          </div>
          <h3 className="font-display text-h4 text-eco-navy">{title}</h3>
        </div>
        <p className="font-sans text-body-sm leading-relaxed text-eco-gray-600">{description}</p>
        <p className="mt-3 font-mono text-metric-lg text-eco-teal">
          {stat}
          <span className="ml-1.5 font-sans text-caption font-normal text-eco-gray-500">{statLabel}</span>
        </p>
      </div>
      <button
        type="button"
        onClick={() => {
          setNavActive(navId);
        }}
        className="mt-4 w-full rounded-eco-md border border-eco-gray-200 py-2.5 font-sans text-label text-eco-teal transition hover:bg-eco-gray-50"
      >
        Abrir sección
      </button>
    </div>
  );
}

function ActivityRow({ label, value, tone }: { label: string; value: string; tone: "neutral" | "alert" | "ok" }) {
  const badge =
    tone === "alert" ? (
      <span
        className="shrink-0 rounded-eco-sm px-2 py-0.5 font-mono text-caption"
        style={{ backgroundColor: tableTypeBadges.emergencia.bg, color: tableTypeBadges.emergencia.text }}
      >
        {value}
      </span>
    ) : tone === "ok" ? (
      <span
        className="shrink-0 rounded-eco-sm px-2 py-0.5 font-mono text-caption"
        style={{ backgroundColor: tableEstadoBadges.completado.bg, color: tableEstadoBadges.completado.text }}
      >
        {value}
      </span>
    ) : (
      <span className="shrink-0 text-right font-mono text-caption text-eco-gray-600">{value}</span>
    );
  return (
    <div className="flex items-center justify-between gap-3 border-b border-eco-gray-100 py-2.5 last:border-0">
      <span className="min-w-0 font-sans text-body-sm text-eco-gray-800">{label}</span>
      {badge}
    </div>
  );
}

export function DashboardOverview({
  heatmap,
  impacto,
  backendOk,
  backendStatusText,
  showDataSkeleton,
}: DashboardOverviewProps) {
  const abiertasReporte = reportesDemo.filter(
    (r) => r.estado === "pendiente" || r.estado === "en_camino",
  ).length;
  const solicitudesPend = solicitudesDemo.filter((s) => s.estado === "pendiente").length;
  const solEnCurso = solicitudesDemo.filter((s) => s.estado === "en_camino").length;
  const colaSolicitudes = solicitudesPend + solEnCurso;
  const recActivos = recicladoresDemo.filter((r) => r.activas > 0).length;
  const recentReportes = [...reportesDemo]
    .sort((a, b) => b.creado.localeCompare(a.creado))
    .slice(0, 3);
  const topHeat = heatmap.length ? [...heatmap].sort((a, b) => b.peso - a.peso).slice(0, 3) : [];

  if (showDataSkeleton) {
    return (
      <div className="space-y-eco-6" aria-busy="true" aria-label="Cargando resumen del panel">
        <div className="space-y-3 rounded-eco-lg border border-eco-gray-100 p-4">
          <SkeletonBlock className="h-4 w-1/2 max-w-xs" />
          <SkeletonBlock className="h-3 w-full" />
        </div>
        <div>
          <div className="h-5 w-40 max-w-full rounded bg-eco-gray-200" />
          <p className="mb-2 mt-2 h-3 w-2/3 rounded bg-eco-gray-100" />
          <MetricRowSkeleton />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="h-64 rounded-eco-xl border border-eco-gray-100 p-4">
            <SkeletonBlock className="h-5 w-1/2" />
            <SkeletonBlock className="mt-3 h-3 w-full" />
            <SkeletonBlock className="mt-2 h-3 w-4/5" />
            <SkeletonBlock className="mt-4 h-10 w-full" />
            <SkeletonBlock className="mt-2 h-10 w-full" />
          </div>
          <div className="h-64 rounded-eco-xl border border-eco-gray-100 p-4">
            <SkeletonBlock className="h-5 w-1/2" />
            <SkeletonBlock className="mt-6 h-8 w-full" />
            <SkeletonBlock className="mt-2 h-8 w-full" />
            <SkeletonBlock className="mt-2 h-8 w-full" />
          </div>
        </div>
        <div>
          <div className="h-5 w-40 rounded bg-eco-gray-200" />
          <CardGridSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-eco-6">
      <div
        className="flex flex-wrap items-center justify-between gap-3 rounded-eco-lg border border-eco-gray-200 bg-eco-white px-4 py-3 font-sans text-body-sm text-eco-gray-700"
        role="status"
      >
        <span className="inline-flex items-center gap-2">
          <span
            className={`inline-block h-2.5 w-2.5 rounded-full ${backendOk ? "bg-eco-lime" : "bg-eco-warning"}`}
            aria-hidden
          />
          {backendStatusText}
        </span>
        <span className="text-caption text-eco-gray-500">
          Cada módulo amplía con tablas, mapa o gráficos según corresponda.
        </span>
      </div>

      <div>
        <h3 className="font-display text-h3 text-eco-navy">Indicadores clave</h3>
        <p className="mt-1 max-w-2xl font-sans text-body-sm text-eco-gray-600">
          Cifras del servicio cuando responde la API; en caso de desconexión, los contadores vuelven a cero o quedan vacíos.
        </p>
        <div className="mt-4 grid gap-eco-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            title="Puntos en el mapa de calor"
            value={String(heatmap.length)}
            accent="danger"
            icon={<OctagonAlert />}
          />
          <MetricCard
            title="Masa desviada (relleno evitado)"
            value={impacto ? impacto.kg_desviados_total.toFixed(2) : "0.00"}
            unit="kg"
            accent="lime"
            icon={<Weight />}
          />
          <MetricCard
            title="CO₂ equivalente ahorrado"
            value={impacto ? impacto.co2_ahorrado_total_kg.toFixed(2) : "0.00"}
            unit="kg CO₂"
            accent="teal"
            icon={<Leaf />}
          />
          <MetricCard
            title="Sistema (API)"
            value={backendOk ? "Conectado" : "Sin conexión"}
            accent={backendOk ? "teal" : "yellow"}
            icon={<Radio />}
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-eco-xl border border-eco-gray-200 bg-eco-white p-5 shadow-eco-sm">
          <h3 className="font-display text-h3 text-eco-navy">Actividad de ejemplo (reportes)</h3>
          <p className="mt-1 font-sans text-caption text-eco-gray-500">
            Registros simulados — mismos criterios que en Reportes: tipo, territorio, estado.
          </p>
          <div className="mt-4">
            {recentReportes.map((r) => (
              <ActivityRow
                key={r.id}
                label={`${r.id} · ${r.comuna.split("—")[0]?.trim() ?? r.comuna}`}
                value={r.tipo === "emergencia" ? "Emergencia" : "Solicitud"}
                tone={r.tipo === "emergencia" ? "alert" : "neutral"}
              />
            ))}
          </div>
          <p className="mt-2 font-sans text-caption text-eco-gray-500">
            {abiertasReporte} casos aún con seguimiento / sin cerrar (demo).
          </p>
        </div>

        <div className="rounded-eco-xl border border-eco-gray-200 bg-eco-white p-5 shadow-eco-sm">
          <h3 className="font-display text-h3 text-eco-navy">Intensidad de puntos (mapa)</h3>
          <p className="mt-1 font-sans text-caption text-eco-gray-500">Los tres pesos más altos de la carga actual.</p>
          {topHeat.length > 0 ? (
            <ul className="mt-4 space-y-2">
              {topHeat.map((p, i) => (
                <li
                  key={`${p.latitud}-${p.longitud}-${i}`}
                  className="flex items-center justify-between rounded-eco-md border border-eco-gray-100 bg-eco-gray-50 px-3 py-2 font-sans text-body-sm"
                >
                  <span className="text-eco-gray-700">Punto {i + 1}</span>
                  <span className="font-mono text-metric-md text-eco-navy">peso {p.peso}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-6 font-sans text-body-sm text-eco-gray-500">Sin coordenadas en el mapa todavía.</p>
          )}
        </div>
      </div>

      <div>
        <h3 className="font-display text-h3 text-eco-navy">Módulos del panel</h3>
        <p className="mt-1 max-w-3xl font-sans text-body-sm text-eco-gray-600">
          Cada bloque conecta con lo que verás al cambiar de sección: el mapa aporta el gradiente; las demás, listas y
          gráficos con datos reales o de apoyo.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <QuickCard
            title="Mapa de calor"
            description="Densidad de reportes sobre el mapa, listado de coordenadas e intensidad."
            stat={String(heatmap.length)}
            statLabel="puntos con peso (API)"
            navId="heatmap"
            icon={Flame}
            accent="warning"
          />
          <QuickCard
            title="Reportes"
            description="Tabla de avisos por comuna, tipo (emergencia o solicitud) y estado de gestión."
            stat={String(reportesDemo.length)}
            statLabel={`${abiertasReporte} abiertos (demo)`}
            navId="reports"
            icon={ClipboardList}
            accent="navy"
          />
          <QuickCard
            title="Solicitudes de recolección"
            description="Cola por material, kilos estimados y asignación a reciclador."
            stat={String(colaSolicitudes)}
            statLabel={`de ${solicitudesDemo.length} en cola/curso (demo)`}
            navId="requests"
            icon={Recycle}
            accent="teal"
          />
          <QuickCard
            title="Recicladores"
            description="Equipo de campo, zonas cubiertas y carga de rutas (ejemplos de operación)."
            stat={String(recActivos)}
            statLabel="con solicitudes en curso (demo)"
            navId="recyclers"
            icon={HardHat}
            accent="navy"
          />
          <QuickCard
            title="Estadísticas e impacto"
            description="KPI y gráficos: CO₂ evitado por material y evolución resumida."
            stat={impacto ? String(Object.keys(impacto.por_material).length) : "0"}
            statLabel="categorías con dato (API)"
            navId="stats"
            icon={BarChart3}
            accent="teal"
          />
        </div>
      </div>
    </div>
  );
}
