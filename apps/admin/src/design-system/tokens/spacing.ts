/** Escala base múltiplos de 4 — sección 4.1 */

export const space = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
} as const;

/** Grid admin — sección 4.3 */
export const adminLayout = {
  sidebarWidthXl: 260,
  sidebarWidthLg: 240,
  headerHeight: 64,
  contentMaxWidth: 1440,
  gutter: 24,
  marginH: 32,
} as const;
