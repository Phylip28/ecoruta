/** EcoRuta — paleta base y semántica (Design System v1.0) */

export const Colors = {
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

export type EcoColorName = keyof typeof Colors;

export function navyAlpha(opacity: number): string {
  return `rgba(4,41,64,${opacity})`;
}

export function tealAlpha(opacity: number): string {
  return `rgba(0,92,83,${opacity})`;
}
