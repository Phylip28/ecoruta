/** Escala múltiplos de 4 — sección 4.1 */

export const Spacing = {
  s1: 4,
  s2: 8,
  s3: 12,
  s4: 16,
  s5: 20,
  s6: 24,
  s8: 32,
  s10: 40,
  s12: 48,
  s16: 64,
} as const;

/** Alturas mínimas de toque — sección 4.4 */
export const touchTarget = {
  ctaCiudadano: 56,
  ctaReciclador: 64,
  secondaryButton: 48,
  listItem: 64,
  tabBar: 56,
  chip: 28,
  chipAction: 40,
  input: 52,
} as const;
