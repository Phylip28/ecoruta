import { NavLink } from "react-router-dom";

import { AccessibilityBlock, MotionBlock, PrinciplesBlock, TypographyRulesBlock } from "./sections/PrinciplesAndMeta";
import { AdminWebBlock } from "./sections/AdminWebBlock";
import { ColorsBlock } from "./sections/ColorsBlock";
import { DesignTokensBlock, IconsBlock } from "./sections/IconsAndTokensBlock";
import { MobileCitizenBlock } from "./sections/MobileCitizenBlock";
import { MobileRecyclerBlock } from "./sections/MobileRecyclerBlock";
import { SharedNavBlock } from "./sections/SharedNavBlock";
import { SpacingGridBlock } from "./sections/SpacingGridBlock";
import { TypographyBlock } from "./sections/TypographyBlock";

const toc = [
  { href: "#principios", label: "1 · Principios" },
  { href: "#colores", label: "2 · Colores" },
  { href: "#tipografia", label: "3 · Tipografía" },
  { href: "#reglas-tipografia", label: "3.4 · Reglas" },
  { href: "#espaciado", label: "4 · Espacio y grid" },
  { href: "#iconografia", label: "5 · Iconos" },
  { href: "#tokens", label: "6 · Radios / sombras" },
  { href: "#mobile-ciudadano", label: "7 · Mobile ciudadano" },
  { href: "#mobile-reciclador", label: "8 · Mobile reciclador" },
  { href: "#web-admin", label: "9 · Web admin" },
  { href: "#compartidos", label: "10–11 · Compartido y nav" },
  { href: "#accesibilidad", label: "12 · A11y" },
  { href: "#motion", label: "13 · Motion" },
];

export function DesignSystemPage() {
  return (
    <div className="mx-auto max-w-admin pb-16">
      <p className="mb-6 font-sans text-body-sm">
        <NavLink to="/" className="text-eco-teal hover:underline">
          ← Volver al panel de administración
        </NavLink>
      </p>
      <header className="mb-8 border-b border-eco-gray-200 pb-8">
        <p className="font-sans text-label uppercase tracking-wide text-eco-teal">EcoRuta Inteligente v1.0</p>
        <h1 className="mt-2 font-display text-display text-eco-navy">Design system</h1>
        <p className="mt-3 max-w-3xl font-sans text-body text-eco-gray-700">
          Galería viva alineada con <strong>EcoRuta_Design_System.md</strong>: mismos tokens en{" "}
          <code className="font-mono text-code text-eco-teal">src/design-system/</code> y utilidades Tailwind{" "}
          <code className="font-mono text-code">eco.*</code>. Incluye principios, color, tipo, espacio, iconografía, tokens,
          patrones mobile, componentes admin (KPI, tabla, mapa, gráficas) y referencias de accesibilidad y motion.
        </p>
      </header>

      <nav
        aria-label="Índice del design system"
        className="sticky top-0 z-10 -mx-2 mb-10 flex flex-wrap gap-2 border-b border-eco-gray-200 bg-eco-gray-50/95 px-2 py-3 backdrop-blur-sm md:gap-3"
      >
        {toc.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="rounded-full border border-eco-gray-200 bg-eco-white px-3 py-1.5 font-sans text-caption font-medium text-eco-teal shadow-eco-sm hover:border-eco-teal hover:bg-eco-gray-50"
          >
            {item.label}
          </a>
        ))}
      </nav>

      <div className="mx-auto flex max-w-admin flex-col gap-10">
        <PrinciplesBlock />
        <ColorsBlock />
        <TypographyBlock />
        <TypographyRulesBlock />
        <SpacingGridBlock />
        <IconsBlock />
        <DesignTokensBlock />
        <MobileCitizenBlock />
        <MobileRecyclerBlock />
        <AdminWebBlock />
        <SharedNavBlock />
        <AccessibilityBlock />
        <MotionBlock />
      </div>
    </div>
  );
}
