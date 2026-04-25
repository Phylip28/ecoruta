import { colors } from "./colors";

/**
 * Intensidad heatmap admin — sección 9.3
 * Alta (10+): danger → yellow; Media (5–9): yellow → lime; Baja (1–4): lime → teal
 */
export function heatColorByReportCount(count: number): string {
  if (count >= 10) return colors.danger;
  if (count >= 5) return colors.yellow;
  if (count >= 1) return colors.lime;
  return colors.teal;
}

/** Gradiente por peso normalizado (proxy de densidad hasta heatmap real) */
export function heatColorByWeight(peso: number, maxPeso = 10): string {
  const t = Math.min(Math.max(peso / maxPeso, 0), 1);
  if (t >= 0.66) return colors.danger;
  if (t >= 0.4) return colors.yellow;
  if (t >= 0.15) return colors.lime;
  return colors.teal;
}
