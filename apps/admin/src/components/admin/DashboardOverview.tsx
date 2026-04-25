import { useState } from "react";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Leaf,
  Weight,
  MapPin,
  Shuffle,
  Route,
  Loader2,
} from "lucide-react";

import type { HeatmapPoint, Impacto, Reporte, RutaResponse } from "../../core/api";
import { createSolicitud, createReporte, getRuta } from "../../core/api";
import { MetricCard } from "../MetricCard";
import { tableEstadoBadges, tableTypeBadges } from "../../design-system";
import { CardGridSkeleton, MetricRowSkeleton, SkeletonBlock } from "../ui/Skeleton";

type DashboardOverviewProps = {
  heatmap: HeatmapPoint[];
  impacto: Impacto | null;
  reportes: Reporte[];
  backendOk: boolean;
  showDataSkeleton: boolean;
  onRefresh: () => Promise<void>;
};

const MDE = { lat: [6.18, 6.34], lon: [-75.64, -75.53] } as const;
const MATERIALS = ["carton", "vidrio", "plastico", "mixto"] as const;
const DESCS = [
  "Bolsas empacadas en el portal",
  "Material seco en punto limpio comunitario",
  "Cartón aplanado, carga liviana",
  "Plástico PET separado",
  "Vidrio de botellería, sin romper",
  "Mixto empaquetado — patio compartido",
  null,
] as const;

function randBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

function randPick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

function formatKm(km: number) {
  return km < 1 ? `${(km * 1000).toFixed(0)} m` : `${km.toFixed(2)} km`;
}

function formatMin(min: number | null) {
  if (min === null) return "—";
  if (min < 60) return `${Math.round(min)} min`;
  return `${Math.floor(min / 60)} h ${Math.round(min % 60)} min`;
}

function TipoBadge({ tipo }: { tipo: Reporte["tipo"] }) {
  const key = tipo === "emergencia" ? "emergencia" : "recoleccion";
  const s = tableTypeBadges[key];
  return (
    <span
      className="inline-block rounded-eco-sm px-2 py-0.5 font-sans text-caption font-semibold"
      style={{ backgroundColor: s.bg, color: s.text }}
    >
      {tipo === "emergencia" ? "Emergencia" : "Solicitud"}
    </span>
  );
}

function EstadoBadge({ estado }: { estado: Reporte["estado"] }) {
  const s = tableEstadoBadges[estado];
  const label =
    estado === "pendiente" ? "Pendiente" : estado === "en_camino" ? "En camino" : "Completado";
  return (
    <span
      className="inline-block rounded-eco-sm px-2 py-0.5 font-sans text-caption font-semibold"
      style={{ backgroundColor: s.bg, color: s.text }}
    >
      {label}
    </span>
  );
}

