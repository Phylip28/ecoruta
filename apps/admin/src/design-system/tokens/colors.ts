/** EcoRuta design system — paleta "Green Globe on Moss" (v1.0) */

export const colors = {
  navy: "#042940",
  teal: "#005C53",
  lime: "#9FC131",
  yellow: "#DBF227",
  sage: "#D6D58E",
  white: "#FFFFFF",
  black: "#0A0A0A",

  success: "#9FC131",
  warning: "#DBF227",
  danger: "#D94F3D",
  info: "#005C53",

  gray900: "#111827",
  gray700: "#374151",
  gray500: "#6B7280",
  gray300: "#D1D5DB",
  gray200: "#E5E7EB",
  gray100: "#F3F4F6",
  gray50: "#F9FAFB",
} as const;

export type EcoColorKey = keyof typeof colors;

export const chartColors = {
  primary: "#005C53",
  secondary: "#9FC131",
  accent: "#DBF227",
  muted: "#D6D58E",
  danger: "#D94F3D",
  grid: "#E5E7EB",
  text: "#6B7280",
} as const;

/** Badges tabla reportes — sección 9.4 */
export const tableTypeBadges = {
  emergencia: { bg: "#FDECEA", text: "#D94F3D" },
  recoleccion: { bg: "#E6F4F1", text: "#005C53" },
} as const;

export const tableEstadoBadges = {
  pendiente: { bg: "#FEFDE7", text: "#8A7600" },
  en_camino: { bg: "#EDF7E1", text: "#4A6B1A" },
  completado: { bg: "#E6F4F1", text: "#005C53" },
} as const;

export function navyAlpha(opacity: number): string {
  return `rgba(4,41,64,${opacity})`;
}

export function tealAlpha(opacity: number): string {
  return `rgba(0,92,83,${opacity})`;
}
