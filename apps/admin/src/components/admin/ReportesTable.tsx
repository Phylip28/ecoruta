import { tableEstadoBadges, tableTypeBadges } from "../../design-system";
import type { ReporteDemo } from "../../data/adminDemoData";

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
  return (
    <div className="overflow-x-auto rounded-eco-lg border border-eco-gray-200 bg-eco-white shadow-eco-sm">
      <table className="w-full min-w-[720px] border-collapse text-left">
        <thead>
          <tr className="border-b border-eco-gray-200 bg-eco-gray-50 font-sans text-caption font-semibold uppercase tracking-wide text-eco-gray-700">
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
          {rows.map((r) => (
            <tr key={r.id} className="border-b border-eco-gray-100 font-sans text-body-sm text-eco-gray-900 last:border-0">
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
  );
}
