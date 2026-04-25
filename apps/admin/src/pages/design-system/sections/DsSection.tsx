import type { ReactNode } from "react";

type DsSectionProps = {
  id: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export function DsSection({ id, title, subtitle, children }: DsSectionProps) {
  return (
    <section
      id={id}
      className="scroll-mt-28 rounded-eco-lg border border-eco-gray-200 bg-eco-white p-6 shadow-eco-md md:p-8"
    >
      <h2 className="font-display text-h2 text-eco-navy">{title}</h2>
      {subtitle ? (
        <p className="mt-2 max-w-3xl font-sans text-body-sm leading-relaxed text-eco-gray-700">{subtitle}</p>
      ) : null}
      <div className="mt-6">{children}</div>
    </section>
  );
}

export function DsTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto rounded-eco-md border border-eco-gray-200">
      <table className="w-full min-w-[520px] border-collapse font-sans text-body-sm">
        <thead>
          <tr className="bg-eco-gray-50">
            {headers.map((h) => (
              <th
                key={h}
                className="border-b border-eco-gray-200 px-3 py-3 text-left font-sans text-label uppercase tracking-wide text-eco-gray-500"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-eco-gray-200 last:border-0 hover:bg-eco-gray-50">
              {row.map((cell, j) => (
                <td key={j} className="px-3 py-2 align-top text-eco-gray-900">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