export function DashboardOverview({
  heatmap,
  impacto,
  reportes,
  backendOk,
  showDataSkeleton,
  onRefresh,
}: DashboardOverviewProps) {
  const [generando, setGenerando] = useState(false);
  const [rutaResult, setRutaResult] = useState<RutaResponse | null>(null);
  const [rutaError, setRutaError] = useState<string | null>(null);
  const [genLog, setGenLog] = useState<string | null>(null);

  const total = reportes.length;
  const completadas = reportes.filter((r) => r.estado === "completado").length;
  const pendientes = reportes.filter((r) => r.estado === "pendiente").length;
  const enCamino = reportes.filter((r) => r.estado === "en_camino").length;
  const emergenciasActivas = reportes.filter(
    (r) => r.tipo === "emergencia" && r.estado !== "completado",
  ).length;
  const kgTotal = reportes.reduce((s, r) => s + r.kg_estimados, 0);

  const recentReportes = [...reportes]
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .slice(0, 5);

  const topHeat = [...heatmap].sort((a, b) => b.peso - a.peso).slice(0, 3);

  async function generarYCalcularRuta(count: number) {
    setGenerando(true);
    setRutaResult(null);
    setRutaError(null);
    setGenLog(null);

    try {
      const recLat = 6.2518;
      const recLon = -75.5636;

      const promises: Promise<Reporte>[] = [];
      for (let i = 0; i < count; i++) {
        const lat = randBetween(MDE.lat[0], MDE.lat[1]);
        const lon = randBetween(MDE.lon[0], MDE.lon[1]);
        const isSolicitud = Math.random() > 0.25;
        if (isSolicitud) {
          promises.push(
            createSolicitud({
              latitud: lat,
              longitud: lon,
              material: randPick(MATERIALS),
              ciudadano_telegram_id: Math.floor(randBetween(100_000, 999_999)),
              kg_estimados: parseFloat(randBetween(1, 20).toFixed(1)),
              descripcion: randPick(DESCS) ?? undefined,
            }),
          );
        } else {
          promises.push(
            createReporte({
              tipo: "emergencia",
              latitud: lat,
              longitud: lon,
              descripcion: randPick(DESCS) ?? undefined,
            }),
          );
        }
      }

      await Promise.all(promises);
      setGenLog(`${count} puntos creados`);

      await onRefresh();

      const ruta = await getRuta(1, recLat, recLon);
      setRutaResult(ruta);
    } catch (e) {
      setRutaError(e instanceof Error ? e.message : "Error generando datos");
    } finally {
      setGenerando(false);
    }
  }

  if (showDataSkeleton) {
    return (
      <div className="space-y-eco-6" aria-busy="true" aria-label="Cargando resumen del panel">
        <MetricRowSkeleton />
        <div className="grid gap-6 md:grid-cols-2">
          <div className="h-64 rounded-eco-xl border border-eco-gray-100 p-4">
            <SkeletonBlock className="h-5 w-1/2" />
            <SkeletonBlock className="mt-3 h-3 w-full" />
            <SkeletonBlock className="mt-4 h-10 w-full" />
            <SkeletonBlock className="mt-2 h-10 w-full" />
          </div>
          <div className="h-64 rounded-eco-xl border border-eco-gray-100 p-4">
            <SkeletonBlock className="h-5 w-1/2" />
            <SkeletonBlock className="mt-6 h-8 w-full" />
            <SkeletonBlock className="mt-2 h-8 w-full" />
          </div>
        </div>
        <CardGridSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-eco-6">
      {/* KPI strip */}
      <div className="grid gap-eco-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Total en store" value={String(total)} accent="teal" icon={<MapPin />} />
        <MetricCard title="Completadas" value={String(completadas)} accent="lime" icon={<CheckCircle2 />} />
        <MetricCard title="Pendientes / En camino" value={String(pendientes + enCamino)} accent="yellow" icon={<Clock />} />
        <MetricCard title="Emergencias activas" value={String(emergenciasActivas)} accent="danger" icon={<AlertTriangle />} />
      </div>

      {/* Impacto ambiental */}
      <div className="grid gap-eco-4 sm:grid-cols-2">
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
      </div>

      {/* Seed + Route optimizer */}
      <article className="rounded-eco-xl border border-eco-gray-200 bg-eco-white p-6 shadow-eco-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-h3 text-eco-navy">Prueba de optimización de rutas</h3>
            <p className="mt-1 max-w-2xl font-sans text-body-sm text-eco-gray-600">
              Genera solicitudes aleatorias en Medellín y calcula la ruta óptima (Nearest Neighbor
              con fallback Haversine). Los datos se crean en el backend real y quedan persistidos en el store.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {([3, 5, 10] as const).map((n) => (
              <button
                key={n}
                type="button"
                disabled={generando || !backendOk}
                onClick={() => void generarYCalcularRuta(n)}
                className="inline-flex items-center gap-2 rounded-eco-md bg-eco-teal px-4 py-2.5 font-sans text-label text-eco-white shadow-eco-sm transition hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {generando ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                ) : (
                  <Shuffle className="h-4 w-4" aria-hidden />
                )}
                {n} puntos
              </button>
            ))}
          </div>
        </div>

        {!backendOk && (
          <p className="mt-4 font-sans text-body-sm text-eco-danger">
            Backend no disponible — conectá el backend para generar datos.
          </p>
        )}

        {generando && (
          <div className="mt-5 flex items-center gap-3 rounded-eco-md bg-eco-gray-50 p-4">
            <Loader2 className="h-5 w-5 animate-spin text-eco-teal" />
            <span className="font-sans text-body-sm text-eco-gray-700">
              Creando puntos y calculando ruta óptima…
            </span>
          </div>
        )}

        {rutaError && (
          <div className="mt-5 rounded-eco-md border border-eco-danger/30 bg-[rgba(217,79,61,0.06)] p-4 font-sans text-body-sm text-eco-danger">
            {rutaError}
          </div>
        )}

        {rutaResult && !generando && (
          <div className="mt-5 space-y-4">
            <div className="flex flex-wrap gap-6 rounded-eco-md border border-eco-teal/20 bg-[rgba(0,92,83,0.04)] p-4">
              <div>
                <p className="font-sans text-caption uppercase tracking-wide text-eco-gray-500">Paradas en ruta</p>
                <p className="font-mono text-metric-lg text-eco-navy">{rutaResult.orden.length}</p>
              </div>
              <div>
                <p className="font-sans text-caption uppercase tracking-wide text-eco-gray-500">Distancia total</p>
                <p className="font-mono text-metric-lg text-eco-navy">{formatKm(rutaResult.distancia_total_km)}</p>
              </div>
              <div>
                <p className="font-sans text-caption uppercase tracking-wide text-eco-gray-500">Tiempo estimado</p>
                <p className="font-mono text-metric-lg text-eco-navy">{formatMin(rutaResult.tiempo_estimado_min)}</p>
              </div>
              {genLog && (
                <div>
                  <p className="font-sans text-caption uppercase tracking-wide text-eco-gray-500">Generados</p>
                  <p className="font-mono text-metric-lg text-eco-navy">{genLog}</p>
                </div>
              )}
            </div>

            <div className="overflow-x-auto rounded-eco-lg border border-eco-gray-200">
              <table className="w-full min-w-[440px] border-collapse text-left">
                <thead className="border-b border-eco-gray-200 bg-eco-gray-50 font-sans text-caption font-semibold uppercase tracking-wide text-eco-gray-700">
                  <tr>
                    <th className="px-4 py-2.5">#</th>
                    <th className="px-4 py-2.5">ID</th>
                    <th className="px-4 py-2.5">Tipo</th>
                    <th className="px-4 py-2.5">Material</th>
                    <th className="px-4 py-2.5">Kg</th>
                    <th className="px-4 py-2.5">Coordenadas</th>
                  </tr>
                </thead>
                <tbody>
                  {rutaResult.orden.map((r, i) => (
                    <tr
                      key={r.id}
                      className="border-b border-eco-gray-100 font-sans text-body-sm last:border-0 even:bg-eco-gray-50/30"
                    >
                      <td className="px-4 py-2.5">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-eco-teal font-mono text-caption text-eco-white">
                          {i + 1}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 font-mono text-code text-eco-teal">#{r.id}</td>
                      <td className="px-4 py-2.5"><TipoBadge tipo={r.tipo} /></td>
                      <td className="px-4 py-2.5 capitalize text-eco-gray-700">{r.material ?? "—"}</td>
                      <td className="px-4 py-2.5 font-mono text-eco-navy">
                        {r.kg_estimados > 0 ? `${r.kg_estimados.toFixed(1)} kg` : "—"}
                      </td>
                      <td className="px-4 py-2.5 font-mono text-caption text-eco-gray-600">
                        {r.latitud.toFixed(4)}, {r.longitud.toFixed(4)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center gap-2 font-sans text-caption text-eco-gray-500">
              <Route className="h-4 w-4 shrink-0 text-eco-teal" />
              Orden calculado con Nearest Neighbor. Cambiá a la sección Solicitudes para ver las nuevas filas en la tabla.
            </div>
          </div>
        )}
      </article>

      {/* Two-column: recent activity + heatmap top */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-eco-xl border border-eco-gray-200 bg-eco-white p-5 shadow-eco-sm">
          <h3 className="font-display text-h3 text-eco-navy">Actividad reciente</h3>
          <p className="mt-1 font-sans text-caption text-eco-gray-500">
            Últimas {recentReportes.length > 0 ? recentReportes.length : "—"} entradas del store.
          </p>
          {recentReportes.length === 0 ? (
            <p className="mt-6 font-sans text-body-sm text-eco-gray-500">
              El store está vacío. Usá el generador de arriba para agregar datos.
            </p>
          ) : (
            <div className="mt-4 divide-y divide-eco-gray-100">
              {recentReportes.map((r) => (
                <div key={r.id} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="shrink-0 font-mono text-code text-eco-teal">#{r.id}</span>
                    <TipoBadge tipo={r.tipo} />
                    <span className="truncate font-sans text-caption text-eco-gray-600">
                      {r.descripcion ?? "Sin descripción"}
                    </span>
                  </div>
                  <EstadoBadge estado={r.estado} />
                </div>
              ))}
            </div>
          )}
          {total > 0 && (
            <p className="mt-3 font-sans text-caption text-eco-gray-500">
              {total} entradas totales · {kgTotal.toFixed(1)} kg estimados en store
            </p>
          )}
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
                  <span className="font-mono text-caption text-eco-gray-600">
                    {p.latitud.toFixed(4)}, {p.longitud.toFixed(4)}
                  </span>
                  <span className="font-mono text-metric-md text-eco-navy">peso {p.peso}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-6 font-sans text-body-sm text-eco-gray-500">Sin coordenadas en el mapa todavía.</p>
          )}
        </div>
      </div>
    </div>
  );
}
