import { useMemo, useState } from "react";
import { FileSearch, Star } from "lucide-react";

import type { RecicladorDemo } from "../../data/adminDemoData";
import { TableSearchField } from "./TableSearchField";

type RecicladoresTableProps = {
  rows: RecicladorDemo[];
};

export function RecicladoresTable({ rows }: RecicladoresTableProps) {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return rows;
    return rows.filter(
      (r) =>
        r.id.toLowerCase().includes(s) ||
        r.nombre.toLowerCase().includes(s) ||
        r.zona.toLowerCase().includes(s) ||
        r.telegram.toLowerCase().includes(s),
    );
  }, [rows, q]);

  return (
    <div className="space-y-3">
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <TableSearchField
          value={q}
          onChange={setQ}
          placeholder="Buscar por ID, nombre, zona, contacto…"
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
          <table className="w-full min-w-[600px] border-collapse text-left">
            <thead className="sticky top-0 z-10 border-b border-eco-gray-200 bg-eco-gray-50/95 font-sans text-caption font-semibold uppercase tracking-wide text-eco-gray-700 backdrop-blur">
              <tr>
                <th scope="col" className="px-eco-4 py-eco-3">
                  ID
                </th>
                <th scope="col" className="px-eco-4 py-eco-3">
                  Nombre
                </th>
                <th scope="col" className="px-eco-4 py-eco-3">
                  Zona
                </th>
                <th scope="col" className="px-eco-4 py-eco-3 text-right">
                  Activas
                </th>
                <th scope="col" className="px-eco-4 py-eco-3 text-right">
                  Cerradas (mes)
                </th>
                <th scope="col" className="px-eco-4 py-eco-3">
                  Valoración
                </th>
                <th scope="col" className="px-eco-4 py-eco-3">
                  Contacto
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
                  <td className="px-eco-4 py-eco-3 font-medium text-eco-navy">{r.nombre}</td>
                  <td className="px-eco-4 py-eco-3 text-eco-gray-700">{r.zona}</td>
                  <td className="px-eco-4 py-eco-3 text-right font-mono text-body-sm">{r.activas}</td>
                  <td className="px-eco-4 py-eco-3 text-right font-mono text-body-sm">{r.completadas_mes}</td>
                  <td className="px-eco-4 py-eco-3">
                    <span className="inline-flex items-center gap-1 font-mono text-body-sm text-eco-navy">
                      <Star className="h-3.5 w-3.5 fill-eco-yellow text-eco-yellow" aria-hidden />
                      {r.rating.toFixed(1)}
                    </span>
                  </td>
                  <td className="px-eco-4 py-eco-3 font-mono text-caption text-eco-gray-600">{r.telegram}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
