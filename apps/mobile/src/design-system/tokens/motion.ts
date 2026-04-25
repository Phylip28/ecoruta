/** Duración y opacidades — secciones 6.3 y 6.4 */

export const Duration = {
  fast: 100,
  normal: 200,
  slow: 350,
  deliberate: 500,
} as const;

export const Opacity = {
  disabled: 0.38,
  overlay: 0.72,
  hint: 0.6,
  pressed: 0.85,
} as const;
