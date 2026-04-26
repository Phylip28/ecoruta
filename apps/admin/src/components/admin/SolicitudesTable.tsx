import { useMemo, useState } from "react";
import { FileSearch } from "lucide-react";

import { tableEstadoBadges } from "../../design-system";
import type { Reporte } from "../../core/api";
import { TableSearchField } from "./TableSearchField";

type SolicitudesTableProps = {
  rows: Reporte[];
};

function EstadoLabel({ estado }: { estado: Reporte["estado"] }) {
  const s = tableEstadoBadges[estado];
  const text =
    estado === "pendiente" ? "Pendiente" : estado === "en_camino" ? "En camino" : "Completado";
  return (
    <span
      className="inline-block rounded-eco-sm px-2 py-0.5 font-sans text-caption font-semibold"
      style={{ backgroundColor: s.bg, color: s.text }}
    >
      {text}
    </span>
  );
}

const materialLabel: Record<string, string> = {
  carton: "Cartón",
  vidrio: "Vidrio",
  plastico: "Plástico",
  mixto: "Mixto",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("es-CO", { dateStyle: "short", timeStyle: "short" });
}

export function SolicitudesTable({ rows }: SolicitudesTableProps) {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return rows;
    return rows.filter(
      (r) =>
        String(r.id).includes(s) ||
        r.estado.includes(s) ||
        (r.material !== null && (materialLabel[r.material] ?? r.material).toLowerCase().includes(s)) ||
        (r.descripcion?.toLowerCase().includes(s) ?? false) ||
        (r.reciclador_id !== null && String(r.reciclador_id).includes(s)) ||
        (r.ciudadano_telegram_id !== null && String(r.ciudadano_telegram_id).includes(s)),
    );
  }, [rows, q]);

  return (
    <div className="space-y-3">
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <TableSearchField
          value={q}
          onChange={setQ}
          placeholder="Buscar por ID, material, estado, ciudadano…"
        />
        <p className="shrink-0 text-right font-sans text-caption text-eco-gray-500">
          {filtered.length} de {rows.length} resultados
        </p>
      </div>
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-eco-lg border border-dashed border-eco-gray-200 py-8">
          <FileSearch className="h-8 w-8 text-eco-gray-300" aria-hidden />
          <p className="font-sans text-body-sm text-eco-gray-600">
            {q.trim() ? `No coinciden filas con «${q.trim()}».` : "No hay solicitudes aún. El store arranca vacío."}
          </p>
        </div>
      ) : (
        <div className="max-h-[min(70vh,640px)] overflow-x-auto overflow-y-auto rounded-eco-lg border border-eco-gray-200 bg-eco-white shadow-eco-sm">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <thead className="sticky top-0 z-10 border-b border-eco-gray-200 bg-eco-gray-50/95 font-sans text-caption font-semibold uppercase tracking-wide text-eco-gray-700 backdrop-blur">
              <tr>
                <th scope="col" className="px-eco-4 py-eco-3">ID</th>
                <th scope="col" className="px-eco-4 py-eco-3">Material</th>
                <th scope="col" className="px-eco-4 py-eco-3">Kg est.</th>
                <th scope="col" className="px-eco-4 py-eco-3">Estado</th>
                <th scope="col" className="px-eco-4 py-eco-3">Ciudadano (TG)</th>
                <th scope="col" className="px-eco-4 py-eco-3">Reciclador ID</th>
                <th scope="col" className="px-eco-4 py-eco-3">Creado</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr
                  key={r.id}
                  className="border-b border-eco-gray-100 font-sans text-body-sm text-eco-gray-900 even:bg-eco-gray-50/30 last:border-0"
                >
                  <td className="whitespace-nowrap px-eco-4 py-eco-3 font-mono text-code text-eco-teal">#{r.id}</td>
                  <td className="px-eco-4 py-eco-3 font-medium text-eco-navy capitalize">
                    {r.material !== null ? (materialLabel[r.material] ?? r.material) : "—"}
                  </td>
                  <td className="px-eco-4 py-eco-3 font-mono text-metric-md text-eco-navy">
                    {r.kg_estimados > 0 ? (
                      <>{r.kg_estimados.toFixed(1)} <span className="font-sans text-caption text-eco-gray-500">kg</span></>
                    ) : "—"}
                  </td>
                  <td className="px-eco-4 py-eco-3">
                    <EstadoLabel estado={r.estado} />
                  </td>
                  <td className="px-eco-4 py-eco-3 font-mono text-caption text-eco-gray-600">
                    {r.ciudadano_telegram_id !== null ? `#${r.ciudadano_telegram_id}` : "—"}
                  </td>
                  <td className="px-eco-4 py-eco-3 font-mono text-caption text-eco-gray-600">
                    {r.reciclador_id !== null ? `#${r.reciclador_id}` : "—"}
                  </td>
                  <td className="whitespace-nowrap px-eco-4 py-eco-3 text-eco-gray-600">{formatDate(r.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

