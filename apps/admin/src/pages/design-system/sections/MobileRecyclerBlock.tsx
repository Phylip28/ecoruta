import { Check, Leaf, Recycle } from "lucide-react";

import { colors, tealAlpha } from "../../../design-system";
import { DsSection } from "./DsSection";

export function MobileRecyclerBlock() {
  return (
    <DsSection
      id="mobile-reciclador"
      title="8. Componentes — Mobile (Reciclador)"
      subtitle="§8.1 Panel de ruta activa, §8.3 bottom sheet, §8.4 widget kg, §8.5 estados de punto."
    >
      <h3 className="font-display text-h3 text-eco-navy">8.1 Panel de ruta activa (especificación)</h3>
      <div className="mt-4 max-w-2xl overflow-hidden rounded-t-[24px] bg-eco-navy shadow-eco-xl">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
          <span className="font-sans text-caption uppercase tracking-wide text-eco-sage">Próximo punto</span>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-eco-yellow" />
            <span className="h-2 w-2 rounded-full bg-eco-yellow" />
            <span className="h-2 w-2 rounded-full bg-eco-yellow" />
            <span className="h-2 w-2 rounded-full bg-eco-gray-700" />
            <span className="h-2 w-2 rounded-full bg-eco-gray-700" />
            <span className="ml-2 font-sans text-caption text-eco-sage">3 de 5</span>
          </div>
        </div>
        <div className="px-4 py-3">
          <div className="flex items-start justify-between gap-2">
            <p className="max-w-[70%] font-display text-h3 text-eco-white">Cra. 70 # 45-23, Laureles</p>
            <p className="font-mono text-metric-md text-eco-yellow">350m</p>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            <span
              className="rounded-full px-2 py-0.5 font-sans text-caption text-eco-white"
              style={{ backgroundColor: tealAlpha(0.35) }}
            >
              Plástico
            </span>
            <span
              className="rounded-full px-2 py-0.5 font-sans text-caption text-eco-white"
              style={{ backgroundColor: tealAlpha(0.35) }}
            >
              Cartón
            </span>
          </div>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              className="inline-flex h-16 flex-1 items-center justify-center gap-2 rounded-eco-lg bg-eco-yellow font-sans text-label text-eco-black shadow-eco-md"
            >
              <Check className="h-6 w-6" aria-hidden />
              Ya llegué
            </button>
            <button
              type="button"
              className="inline-flex h-16 flex-1 items-center justify-center rounded-eco-lg border border-eco-sage bg-transparent font-sans text-label text-eco-sage"
            >
              Saltar →
            </button>
          </div>
          <div className="mt-4">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-eco-gray-700">
              <div className="h-full w-2/3 rounded-full bg-eco-lime" />
            </div>
            <p className="mt-2 font-mono text-metric text-eco-yellow">12.5 kg</p>
            <p className="font-sans text-caption text-eco-sage">Recolectado hoy</p>
          </div>
        </div>
      </div>

      <h3 className="mt-10 font-display text-h3 text-eco-navy">8.2 Pins de mapa (leyenda)</h3>
      <div className="mt-3 flex flex-wrap gap-6">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-11 items-center justify-center rounded-b-3xl bg-eco-yellow shadow-eco-md ring-2 ring-eco-navy">
            <Recycle className="h-4 w-4 text-eco-navy" />
          </div>
          <p className="mt-2 font-sans text-caption text-eco-gray-600">Pendiente</p>
        </div>
        <div className="text-center">
          <div className="mx-auto flex h-16 w-12 items-center justify-center rounded-b-3xl bg-eco-teal shadow-eco-md ring-2 ring-eco-yellow">
            <Recycle className="h-5 w-5 text-eco-white" />
          </div>
          <p className="mt-2 font-sans text-caption text-eco-gray-600">Siguiente en ruta</p>
        </div>
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center bg-eco-danger shadow-eco-sm [clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%)]">
            <span className="text-xs font-bold text-eco-white">!</span>
          </div>
          <p className="mt-2 font-sans text-caption text-eco-gray-600">Emergencia (hex)</p>
        </div>
        <div className="text-center">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border-2 border-eco-white bg-eco-lime shadow-eco-sm">
            <Check className="h-4 w-4 text-eco-white" strokeWidth={3} />
          </div>
          <p className="mt-2 font-sans text-caption text-eco-gray-600">Completado</p>
        </div>
      </div>

      <h3 className="mt-10 font-display text-h3 text-eco-navy">8.3 Bottom sheet — confirmación</h3>
      <div className="mt-3 max-w-md rounded-t-[24px] bg-eco-white p-5 shadow-eco-xl ring-1 ring-eco-gray-200">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-eco-gray-300" />
        <p className="font-display text-h3 text-eco-navy">Cra. 70 # 45-23</p>
        <p className="font-sans text-body-sm text-eco-gray-600">Solicitud de recolección</p>
        <p className="mt-4 font-sans text-body text-eco-gray-700">¿Cuánto material recolectaste?</p>
        <div className="mt-3 flex items-center justify-center gap-3">
          <button
            type="button"
            className="flex h-14 w-14 items-center justify-center rounded-full bg-eco-teal font-sans text-xl text-eco-white"
          >
            −
          </button>
          <span className="min-w-[100px] text-center font-mono text-metric-lg text-eco-navy">2.5 kg</span>
          <button
            type="button"
            className="flex h-14 w-14 items-center justify-center rounded-full bg-eco-teal font-sans text-xl text-eco-white"
          >
            +
          </button>
        </div>
        <button
          type="button"
          className="mt-6 flex h-16 w-full items-center justify-center rounded-eco-lg bg-eco-yellow font-sans text-label text-eco-black"
        >
          Confirmar recolección
        </button>
        <button type="button" className="mt-3 w-full font-sans text-sm font-bold text-eco-gray-500">
          Cancelar
        </button>
      </div>

      <h3 className="mt-10 font-display text-h3 text-eco-navy">8.4 Widget kg del día</h3>
      <div
        className="mt-3 inline-flex items-center gap-2 rounded-eco-xl px-3.5 py-2.5 shadow-eco-lg"
        style={{ backgroundColor: "rgba(4, 41, 64, 0.9)" }}
      >
        <Leaf className="h-[18px] w-[18px] text-eco-lime" aria-hidden />
        <div>
          <p className="font-mono text-metric-md text-eco-yellow">12.5 kg</p>
          <p className="font-sans text-caption text-eco-sage">hoy</p>
        </div>
      </div>

      <h3 className="mt-10 font-display text-h3 text-eco-navy">8.5 Cambio de estado (tarjeta)</h3>
      <div className="mt-3 grid max-w-3xl gap-3 md:grid-cols-3">
        <article className="rounded-eco-lg border border-eco-gray-200 bg-eco-white p-4 shadow-eco-sm">
          <p className="font-sans text-caption text-eco-gray-500">Pendiente</p>
          <p className="mt-2 font-sans text-body-sm text-eco-gray-800">Fondo blanco · botón teal 56dp (doc)</p>
          <button
            type="button"
            className="mt-3 flex h-14 w-full items-center justify-center rounded-eco-lg bg-eco-teal font-sans text-label text-eco-white"
          >
            En camino
          </button>
        </article>
        <article className="rounded-eco-lg border border-eco-teal/20 p-4 shadow-eco-sm" style={{ backgroundColor: tealAlpha(0.1) }}>
          <p className="font-sans text-caption text-eco-gray-500">En camino</p>
          <p className="mt-2 font-sans text-body-sm text-eco-gray-800">Fondo teal 10%</p>
          <button
            type="button"
            className="mt-3 flex h-16 w-full items-center justify-center rounded-eco-lg bg-eco-yellow font-sans text-label text-eco-black"
          >
            Confirmar llegada
          </button>
        </article>
        <article className="rounded-eco-lg border border-eco-lime/30 bg-[rgba(159,193,49,0.15)] p-4 shadow-eco-sm">
          <p className="font-sans text-caption text-eco-gray-500">Completado</p>
          <p className="mt-2 font-sans text-body-sm text-eco-gray-800">Fondo lima 15% · solo lectura</p>
        </article>
      </div>

      <p className="mt-4 font-sans text-caption text-eco-gray-500">Referencia de color navy: {colors.navy}</p>
    </DsSection>
  );
}
