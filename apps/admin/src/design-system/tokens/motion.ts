/** Duración animaciones — sección 6.4 */

export const duration = {
  fast: "100ms",
  normal: "200ms",
  slow: "350ms",
  deliberate: "500ms",
} as const;

export const easing = {
  easeOut: "cubic-bezier(0, 0, 0.2, 1)",
  easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
} as const;
