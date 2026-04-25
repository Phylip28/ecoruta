/**
 * Design system EcoRuta (tokens TS + tipografía con fuentes cargadas en App).
 * Estilos utilitarios Tailwind / NativeWind: raíz `tailwind.config.js` + `global.css`
 * (misma paleta `eco.*`; duplicación intencional para Metro).
 */
export {
  Colors,
  navyAlpha,
  tealAlpha,
  type EcoColorName,
} from "./tokens/colors";
export { Spacing, touchTarget } from "./tokens/spacing";
export { BorderRadius } from "./tokens/radius";
export { Shadows } from "./tokens/shadows";
export { Duration, Opacity } from "./tokens/motion";
export { IconSize } from "./tokens/iconSizes";
export { Typography } from "./tokens/typography";
export { EcoIcons } from "./tokens/icons";
export { chartColors } from "./tokens/chartColors";
export { FontFamily } from "./fonts";
