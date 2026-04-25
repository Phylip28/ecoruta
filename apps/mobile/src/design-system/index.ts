/**
 * Design system EcoRuta (tokens TS + tipografía con fuentes cargadas en App).
 * Estilos utilitarios Tailwind / NativeWind: raíz `tailwind.config.js` + `global.css`
 * (misma paleta `eco.*`; duplicación intencional para Metro).
 */
export {
  Colors,
  navyAlpha,
  tealAlpha,
  tableEstadoBadges,
  tableTypeBadges,
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

export {
  ActiveRoutePanel,
  CitizenCTA,
  CitizenEmptyState,
  CitizenReportCard,
  CollectionDayBadge,
  ConfirmCollectionSheetPreview,
  ContextHelpBanner,
  FeedbackBanner,
  GallerySection,
  LocationReadonlyRow,
  MapPinSpecRow,
  MaterialChipsRow,
  PhotoDropZone,
  RecyclerStatePanel,
  ReportStatusBadge,
  RoleCard,
  SkeletonPlaceholder,
  type CitizenCTAVariant,
  type CitizenReportEstado,
  type CitizenReportTipo,
  type EcoRoleKind,
  type FeedbackVariant,
  type MaterialChipOption,
  type ReportUiStatus,
} from "./components";
