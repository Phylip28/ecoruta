import { useMemo, useState } from "react";
import { FileSearch } from "lucide-react";

import { tableEstadoBadges, tableTypeBadges } from "../../design-system";
import type { ReporteDemo } from "../../data/adminDemoData";
import { TableSearchField } from "./TableSearchField";

type ReportesTableProps = {
  rows: ReporteDemo[];
};

function TipoLabel({ tipo }: { tipo: ReporteDemo["tipo"] }) {
  const key = tipo === "emergencia" ? "emergencia" : "recoleccion";
  const s = tableTypeBadges[key];
  const text = tipo === "emergencia" ? "Emergencia" : "Solicitud / recolección";
  return (
    <span
      className="inline-block rounded-eco-sm px-2 py-0.5 font-sans text-caption font-semibold"
      style={{ backgroundColor: s.bg, color: s.text }}
    >
      {text}
    </span>
  );
}

function EstadoLabel({ estado }: { estado: ReporteDemo["estado"] }) {
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

export function ReportesTable({ rows }: ReportesTableProps) {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return rows;
    return rows.filter(
      (r) =>
        r.id.toLowerCase().includes(s) ||
        r.comuna.toLowerCase().includes(s) ||
        r.barrio.toLowerCase().includes(s) ||
        r.descripcion.toLowerCase().includes(s) ||
        (r.reciclador?.toLowerCase().includes(s) ?? false),
    );
  }, [rows, q]);

  return (
    <div className="space-y-3">
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <TableSearchField
          value={q}
          onChange={setQ}
          placeholder="Buscar por ID, comuna, descripción, reciclador…"
        />
        <p className="shrink-0 text-right font-sans text-caption text-eco-gray-500">
          {filtered.length} de {rows.length} resultados
        </p>
      </div>
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-eco-lg border border-dashed border-eco-gray-200 py-8">
          <FileSearch className="h-8 w-8 text-eco-gray-300" aria-hidden />
          <p className="font-sans text-body-sm text-eco-gray-600">
            {q.trim() ? `No coinciden filas con «${q.trim()}».` : "No hay filas en esta lista."}
          </p>
        </div>
      ) : (
        <div className="max-h-[min(70vh,640px)] overflow-x-auto overflow-y-auto rounded-eco-lg border border-eco-gray-200 bg-eco-white shadow-eco-sm">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead className="sticky top-0 z-10 border-b border-eco-gray-200 bg-eco-gray-50/95 font-sans text-caption font-semibold uppercase tracking-wide text-eco-gray-700 backdrop-blur">
              <tr>
                <th scope="col" className="px-eco-4 py-eco-3">
                  ID
                </th>
                <th scope="col" className="px-eco-4 py-eco-3">
                  Tipo
                </th>
                <th scope="col" className="px-eco-4 py-eco-3">
                  Estado
                </th>
                <th scope="col" className="px-eco-4 py-eco-3">
                  Territorio
                </th>
                <th scope="col" className="px-eco-4 py-eco-3">
                  Creado
                </th>
                <th scope="col" className="px-eco-4 py-eco-3">
                  Reciclador
                </th>
                <th scope="col" className="px-eco-4 py-eco-3 min-w-[200px]">
                  Descripción
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr
                  key={r.id}
                  className="border-b border-eco-gray-100 font-sans text-body-sm text-eco-gray-900 even:bg-eco-gray-50/30 last:border-0"
                >
                  <td className="whitespace-nowrap px-eco-4 py-eco-3 font-mono text-code text-eco-teal">{r.id}</td>
                  <td className="px-eco-4 py-eco-3">
                    <TipoLabel tipo={r.tipo} />
                  </td>
                  <td className="px-eco-4 py-eco-3">
                    <EstadoLabel estado={r.estado} />
                  </td>
                  <td className="px-eco-4 py-eco-3 text-eco-gray-700">
                    <span className="block text-eco-navy">{r.comuna}</span>
                    <span className="text-caption text-eco-gray-500">{r.barrio}</span>
                  </td>
                  <td className="whitespace-nowrap px-eco-4 py-eco-3 text-eco-gray-600">{r.creado}</td>
                  <td className="px-eco-4 py-eco-3 text-eco-gray-800">{r.reciclador ?? "—"}</td>
                  <td className="px-eco-4 py-eco-3 text-eco-gray-600">{r.descripcion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
