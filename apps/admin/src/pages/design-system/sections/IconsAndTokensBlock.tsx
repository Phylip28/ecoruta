import {
  AlertOctagon,
  Bell,
  Bike,
  Camera,
  ChartBar,
  CheckCircle2,
  Crosshair,
  Flame,
  Leaf,
  MapPin,
  Package,
  Recycle,
  Route,
  Shield,
  User,
} from "lucide-react";

import { colors } from "../../../design-system";
import { DsSection, DsTable } from "./DsSection";

const iconCatalog: { fn: string; mci: string; Icon: typeof AlertOctagon; color: string }[] = [
  { fn: "Reporte de emergencia", mci: "alert-octagon", Icon: AlertOctagon, color: colors.danger },
  { fn: "Solicitud de recolección", mci: "recycle", Icon: Recycle, color: colors.teal },
  { fn: "Punto pendiente", mci: "map-marker-alert", Icon: MapPin, color: colors.warning },
  { fn: "En camino", mci: "map-marker-path", Icon: Route, color: colors.lime },
  { fn: "Completado", mci: "check-circle", Icon: CheckCircle2, color: colors.success },
  { fn: "Ruta optimizada", mci: "routes", Icon: Route, color: colors.teal },
  { fn: "Peso / kg", mci: "weight-kilogram", Icon: Package, color: colors.navy },
  { fn: "CO₂ ahorrado", mci: "leaf", Icon: Leaf, color: colors.lime },
  { fn: "Mapa de calor", mci: "fire", Icon: Flame, color: colors.danger },
  { fn: "Reciclador (rol)", mci: "account-hard-hat", Icon: Bike, color: colors.teal },
  { fn: "Ciudadano (rol)", mci: "account", Icon: User, color: colors.navy },
  { fn: "Admin (rol)", mci: "shield-account", Icon: Shield, color: colors.navy },
  { fn: "Cámara", mci: "camera", Icon: Camera, color: colors.gray700 },
  { fn: "Ubicación GPS", mci: "crosshairs-gps", Icon: Crosshair, color: colors.teal },
  { fn: "Cartón", mci: "package-variant", Icon: Package, color: colors.navy },
  { fn: "Estadísticas", mci: "chart-bar", Icon: ChartBar, color: colors.navy },
  { fn: "Notificación", mci: "bell-badge", Icon: Bell, color: colors.warning },
];

export function IconsBlock() {
  return (
    <DsSection
      id="iconografia"
      title="5. Iconografía"
      subtitle="§5.1 En mobile: MaterialCommunityIcons. En web admin se usan iconos Lucide equivalentes para la misma semántica. §5.2 tamaños."
    >
      <DsTable
        headers={["Contexto", "Tamaño", "Token"]}
        rows={[
          ["Ícono en botón CTA", "28px", "icon-xl"],
          ["Botón estándar", "22px", "icon-lg"],
          ["Lista / nav", "24px", "icon-md"],
          ["Badge / estado", "16px", "icon-sm"],
          ["Tab bar", "26px", "icon-nav"],
          ["Pin mapa", "32px", "icon-pin"],
        ]}
      />
      <h3 className="mt-8 font-display text-h3 text-eco-navy">5.3 Catálogo (nombre MCI + equivalente web)</h3>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {iconCatalog.map((row) => (
          <li
            key={row.mci}
            className="flex items-center gap-3 rounded-eco-md border border-eco-gray-200 bg-eco-gray-50 px-3 py-2"
          >
            <row.Icon className="h-6 w-6 shrink-0" style={{ color: row.color }} aria-hidden />
            <div className="min-w-0">
              <p className="font-sans text-body-sm font-medium text-eco-navy">{row.fn}</p>
              <p className="font-mono text-caption text-eco-gray-500">{row.mci}</p>
            </div>
          </li>
        ))}
      </ul>
      <ul className="mt-4 list-inside list-disc font-sans text-body-sm text-eco-gray-700">
        <li>§5.4: icono + texto en accionables Ciudadano; Reciclador puede ícono solo si el contexto es obvio.</li>
        <li>No rotar flechas de dirección; pins de emergencia vs recolección deben diferir en forma y color.</li>
      </ul>
    </DsSection>
  );
}

export function DesignTokensBlock() {
  return (
    <DsSection
      id="tokens"
      title="6. Tokens de diseño"
      subtitle="Radios §6.1 · Sombras §6.2 (CSS vars + Tailwind shadow-eco-*) · Opacidades §6.3."
    >
      <h3 className="font-display text-h3 text-eco-navy">6.1 Border radius</h3>
      <div className="mt-3 flex flex-wrap gap-4">
        {[
          { t: "radius-sm", c: "rounded-eco-sm", px: "6px" },
          { t: "radius-md", c: "rounded-eco-md", px: "12px" },
          { t: "radius-lg", c: "rounded-eco-lg", px: "16px" },
          { t: "radius-xl", c: "rounded-eco-xl", px: "24px" },
          { t: "radius-full", c: "rounded-full", px: "9999px" },
        ].map((r) => (
          <div key={r.t} className="text-center">
            <div className={`h-16 w-16 border-2 border-eco-teal bg-eco-teal/15 ${r.c}`} />
            <p className="mt-2 font-mono text-caption text-eco-gray-600">{r.t}</p>
            <p className="font-mono text-caption text-eco-gray-400">{r.px}</p>
          </div>
        ))}
      </div>

      <h3 className="mt-10 font-display text-h3 text-eco-navy">6.2 Sombras (web)</h3>
      <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-eco-md bg-eco-white p-4 font-sans text-caption text-eco-gray-600 shadow-eco-sm">shadow-eco-sm</div>
        <div className="rounded-eco-md bg-eco-white p-4 font-sans text-caption text-eco-gray-600 shadow-eco-md">shadow-eco-md</div>
        <div className="rounded-eco-md bg-eco-white p-4 font-sans text-caption text-eco-gray-600 shadow-eco-lg">shadow-eco-lg</div>
        <div className="rounded-eco-md bg-eco-white p-4 font-sans text-caption text-eco-gray-600 shadow-eco-xl">shadow-eco-xl</div>
      </div>

      <h3 className="mt-10 font-display text-h3 text-eco-navy">6.3 Opacidades</h3>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { t: "opacity-disabled", v: 0.38 },
          { t: "opacity-overlay", v: 0.72 },
          { t: "opacity-hint", v: 0.6 },
          { t: "opacity-pressed", v: 0.85 },
        ].map((o) => (
          <div key={o.t} className="rounded-eco-md border border-eco-gray-200 p-3">
            <div className="h-12 rounded-eco-sm bg-eco-navy" style={{ opacity: o.v }} />
            <p className="mt-2 font-mono text-caption text-eco-gray-700">{o.t}</p>
            <p className="font-mono text-caption text-eco-gray-500">{o.v}</p>
          </div>
        ))}
      </div>
    </DsSection>
  );
}
