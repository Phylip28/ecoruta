import { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  BarChart3,
  ClipboardList,
  Flame,
  HardHat,
  LayoutDashboard,
  Leaf,
  MapPinned,
  OctagonAlert,
  Recycle,
  RefreshCcw,
  Settings,
  Weight,
} from "lucide-react";

import { HeatmapList } from "../components/HeatmapList";
import { MapaHeatmap } from "../components/MapaHeatmap";
import { MetricCard } from "../components/MetricCard";
import { getHealth, getHeatmap, getImpacto, type HeatmapPoint, type Impacto } from "../core/api";

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

export function DashboardPage() {
  const { navActive } = useOutletContext<AdminOutletContext>();
  const [status, setStatus] = useState("verificando");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [heatmap, setHeatmap] = useState<HeatmapPoint[]>([]);
  const [impacto, setImpacto] = useState<Impacto | null>(null);

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

  return (
    <div className="mx-auto max-w-admin space-y-6">
      <section className="flex flex-col gap-4 rounded-eco-lg border border-eco-gray-200 bg-eco-white p-5 shadow-eco-sm md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-sans text-label uppercase tracking-wide text-eco-teal">Panel operativo</p>
          <h1 className="mt-1 font-display text-h1 text-eco-navy">Monitoreo territorial</h1>
          <p className="mt-2 font-sans text-body text-eco-gray-700">Estado del sistema: {statusLabel}</p>
        </div>
        <button
          type="button"
          onClick={() => void refreshAll()}
          disabled={loading}
          className="inline-flex h-12 min-w-[140px] items-center justify-center gap-eco-3 rounded-eco-md bg-eco-teal px-5 font-sans text-label text-eco-white shadow-eco-md transition duration-eco-fast hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-[0.38]"
        >
          <RefreshCcw className={loading ? "h-4 w-4 animate-spin" : "h-4 w-4"} aria-hidden />
          Recargar datos
        </button>
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

      <div className="grid gap-eco-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Puntos activos (heatmap)"
          value={String(heatmap.length)}
          accent="danger"
          icon={<OctagonAlert />}
        />
        <MetricCard
          title="Kg desviados del relleno"
          value={impacto ? impacto.kg_desviados_total.toFixed(2) : "0.00"}
          unit="kg"
          accent="lime"
          icon={<Weight />}
        />
        <MetricCard
          title="CO₂ ahorrado"
          value={impacto ? impacto.co2_ahorrado_total_kg.toFixed(2) : "0.00"}
          unit="kg CO₂"
          accent="teal"
          icon={<Leaf />}
        />
        <MetricCard
          title="Estado backend"
          value={status === "ok" ? "OK" : status === "verificando" ? "…" : "OFF"}
          accent={status === "ok" ? "teal" : "yellow"}
          icon={<HardHat />}
        />
      </div>

      <article className="rounded-eco-lg border border-eco-gray-200 bg-eco-white p-5 shadow-eco-md">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-eco-3">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-eco-danger" aria-hidden />
            <h2 className="font-display text-h3 text-eco-navy">Mapa de calor geoespacial</h2>
          </div>
          <div className="flex flex-wrap gap-2 rounded-eco-md bg-eco-gray-50 px-eco-3 py-2 font-sans text-caption text-eco-gray-700">
            <span className="rounded-full bg-[rgba(0,92,83,0.15)] px-3 py-1 font-medium text-eco-teal">
              Tipo: todos
            </span>
            <span className="rounded-full bg-eco-gray-100 px-3 py-1 text-eco-gray-500">Filtros (MVP)</span>
          </div>
        </div>
        <MapaHeatmap points={heatmap} />
        <p className="mt-3 font-sans text-caption text-eco-gray-500">
          Leyenda: baja densidad (teal / lima) → media (amarillo) → alta (alerta). Tiles OpenStreetMap.
        </p>
      </article>

      <section className="grid gap-6 lg:grid-cols-12 lg:gap-6">
        <article className="rounded-eco-lg border border-eco-gray-200 bg-eco-white p-5 shadow-eco-md lg:col-span-7">
          <div className="mb-4 flex items-center gap-2">
            <MapPinned className="h-5 w-5 text-eco-teal" aria-hidden />
            <h2 className="font-display text-h3 text-eco-navy">Puntos activos</h2>
          </div>
          <HeatmapList points={heatmap} />
        </article>

        <article className="rounded-eco-lg border border-eco-gray-200 bg-eco-white p-5 shadow-eco-md lg:col-span-5">
          <div className="mb-4 flex items-center gap-2">
            <Leaf className="h-5 w-5 text-eco-lime" aria-hidden />
            <h2 className="font-display text-h3 text-eco-navy">Impacto por material</h2>
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
          </ul>
        </article>
      </section>
    </div>
  );
}
