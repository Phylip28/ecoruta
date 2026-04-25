import { adminLayout, space } from "../../../design-system";
import { DsSection, DsTable } from "./DsSection";

const spaceRows = Object.entries(space).map(([k, v]) => [
  `space-${k}`,
  `${v}px`,
  k === "1"
    ? "Separación mínima inline"
    : k === "2"
      ? "Padding chips / badges"
      : k === "3"
        ? "Gap ícono–texto en botones"
        : k === "4"
          ? "Padding horizontal pantalla"
          : k === "6"
            ? "Padding tarjetas"
            : k === "8"
              ? "Separación entre secciones"
              : k === "16"
                ? "Bloques grandes (Admin)"
                : "Ver §4.1 del documento",
]);

export function SpacingGridBlock() {
  return (
    <DsSection
      id="espaciado"
      title="4. Espaciado y grid"
      subtitle="§4.1 Escala base (múltiplos de 4) · §4.3 Grid Web Admin · breakpoints §4.3."
    >
      <h3 className="font-display text-h3 text-eco-navy">4.1 Tokens de espacio (px)</h3>
      <DsTable headers={["Token", "Valor", "Uso típico (doc)"]} rows={spaceRows} />

      <h3 className="mt-10 font-display text-h3 text-eco-navy">4.3 Grid Web Admin — 12 columnas</h3>
      <p className="mb-3 font-sans text-body-sm text-eco-gray-700">
        Gutter {adminLayout.gutter}px · margen horizontal {adminLayout.marginH}px (hasta 1280px) ·{" "}
        <code className="font-mono text-code">max-width: {adminLayout.contentMaxWidth}px</code> centrado. Sidebar{" "}
        {adminLayout.sidebarWidthXl}px (xl) / {adminLayout.sidebarWidthLg}px (lg). Header {adminLayout.headerHeight}px.
      </p>
      <div className="rounded-eco-md border border-dashed border-eco-gray-300 bg-eco-gray-50 p-4">
        <div className="grid grid-cols-12 gap-6">
          {Array.from({ length: 12 }, (_, i) => (
            <div
              key={i}
              className="flex h-10 items-center justify-center rounded-eco-sm bg-eco-teal/20 font-mono text-caption text-eco-navy"
            >
              {i + 1}
            </div>
          ))}
        </div>
        <p className="mt-3 font-sans text-caption text-eco-gray-500">
          Demo visual: 12 columnas con gutter de 24px (gap-6 = 1.5rem).
        </p>
      </div>

      <h3 className="mt-10 font-display text-h3 text-eco-navy">Breakpoints (documento)</h3>
      <DsTable
        headers={["Nombre", "Rango", "Comportamiento"]}
        rows={[
          ["sm", "&lt; 768px", "Columna única, menú colapsado"],
          ["md", "768–1023px", "2 columnas en cards, sidebar oculto"],
          ["lg", "1024–1279px", "3 columnas en cards, sidebar 240px"],
          ["xl", "≥ 1280px", "Layout completo, sidebar 260px"],
        ]}
      />

      <h3 className="mt-10 font-display text-h3 text-eco-navy">4.2 Grid mobile (referencia)</h3>
      <p className="font-sans text-body-sm text-eco-gray-700">
        4 columnas · gutter y margen 16dp (space-4). CTA ancho completo menos márgenes; secundarios 2 columnas.
      </p>

      <h3 className="mt-10 font-display text-h3 text-eco-navy">4.4 Alturas mínimas de toque (mobile)</h3>
      <DsTable
        headers={["Elemento", "Altura mín.", "Ancho mín."]}
        rows={[
          ["Botón principal Reciclador", "64dp", "100% − 32dp"],
          ["Botón principal Ciudadano", "56dp", "100% − 32dp"],
          ["Botón secundario", "48dp", "140dp"],
          ["Item de lista accionable", "64dp", "100%"],
          ["Tab bar item", "56dp", "—"],
          ["Chip / badge no accionable", "28dp", "—"],
          ["Chip / badge accionable", "40dp", "88dp"],
          ["Input formulario", "52dp", "100%"],
        ]}
      />
    </DsSection>
  );
}
