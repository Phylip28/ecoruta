import { colors, chartColors } from "../../../design-system";
import { DsSection, DsTable } from "./DsSection";

const baseKeys = ["navy", "teal", "lime", "yellow", "sage", "white", "black"] as const;
const semanticKeys = ["success", "warning", "danger", "info"] as const;
const grayKeys = ["gray900", "gray700", "gray500", "gray300", "gray200", "gray100", "gray50"] as const;

const nombresBase: Record<(typeof baseKeys)[number], string> = {
  navy: "Abismo Marino",
  teal: "Bosque Profundo",
  lime: "Lima Activa",
  yellow: "Destello Solar",
  sage: "Salvia",
  white: "Blanco",
  black: "Negro Profundo",
};

export function ColorsBlock() {
  return (
    <>
      <DsSection
        id="colores"
        title="2. Paleta de colores"
        subtitle="§2.1–2.3 — tokens en src/design-system/tokens/colors.ts y clases Tailwind eco.*"
      >
        <h3 className="font-display text-h3 text-eco-navy">2.1 Colores base</h3>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {baseKeys.map((key) => (
            <li
              key={key}
              className="overflow-hidden rounded-eco-md border border-eco-gray-200 shadow-eco-sm"
            >
              <div className="h-16 w-full" style={{ backgroundColor: colors[key] }} />
              <div className="p-3 font-sans text-body-sm text-eco-gray-900">
                <p className="font-medium">
                  <code className="font-mono text-code text-eco-teal">color-{key}</code>
                </p>
                <p className="text-eco-gray-600">{nombresBase[key]}</p>
                <p className="font-mono text-caption text-eco-gray-500">{colors[key]}</p>
              </div>
            </li>
          ))}
        </ul>

        <h3 className="mt-10 font-display text-h3 text-eco-navy">2.3 Colores semánticos</h3>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {semanticKeys.map((key) => (
            <li
              key={key}
              className="overflow-hidden rounded-eco-md border border-eco-gray-200 shadow-eco-sm"
            >
              <div className="h-14 w-full" style={{ backgroundColor: colors[key] }} />
              <div className="p-3 font-sans text-body-sm">
                <p className="font-medium text-eco-navy">
                  <code className="font-mono text-code">color-{key}</code>
                </p>
                <p className="font-mono text-caption text-eco-gray-500">{colors[key]}</p>
              </div>
            </li>
          ))}
        </ul>

        <h3 className="mt-10 font-display text-h3 text-eco-navy">2.2 Escala de grises</h3>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {grayKeys.map((key) => (
            <li
              key={key}
              className="overflow-hidden rounded-eco-md border border-eco-gray-200 shadow-eco-sm"
            >
              <div className="h-12 w-full" style={{ backgroundColor: colors[key] }} />
              <div className="p-3 font-sans text-body-sm">
                <p className="font-medium text-eco-navy">
                  <code className="font-mono text-code">
                    color-gray-{key.replace("gray", "")}
                  </code>
                </p>
                <p className="font-mono text-caption text-eco-gray-500">{colors[key]}</p>
              </div>
            </li>
          ))}
        </ul>
      </DsSection>

      <DsSection
        id="contraste"
        title="2.4 Combinaciones de contraste aprobadas"
        subtitle="Pares que superan WCAG según el documento. Nunca usar #DBF227 como texto sobre blanco."
      >
        <DsTable
          headers={["Fondo", "Texto / ícono", "Ratio", "Uso"]}
          rows={[
            ["#DBF227 (amarillo)", "#042940 (navy)", "~9.2:1 AAA", "Botón CTA Reciclador"],
            ["#042940 (navy)", "#FFFFFF", "~15.4:1 AAA", "Header oscuro"],
            ["#005C53 (teal)", "#FFFFFF", "~8.1:1 AAA", "Botones primarios"],
            ["#9FC131 (lime)", "#042940 (navy)", "~5.1:1 AA", "Botones secundarios"],
            ["#FFFFFF", "#042940 (navy)", "~15.4:1 AAA", "Tarjetas de contenido"],
            ["#D6D58E (sage)", "#042940 (navy)", "~4.8:1 AA", "Estado deshabilitado"],
          ]}
        />
        <p className="mt-4 rounded-eco-md border border-eco-danger/40 bg-[rgba(217,79,61,0.08)] p-3 font-sans text-body-sm text-eco-danger">
          NUNCA usar <code className="font-mono">#DBF227</code> como color de texto sobre fondo blanco (ratio ~1.2:1). El amarillo es
          exclusivo para fondos.
        </p>
      </DsSection>

      <DsSection id="chart-colors" title="9.5 · CHART_COLORS (y §2 referencia gráficas)" subtitle="Misma constante chartColors en código.">
        <ul className="flex flex-wrap gap-2">
          {Object.entries(chartColors).map(([name, hex]) => (
            <li
              key={name}
              className="flex items-center gap-2 rounded-full border border-eco-gray-200 py-1 pl-1 pr-3 font-sans text-caption"
            >
              <span className="h-6 w-6 rounded-full border border-eco-gray-200" style={{ backgroundColor: hex }} />
              <span className="text-eco-gray-700">{name}</span>
              <span className="font-mono text-eco-gray-500">{hex}</span>
            </li>
          ))}
        </ul>
      </DsSection>
    </>
  );
}
