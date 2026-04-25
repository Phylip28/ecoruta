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

/** Alturas mínimas de toque — §4.4 y §7.1 (CTA principal ciudadano 64dp según tabla §7.1) */
export const touchTarget = {
  /** §7.1 botón CTA emergencia / recolección ciudadano */
  ctaCitizenPrimary: 64,
  /** §4.4 botón principal ciudadano (otros CTAs secundarios) */
  ctaCiudadano: 56,
  ctaReciclador: 64,
  secondaryButton: 48,
  listItem: 64,
  tabBar: 56,
  chip: 28,
  chipAction: 40,
  input: 52,
} as const;
