import { DsSection, DsTable } from "./DsSection";

export function TypographyBlock() {
  return (
    <>
      <DsSection
        id="tipografia"
        title="3. Tipografía"
        subtitle="§3.1 Familias: Sora (display/headings), DM Sans (body/UI), DM Mono (métricas, IDs, coordenadas)."
      >
        <h3 className="font-display text-h3 text-eco-navy">3.3 Escala tipográfica — Web Admin (rem, base 16px)</h3>
        <DsTable
          headers={["Token", "Familia", "Peso", "Tamaño", "Line height", "Uso"]}
          rows={[
            ["text-display", "Sora", "800", "2.5rem", "3rem", "Hero dashboard"],
            ["text-h1", "Sora", "700", "2rem", "2.5rem", "Título de página"],
            ["text-h2", "Sora", "700", "1.5rem", "2rem", "Sección dashboard"],
            ["text-h3", "Sora", "600", "1.25rem", "1.75rem", "Card / widget"],
            ["text-h4", "Sora", "600", "1.125rem", "1.5rem", "Sub-sección"],
            ["text-body", "DM Sans", "400", "1rem", "1.625rem", "Texto general"],
            ["text-body-sm", "DM Sans", "400", "0.875rem", "1.375rem", "Tablas, secundario"],
            ["text-label", "DM Sans", "700", "0.875rem", "1.25rem", "Labels inputs, headers tabla"],
            ["text-caption", "DM Sans", "500", "0.75rem", "1.125rem", "Fechas, metadata"],
            ["text-metric-xl", "DM Mono", "500", "3rem", "3.5rem", "KPI principal"],
            ["text-metric-lg", "DM Mono", "500", "2rem", "2.5rem", "KPI secundario"],
            ["text-metric-md", "DM Mono", "500", "1.5rem", "2rem", "Métricas en tarjetas"],
            ["text-code", "DM Mono", "500", "0.875rem", "1.375rem", "Coordenadas, IDs"],
          ]}
        />

        <h3 className="mt-10 font-display text-h3 text-eco-navy">Muestra visual (clases Tailwind del proyecto)</h3>
        <div className="mt-4 space-y-3 border-l-4 border-eco-teal pl-4">
          <p className="font-display text-display text-eco-navy">text-display — Sora 800</p>
          <p className="font-display text-h1 text-eco-navy">text-h1 — Título de página</p>
          <p className="font-display text-h2 text-eco-navy">text-h2 — Sección</p>
          <p className="font-display text-h3 text-eco-navy">text-h3 — Encabezado de card</p>
          <p className="font-display text-h4 text-eco-navy">text-h4 — Sub-sección</p>
          <p className="font-sans text-body text-eco-gray-800">
            text-body — DM Sans 400. Texto corrido para descripciones y párrafos en el panel admin.
          </p>
          <p className="font-sans text-body-sm text-eco-gray-700">
            text-body-sm — Tablas, celdas secundarias, listas compactas.
          </p>
          <p className="font-sans text-label uppercase tracking-wide text-eco-gray-700">text-label uppercase — header de tabla</p>
          <p className="font-sans text-caption text-eco-gray-500">text-caption — 12 ene 2026 · zona norte</p>
          <p className="font-mono text-metric-xl text-eco-teal">128.4</p>
          <p className="font-mono text-metric-lg text-eco-navy">42.00</p>
          <p className="font-mono text-metric-md text-eco-navy">6.2442, -75.5812</p>
          <p className="font-mono text-code text-eco-gray-700">REQ-2026-0042</p>
        </div>

        <h3 className="mt-10 font-display text-h3 text-eco-navy">3.2 Escala mobile (referencia cruzada)</h3>
        <p className="mb-3 font-sans text-body-sm text-eco-gray-600">
          En React Native los tokens equivalentes están en <code className="font-mono text-code">Typography</code> (sp). Ejemplos:
        </p>
        <DsTable
          headers={["Token RN", "Tamaño / altura de línea"]}
          rows={[
            ["text-display", "32sp / 40sp · Sora 800"],
            ["text-heading-1", "28sp / 36sp · Sora 700"],
            ["text-body-lg", "17sp / 26sp · DM Sans 400"],
            ["text-label-lg", "16sp / 20sp · DM Sans 700"],
            ["text-metric", "28sp / 34sp · DM Mono 500"],
          ]}
        />
      </DsSection>
    </>
  );
}
