import { Bike, Shield, User } from "lucide-react";

import { DsSection } from "./DsSection";

export function SharedNavBlock() {
  return (
    <>
      <DsSection
        id="compartidos"
        title="10. Componentes compartidos"
        subtitle="§10.1 Selección de rol · §10.2 Skeleton (web) · §10.3–10.4 referencia breve."
      >
        <h3 className="font-display text-h3 text-eco-navy">10.1 Pantalla de selección de rol</h3>
        <p className="mb-4 font-sans text-body-sm text-eco-gray-600">
          Fondo navy · tarjetas 160×180 (aprox. en web con min-h) · radius-xl · teal + sombra lg · ícono en círculo amarillo 20%
          · texto heading-3 blanco · activo: borde 2px yellow + escala 1.03.
        </p>
        <div className="rounded-eco-xl bg-eco-navy p-8">
          <p className="text-center font-display text-h2 text-eco-white">EcoRuta Inteligente</p>
          <p className="mt-1 text-center font-sans text-body text-eco-sage">¿Quién eres hoy?</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {[
              { label: "Ciudadano", Icon: User },
              { label: "Reciclador", Icon: Bike },
              { label: "Admin", Icon: Shield },
            ].map((role) => (
              <button
                key={role.label}
                type="button"
                className="flex w-40 flex-col items-center rounded-eco-xl bg-eco-teal p-6 shadow-eco-lg transition hover:scale-[1.03] hover:ring-2 hover:ring-eco-yellow"
              >
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[rgba(219,242,39,0.2)]">
                  <role.Icon className="h-9 w-9 text-eco-yellow" aria-hidden />
                </span>
                <span className="mt-4 font-display text-h3 text-eco-white">{role.label}</span>
              </button>
            ))}
          </div>
        </div>

        <h3 className="mt-10 font-display text-h3 text-eco-navy">10.2 Skeleton (admin web)</h3>
        <p className="mb-3 font-sans text-body-sm text-eco-gray-600">
          Rectángulos gray-200 con pulso; shimmer en mobile 1400ms (doc §10.2). Aquí: animate-pulse.
        </p>
        <div className="max-w-lg space-y-3 rounded-eco-lg border border-eco-gray-200 bg-eco-white p-4">
          <div className="h-4 w-3/5 animate-pulse rounded-eco-sm bg-eco-gray-200" />
          <div className="h-4 w-full animate-pulse rounded-eco-sm bg-eco-gray-200" />
          <div className="h-24 w-full animate-pulse rounded-eco-md bg-eco-gray-200" />
        </div>

        <h3 className="mt-10 font-display text-h3 text-eco-navy">10.3 Bottom sheet / 10.4 Notificación in-app</h3>
        <p className="font-sans text-body-sm text-eco-gray-700">
          Bottom sheet: handle 40×4 gray-300, fondo blanco, radius superior xl, sombra xl, backdrop 72% negro. Banner in-app:
          72px alto, navy, ícono 24px yellow, texto blanco, descartable (doc §10.4).
        </p>
      </DsSection>

      <DsSection id="navegacion-admin" title="11.3 Admin — estructura de sidebar (referencia)" subtitle="Ítems del documento §11.3.">
        <ul className="grid gap-2 font-sans text-body-sm text-eco-gray-800 sm:grid-cols-2">
          {[
            "Dashboard",
            "Mapa de Calor",
            "Reportes",
            "Solicitudes",
            "Recicladores",
            "Estadísticas",
            "Configuración",
          ].map((item) => (
            <li key={item} className="flex items-center gap-2 rounded-eco-md border border-eco-gray-200 bg-eco-gray-50 px-3 py-2">
              <span className="h-2 w-2 rounded-full bg-eco-teal" />
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-3 font-sans text-caption text-eco-gray-500">Breadcrumb ejemplo: Dashboard › Reportes › Detalle #1234</p>
      </DsSection>
    </>
  );
}
