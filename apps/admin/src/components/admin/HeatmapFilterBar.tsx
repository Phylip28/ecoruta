import { useId, useState } from "react";
import { Filter, RotateCcw, Sparkles } from "lucide-react";

/**
 * Criterios de análisis admin (FE-08) — la UI queda preparada; el mapa listado
 * hoy toma el agregado completo del API sin parámetros de filtro.
 */
export function HeatmapFilterBar() {
  const idBase = useId();
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [material, setMaterial] = useState<"todos" | "carton" | "vidrio" | "plastico" | "mixto">("todos");
  const [estado, setEstado] = useState<"todos" | "pendiente" | "en_camino" | "completado">("todos");
  const [saved, setSaved] = useState(false);

  const reset = () => {
    setDesde("");
    setHasta("");
    setMaterial("todos");
    setEstado("todos");
    setSaved(false);
  };

  return (
    <div className="rounded-eco-lg border border-eco-gray-200 bg-eco-gray-50/80 p-4 shadow-eco-sm">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2 font-sans text-label text-eco-navy">
          <Filter className="h-4 w-4 text-eco-teal" aria-hidden />
          Criterios de análisis
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 font-sans text-[11px] font-medium text-eco-gray-500 shadow-eco-sm">
          <Sparkles className="h-3 w-3 text-eco-lime" aria-hidden />
          Vista
        </span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="block font-sans text-caption text-eco-gray-600" htmlFor={`${idBase}-d`}>
          Desde
          <input
            id={`${idBase}-d`}
            type="date"
            value={desde}
            onChange={(e) => {
              setDesde(e.target.value);
              setSaved(false);
            }}
            className="mt-1 w-full rounded-eco-sm border border-eco-gray-200 bg-eco-white px-2.5 py-2 font-sans text-body-sm text-eco-navy"
          />
        </label>
        <label className="block font-sans text-caption text-eco-gray-600" htmlFor={`${idBase}-h`}>
          Hasta
          <input
            id={`${idBase}-h`}
            type="date"
            value={hasta}
            onChange={(e) => {
              setHasta(e.target.value);
              setSaved(false);
            }}
            className="mt-1 w-full rounded-eco-sm border border-eco-gray-200 bg-eco-white px-2.5 py-2 font-sans text-body-sm text-eco-navy"
          />
        </label>
        <label className="block font-sans text-caption text-eco-gray-600" htmlFor={`${idBase}-m`}>
          Material
          <select
            id={`${idBase}-m`}
            value={material}
            onChange={(e) => {
              setMaterial(e.target.value as typeof material);
              setSaved(false);
            }}
            className="mt-1 w-full rounded-eco-sm border border-eco-gray-200 bg-eco-white px-2.5 py-2 font-sans text-body-sm text-eco-navy"
          >
            <option value="todos">Todos</option>
            <option value="carton">Cartón</option>
            <option value="vidrio">Vidrio</option>
            <option value="plastico">Plástico</option>
            <option value="mixto">Mixto</option>
          </select>
        </label>
        <label className="block font-sans text-caption text-eco-gray-600" htmlFor={`${idBase}-e`}>
          Estado
          <select
            id={`${idBase}-e`}
            value={estado}
            onChange={(e) => {
              setEstado(e.target.value as typeof estado);
              setSaved(false);
            }}
            className="mt-1 w-full rounded-eco-sm border border-eco-gray-200 bg-eco-white px-2.5 py-2 font-sans text-body-sm text-eco-navy"
          >
            <option value="todos">Todos</option>
            <option value="pendiente">Pendiente</option>
            <option value="en_camino">En camino</option>
            <option value="completado">Completado</option>
          </select>
        </label>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <p className="max-w-xl font-sans text-caption leading-snug text-eco-gray-500">
          Hoy el endpoint devuelve el agregado completo; al habilitar consultas con parámetros, estos criterios determinarán la
          carga.
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1.5 rounded-eco-sm border border-eco-gray-200 bg-eco-white px-3 py-1.5 font-sans text-caption font-medium text-eco-gray-700 transition hover:bg-eco-gray-50"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden />
            Limpiar
          </button>
          <button
            type="button"
            onClick={() => setSaved(true)}
            className="inline-flex items-center justify-center rounded-eco-md bg-eco-teal px-4 py-2 font-sans text-label text-eco-white shadow-eco-sm transition duration-eco-fast hover:brightness-110"
          >
            Guardar vista
          </button>
        </div>
      </div>
      {saved ? (
        <p className="mt-2 font-sans text-caption text-eco-teal" role="status">
          Preferencias guardadas en esta sesión (hasta recargar la página).
        </p>
      ) : null}
    </div>
  );
}
