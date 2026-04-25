import { Star } from "lucide-react";

import type { RecicladorDemo } from "../../data/adminDemoData";

type RecicladoresTableProps = {
  rows: RecicladorDemo[];
};

export function RecicladoresTable({ rows }: RecicladoresTableProps) {
  return (
    <div className="overflow-x-auto rounded-eco-lg border border-eco-gray-200 bg-eco-white shadow-eco-sm">
      <table className="w-full min-w-[600px] border-collapse text-left">
        <thead>
          <tr className="border-b border-eco-gray-200 bg-eco-gray-50 font-sans text-caption font-semibold uppercase tracking-wide text-eco-gray-700">
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
          {rows.map((r) => (
            <tr key={r.id} className="border-b border-eco-gray-100 font-sans text-body-sm text-eco-gray-900 last:border-0">
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
  );
}
