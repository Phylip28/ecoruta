import { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  BarChart3,
  ClipboardList,
  Flame,
  HardHat,
  Info,
  LayoutDashboard,
  Leaf,
  MapPinned,
  OctagonAlert,
  Recycle,
  RefreshCcw,
  Settings,
} from "lucide-react";

import { DashboardOverview } from "../components/admin/DashboardOverview";
import { RecicladoresTable } from "../components/admin/RecicladoresTable";
import { ReportesTable } from "../components/admin/ReportesTable";
import { SettingsPanel } from "../components/admin/SettingsPanel";
import { SolicitudesTable } from "../components/admin/SolicitudesTable";
import { StatsPanel } from "../components/admin/StatsPanel";
import { HeatmapList } from "../components/HeatmapList";
import { MapaHeatmap } from "../components/MapaHeatmap";
import { getHealth, getHeatmap, getImpacto, type HeatmapPoint, type Impacto } from "../core/api";
import {
  recicladoresDemo,
  reportesDemo,
  solicitudesDemo,
} from "../data/adminDemoData";

export type DashboardNavId =
  | "dashboard"
  | "heatmap"
  | "reports"
  | "requests"
  | "recyclers"
  | "stats"
  | "settings";

export type AdminOutletContext = {
  navActive: DashboardNavId;
  setNavActive: (id: DashboardNavId) => void;
};

export const navItems: { id: DashboardNavId; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "heatmap", label: "Mapa de Calor", icon: Flame },
  { id: "reports", label: "Reportes", icon: ClipboardList },
  { id: "requests", label: "Solicitudes", icon: Recycle },
  { id: "recyclers", label: "Recicladores", icon: HardHat },
  { id: "stats", label: "Estadísticas", icon: BarChart3 },
  { id: "settings", label: "Configuración", icon: Settings },
];

function DemoNotice() {
  return (
    <div className="flex items-start gap-eco-2 rounded-eco-md border border-eco-teal/20 bg-[rgba(0,92,83,0.06)] px-eco-3 py-eco-2 font-sans text-body-sm text-eco-gray-700">
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-eco-teal" aria-hidden />
      <p>
        Filas con datos de <span className="font-medium">demostración</span> para el panel (sin persistencia en backend). Los KPI del resumen
        y el mapa usan la API cuando está disponible.
      </p>
    </div>
  );
}

