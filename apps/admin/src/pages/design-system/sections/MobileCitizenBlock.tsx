import { AlertOctagon, Camera, Crosshair, Info, Recycle } from "lucide-react";

import { colors } from "../../../design-system";
import { DsSection } from "./DsSection";

export function MobileCitizenBlock() {
  return (
    <DsSection
      id="mobile-ciudadano"
      title="7. Componentes — Mobile (Ciudadano)"
      subtitle="Referencias estáticas según §7.1–7.5 (Expo / RN en la app; aquí HTML + Tailwind equivalente)."
    >
      <h3 className="font-display text-h3 text-eco-navy">7.1 Botón CTA principal</h3>
      <p className="mb-3 font-sans text-body-sm text-eco-gray-600">
        Altura 64dp, radius-lg, gap ícono 12px, padding H 24px, shadow-md. Tipografía label (DM Sans 700 16sp en doc §7.1).
      </p>
      <div className="flex max-w-md flex-col gap-3">
        <button
          type="button"
          className="inline-flex h-16 items-center justify-center gap-3 rounded-eco-lg bg-eco-danger px-6 font-sans text-label text-eco-white shadow-eco-md transition duration-eco-fast hover:opacity-90"
        >
          <AlertOctagon className="h-7 w-7 shrink-0" aria-hidden />
          Reporte de emergencia
        </button>
        <button
          type="button"
          className="inline-flex h-16 items-center justify-center gap-3 rounded-eco-lg bg-eco-teal px-6 font-sans text-label text-eco-white shadow-eco-md"
        >
          <Recycle className="h-7 w-7 shrink-0" aria-hidden />
          Solicitar recolección
        </button>
        <button
          type="button"
          disabled
          className="inline-flex h-16 cursor-not-allowed items-center justify-center gap-3 rounded-eco-lg bg-eco-sage px-6 font-sans text-label text-eco-gray-500"
        >
          Deshabilitado (sage + gray-500)
        </button>
      </div>

      <h3 className="mt-10 font-display text-h3 text-eco-navy">7.2 Tarjeta de reporte</h3>
      <article className="relative mt-3 max-w-lg overflow-hidden rounded-eco-lg border border-eco-gray-100 bg-eco-white p-6 shadow-eco-md">
        <div className="absolute left-0 top-0 h-full w-1 bg-eco-danger" aria-hidden />
        <div className="pl-2">
          <div className="flex justify-between gap-3">
            <div>
              <p className="font-display text-h4 text-eco-navy">Cra. 70 #45-23</p>
              <p className="mt-1 font-sans text-caption text-eco-gray-500">Hace 12 min</p>
            </div>
            <div className="h-20 w-20 shrink-0 rounded-eco-md bg-eco-gray-200" aria-hidden />
          </div>
          <span className="mt-3 inline-block rounded-full bg-eco-yellow px-3 py-1 font-sans text-label text-eco-navy">
            PENDIENTE
          </span>
        </div>
      </article>

      <h3 className="mt-10 font-display text-h3 text-eco-navy">7.3 Chips de material</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {["Cartón", "Plástico", "Vidrio", "Metal"].map((m, i) => (
          <span
            key={m}
            className={`inline-flex h-10 items-center rounded-full border px-4 text-sm font-bold leading-[18px] ${
              i === 1
                ? "border-transparent bg-eco-teal text-eco-white"
                : "border-eco-gray-300 bg-eco-gray-100 text-eco-gray-700"
            }`}
          >
            {m}
          </span>
        ))}
      </div>

      <h3 className="mt-10 font-display text-h3 text-eco-navy">7.3 Ubicación automática · Ayuda · Foto</h3>
      <div className="mt-3 max-w-lg space-y-3">
        <div className="flex items-start gap-2 rounded-eco-md border border-eco-gray-300 bg-eco-gray-50 p-3">
          <Crosshair className="mt-0.5 h-5 w-5 shrink-0 text-eco-teal" aria-hidden />
          <p className="font-sans text-body-sm text-eco-gray-800">Medellín, Laureles — Cra. 76 # 40-12 (solo lectura)</p>
        </div>
        <div className="flex gap-2 rounded-eco-sm bg-eco-gray-50 p-3">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-eco-gray-700" aria-hidden />
          <p className="font-sans text-body-sm text-eco-gray-700">
            Añade una foto clara del punto. Esto ayuda al reciclador a ubicarte más rápido.
          </p>
        </div>
        <div className="flex h-40 flex-col items-center justify-center rounded-eco-lg border-2 border-dashed border-eco-gray-300 bg-eco-gray-100">
          <Camera className="h-12 w-12 text-eco-gray-500" aria-hidden />
          <p className="mt-2 font-sans text-body-sm text-eco-gray-500">Toca para agregar foto</p>
        </div>
      </div>

      <h3 className="mt-10 font-display text-h3 text-eco-navy">7.4 Toast / Snackbar (variantes)</h3>
      <p className="mb-3 font-sans text-body-sm text-eco-gray-600">Tipografía body-md, mín. 2 líneas, 4s de duración (doc).</p>
      <div className="grid max-w-2xl gap-3">
        <div className="rounded-eco-md bg-eco-teal p-4 font-sans text-body-sm text-eco-white shadow-eco-md">
          Éxito: Tu reporte fue enviado. Un reciclador lo verá pronto.
        </div>
        <div className="rounded-eco-md bg-eco-danger p-4 font-sans text-body-sm text-eco-white shadow-eco-md">
          Error: No pudimos guardar tu reporte. Revisa tu conexión a internet e intenta de nuevo.
        </div>
        <div className="rounded-eco-md bg-eco-navy p-4 font-sans text-body-sm text-eco-white shadow-eco-md">
          Info: Tu solicitud está en cola para asignación.
        </div>
        <div className="rounded-eco-md bg-eco-yellow p-4 font-sans text-body-sm text-eco-navy shadow-eco-md">
          Advertencia: Hay demora estimada de 45 min en tu zona.
        </div>
      </div>

      <h3 className="mt-10 font-display text-h3 text-eco-navy">7.5 Estado vacío</h3>
      <div className="mt-3 flex max-w-md flex-col items-center rounded-eco-lg border border-eco-gray-200 bg-eco-white p-8 text-center shadow-eco-sm">
        <div className="h-40 w-40 rounded-full bg-gradient-to-br from-eco-teal/30 to-eco-lime/40" aria-hidden />
        <p className="mt-4 font-display text-h2 text-eco-navy">Sin reportes activos</p>
        <p className="mt-2 font-sans text-body text-eco-gray-700">
          Cuando envíes un reporte o solicitud, aparecerá aquí con el estado en tiempo real.
        </p>
        <button
          type="button"
          className="mt-6 inline-flex h-14 items-center rounded-eco-lg bg-eco-teal px-6 font-sans text-label text-eco-white shadow-eco-md"
        >
          Crear primera solicitud
        </button>
      </div>

      <p className="mt-6 font-sans text-caption text-eco-gray-500">
        Colores tomados de tokens: danger {colors.danger}, teal {colors.teal}, etc.
      </p>
    </DsSection>
  );
}
