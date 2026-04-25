import { DsSection, DsTable } from "./DsSection";

export function PrinciplesBlock() {
  const cards = [
    {
      title: "1.1 Claridad radical",
      body: "Una acción principal visible por pantalla. Sin ambigüedad sobre el siguiente paso (especialmente Reciclador en movimiento).",
    },
    {
      title: "1.2 Inclusión digital",
      body: "Iconos con texto. Errores que explican el problema y la solución.",
    },
    {
      title: "1.3 Legibilidad en exterior",
      body: "Contraste mínimo WCAG AA; AAA en elementos críticos del Reciclador bajo sol.",
    },
    {
      title: "1.4 Datos como acción",
      body: "En Admin, cada métrica con una acción posible: el dashboard es operativo, no decorativo.",
    },
  ];

  return (
    <DsSection
      id="principios"
      title="1. Principios de diseño"
      subtitle="Cuatro principios que guían EcoRuta Inteligente v1.0 (documento §1)."
    >
      <div className="grid gap-4 md:grid-cols-2">
        {cards.map((c) => (
          <article
            key={c.title}
            className="rounded-eco-md border border-eco-gray-200 bg-eco-gray-50 p-4 shadow-eco-sm"
          >
            <h3 className="font-display text-h4 text-eco-navy">{c.title}</h3>
            <p className="mt-2 font-sans text-body-sm text-eco-gray-700">{c.body}</p>
          </article>
        ))}
      </div>
    </DsSection>
  );
}

export function TypographyRulesBlock() {
  return (
    <DsSection
      id="reglas-tipografia"
      title="3.4 Reglas de uso tipográfico"
      subtitle="Resumen del documento §3.4."
    >
      <ul className="list-inside list-disc space-y-2 font-sans text-body-sm text-eco-gray-800">
        <li>
          <strong>Reciclador:</strong> tamaño mínimo informativo <code className="font-mono text-code">text-body-md</code> (15sp); no usar{" "}
          <code className="font-mono text-code">text-caption</code> en elementos accionables.
        </li>
        <li>
          <strong>Ciudadano:</strong> errores y confirmaciones con <code className="font-mono text-code">text-body-lg</code> (17sp).
        </li>
        <li>
          <strong>Admin:</strong> métricas numéricas siempre en <strong className="font-mono">DM Mono</strong>.
        </li>
        <li>
          <code className="font-mono text-code">textTransform: uppercase</code> solo en labels de estado (badges), nunca en texto de lectura.
        </li>
      </ul>
    </DsSection>
  );
}

export function AccessibilityBlock() {
  return (
    <DsSection
      id="accesibilidad"
      title="12. Accesibilidad (requisitos mínimos)"
      subtitle="Tabla §12.1 — criterios y aplicación."
    >
      <DsTable
        headers={["Criterio", "Requerimiento", "Aplica a"]}
        rows={[
          ["Contraste texto normal", "≥ 4.5:1 (WCAG AA)", "Todos"],
          ["Contraste texto grande (18sp+)", "≥ 3:1 (WCAG AA)", "Todos"],
          ["Contraste UI crítica (exterior)", "≥ 7:1 (WCAG AAA)", "Reciclador"],
          ["Área táctil mínima", "44×44dp", "Mobile"],
          ["Área táctil CTA Reciclador", "64× ancho completo", "Reciclador"],
          ["Lectores de pantalla", "accessibilityLabel en botones", "Mobile"],
          ["Rol semántico", "accessibilityRole correcto", "Mobile"],
        ]}
      />
    </DsSection>
  );
}

export function MotionBlock() {
  return (
    <DsSection
      id="motion"
      title="13. Motion y animaciones"
      subtitle="Principios §13.1 y duraciones §6.4 / §13.2."
    >
      <ul className="mb-6 list-inside list-disc space-y-2 font-sans text-body-sm text-eco-gray-800">
        <li>Las animaciones comunican información (cambio de estado, éxito/error).</li>
        <li>Evitar animación puramente decorativa en flujos de alta carga cognitiva (Reciclador en ruta).</li>
        <li>Transición de pantalla máx. 300ms (doc §13.1).</li>
      </ul>
      <DsTable
        headers={["Token", "Duración", "Curva", "Uso"]}
        rows={[
          ["duration-fast", "100ms", "ease-out", "Press / feedback inmediato"],
          ["duration-normal", "200ms", "ease-in-out", "Transiciones de estado"],
          ["duration-slow", "350ms", "ease-in-out", "Modales / sheets"],
          ["duration-deliberate", "500ms", "ease-in-out", "Carga / onboarding"],
        ]}
      />
      <p className="mt-4 font-sans text-caption text-eco-gray-500">
        En Tailwind: <code className="font-mono text-code">duration-eco-fast</code>,{" "}
        <code className="font-mono text-code">duration-eco-normal</code>, etc.
      </p>
    </DsSection>
  );
}
