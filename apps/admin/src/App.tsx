import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Leaf, MapPinned, RefreshCcw } from "lucide-react";

import { HeatmapList } from "./components/HeatmapList";
import { MetricCard } from "./components/MetricCard";
import { getHealth, getHeatmap, getImpacto, type HeatmapPoint, type Impacto } from "./core/api";

export default function App() {
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

  return (
    <main className="min-h-screen bg-gradient-to-br from-eco-mist via-white to-emerald-50 text-slate-800">
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-6 flex flex-col gap-3 rounded-2xl bg-white p-5 shadow-soft ring-1 ring-slate-200 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-eco-fern">EcoRuta Admin</p>
            <h1 className="mt-1 text-3xl font-bold text-slate-900">Panel de monitoreo territorial</h1>
            <p className="mt-2 text-sm text-slate-600">Estado de sistema: {statusLabel}</p>
          </div>
          <button
            type="button"
            onClick={() => void refreshAll()}
            disabled={loading}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-eco-moss px-4 text-sm font-semibold text-white transition hover:bg-eco-fern disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCcw className={loading ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
            Recargar
          </button>
        </header>

        {error ? (
          <div className="mb-5 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-800">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            label="Puntos activos"
            value={String(heatmap.length)}
            tone={status === "ok" ? "normal" : "warning"}
          />
          <MetricCard
            label="KG desviados"
            value={impacto ? impacto.kg_desviados_total.toFixed(2) : "0.00"}
          />
          <MetricCard
            label="CO2 ahorrado (kg)"
            value={impacto ? impacto.co2_ahorrado_total_kg.toFixed(2) : "0.00"}
          />
          <MetricCard
            label="Estado backend"
            value={statusLabel}
            tone={status === "ok" ? "normal" : "danger"}
          />
        </div>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <article className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-slate-200">
            <div className="mb-4 flex items-center gap-2">
              <MapPinned className="h-5 w-5 text-eco-fern" />
              <h2 className="text-lg font-semibold">Heatmap (base de datos de puntos)</h2>
            </div>
            <HeatmapList points={heatmap} />
          </article>

          <article className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-slate-200">
            <div className="mb-4 flex items-center gap-2">
              <Leaf className="h-5 w-5 text-eco-moss" />
              <h2 className="text-lg font-semibold">Impacto por material</h2>
            </div>
            <ul className="space-y-2 text-sm text-slate-700">
              {Object.entries(impacto?.por_material ?? {}).map(([material, value]) => (
                <li
                  key={material}
                  className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2"
                >
                  <span className="capitalize">{material}</span>
                  <span className="font-semibold">{value.toFixed(2)} kg CO2</span>
                </li>
              ))}
            </ul>
          </article>
        </section>
      </section>
    </main>
  );
}
