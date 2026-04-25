/**
 * Design system EcoRuta (tokens TypeScript).
 * Utilidades Tailwind: `tailwind.config.ts` (importa `./tokens/colors`) + `src/styles.css`.
 */
export { colors, chartColors, tableTypeBadges, tableEstadoBadges, navyAlpha, tealAlpha } from "./tokens/colors";
export type { EcoColorKey } from "./tokens/colors";
export { space, adminLayout } from "./tokens/spacing";
export { radius } from "./tokens/radius";
export { duration, easing } from "./tokens/motion";
export { heatColorByReportCount, heatColorByWeight } from "./tokens/heatmap";