export function DashboardPage() {
  const { navActive } = useOutletContext<AdminOutletContext>();
  const [status, setStatus] = useState("verificando");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [heatmap, setHeatmap] = useState<HeatmapPoint[]>([]);
  const [impacto, setImpacto] = useState<Impacto | null>(null);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);

  async function refreshAll() {
    setLoading(true);
    setError(null);

    try {
      const [healthData, heatmapData, impactoData] = await Promise.all([
        getHealth(),
        getHeatmap(),
        getImpacto(),
      ]);

      setStatus(healthData.status);
      setHeatmap(heatmapData);
      setImpacto(impactoData);
      setLastSynced(new Date());
    } catch (err) {
      setStatus("sin conexion");
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refreshAll();
  }, []);

  const statusLabel = useMemo(() => {
    if (status === "ok") return "Backend activo";
    if (status === "verificando") return "Verificando";
    return "Backend no disponible";
  }, [status]);

  const breadcrumb = useMemo(() => {
    const current = navItems.find((n) => n.id === navActive);
    return current?.label ?? "Dashboard";
  }, [navActive]);

  const showRefresh =
    navActive === "dashboard" || navActive === "heatmap" || navActive === "stats";

  const lastSyncedLabel = useMemo(() => {
    if (!lastSynced) return "Aún no sincronizado";
    return lastSynced.toLocaleString("es-CO", { dateStyle: "short", timeStyle: "short" });
  }, [lastSynced]);

  return (
    <div className="mx-auto max-w-admin space-y-6">
      <section className="flex flex-col gap-4 rounded-eco-xl border border-eco-gray-200 bg-eco-white p-6 shadow-eco-sm md:flex-row md:items-start md:justify-between">
        <div>
          <p className="font-sans text-label uppercase tracking-wide text-eco-teal">Panel operativo</p>
          <h1 className="mt-1 font-display text-h1 text-eco-navy">
            {navActive === "dashboard" ? "Vista general" : "Monitoreo territorial"}
          </h1>
          <p className="mt-2 max-w-2xl font-sans text-body text-eco-gray-700">
            {navActive === "dashboard" ? (
              <>
                Resumen de mapa, tablas y análisis. Servicio: {statusLabel}.{" "}
                {lastSynced ? `Última carga: ${lastSyncedLabel}.` : "Usá «Recargar datos» para sincronizar."}
              </>
            ) : (
              <>
                Sección: {navItems.find((n) => n.id === navActive)?.label}. Servicio: {statusLabel}.{" "}
                {lastSynced ? `Última carga: ${lastSyncedLabel}.` : "—"}
              </>
            )}
          </p>
        </div>
        {showRefresh ? (
          <button
            type="button"
            onClick={() => void refreshAll()}
            disabled={loading}
            className="inline-flex h-12 min-w-[140px] items-center justify-center gap-eco-3 rounded-eco-md bg-eco-teal px-5 font-sans text-label text-eco-white shadow-eco-md transition duration-eco-fast hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-[0.38]"
          >
            <RefreshCcw className={loading ? "h-4 w-4 animate-spin" : "h-4 w-4"} aria-hidden />
            Recargar datos
          </button>
        ) : null}
      </section>

      <p className="sr-only" aria-live="polite">
        Sección activa: {breadcrumb}
      </p>

      {error ? (
        <div
          className="flex items-start gap-eco-3 rounded-eco-lg border border-eco-danger/30 p-4 font-sans text-body-sm text-eco-danger"
          style={{ backgroundColor: "rgba(217, 79, 61, 0.08)" }}
          role="alert"
        >
          <OctagonAlert className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
          <p>{error}</p>
        </div>
      ) : null}

      {navActive === "dashboard" ? (
        <DashboardOverview
          heatmap={heatmap}
          impacto={impacto}
          backendOk={status === "ok"}
          backendStatusText={statusLabel}
        />
      ) : null}

      {navActive === "heatmap" ? (
        <>
          <article className="rounded-eco-lg border border-eco-gray-200 bg-eco-white p-5 shadow-eco-md">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-eco-3">
              <div className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-eco-danger" aria-hidden />
                <h2 className="font-display text-h3 text-eco-navy">Mapa de calor geoespacial</h2>
              </div>
              <div className="flex flex-wrap gap-2 rounded-eco-md bg-eco-gray-50 px-eco-3 py-2 font-sans text-caption text-eco-gray-700">
                <span className="rounded-full bg-[rgba(0,92,83,0.15)] px-3 py-1 font-medium text-eco-teal">Tipo: todos</span>
                <span className="rounded-full bg-eco-gray-100 px-3 py-1 text-eco-gray-500">Filtros (MVP)</span>
              </div>
            </div>
            <MapaHeatmap points={heatmap} />
            <p className="mt-3 font-sans text-caption text-eco-gray-500">
              Leyenda: densidad baja (verde) → media (amarillo) → alta (alerta). Mapa base OpenStreetMap.
            </p>
          </article>

          <section className="grid gap-6 lg:grid-cols-12 lg:gap-6">
            <article className="rounded-eco-lg border border-eco-gray-200 bg-eco-white p-5 shadow-eco-md lg:col-span-7">
              <div className="mb-4 flex items-center gap-2">
                <MapPinned className="h-5 w-5 text-eco-teal" aria-hidden />
                <h2 className="font-display text-h3 text-eco-navy">Puntos activos (API)</h2>
              </div>
              <HeatmapList points={heatmap} />
            </article>

            <article className="rounded-eco-lg border border-eco-gray-200 bg-eco-white p-5 shadow-eco-md lg:col-span-5">
              <div className="mb-4 flex items-center gap-2">
                <Leaf className="h-5 w-5 text-eco-lime" aria-hidden />
                <h2 className="font-display text-h3 text-eco-navy">Impacto por material (API)</h2>
              </div>
              <ul className="space-y-eco-2 font-sans text-body-sm text-eco-gray-700">
                {Object.entries(impacto?.por_material ?? {}).map(([material, value]) => (
                  <li
                    key={material}
                    className="flex items-center justify-between rounded-eco-md bg-eco-gray-50 px-eco-3 py-2"
                  >
                    <span className="capitalize">{material}</span>
                    <span className="font-mono text-metric-md text-eco-navy">{value.toFixed(2)} kg CO₂</span>
                  </li>
                ))}
                {Object.keys(impacto?.por_material ?? {}).length === 0 ? (
                  <li className="text-eco-gray-500">Sin datos de impacto aún o backend no conectado.</li>
                ) : null}
              </ul>
            </article>
          </section>
        </>
      ) : null}

      {navActive === "reports" ? (
        <div className="space-y-4">
          <DemoNotice />
          <h2 className="font-display text-h3 text-eco-navy">Reportes (demostración)</h2>
          <ReportesTable rows={reportesDemo} />
        </div>
      ) : null}

      {navActive === "requests" ? (
        <div className="space-y-4">
          <DemoNotice />
          <h2 className="font-display text-h3 text-eco-navy">Solicitudes de recolección (demostración)</h2>
          <SolicitudesTable rows={solicitudesDemo} />
        </div>
      ) : null}

      {navActive === "recyclers" ? (
        <div className="space-y-4">
          <DemoNotice />
          <h2 className="font-display text-h3 text-eco-navy">Recicladores (demostración)</h2>
          <RecicladoresTable rows={recicladoresDemo} />
        </div>
      ) : null}

      {navActive === "stats" ? (
        <div className="space-y-4">
          <p className="max-w-3xl font-sans text-body-sm text-eco-gray-600">
            Gráficos de barras (material) y serie de seguimiento; las tres tarjetas superiores son de referencia. El bloque inferior toma
            el impacto por material del servicio cuando hay datos.
          </p>
          <StatsPanel impacto={impacto} />
        </div>
      ) : null}

      {navActive === "settings" ? <SettingsPanel /> : null}
    </div>
  );
}
