import { Image, type StyleProp, type ImageStyle } from "react-native";

const logoSource = require("../../assets/logo.png");

type EcoLogoProps = {
  /**
   * Alto del área útil (px). Con `resizeMode="contain"`, si el ancho es muy pequeño
   * la marca vertical se escala al ancho y casi no se ve; por eso el ancho por defecto
   * es ~2.6× el alto salvo que pases `width`.
   */
  height?: number;
  /** Ancho del área útil (px). Opcional; por defecto se elige para lockups verticales. */
  width?: number;
  style?: StyleProp<ImageStyle>;
  accessibilityLabel?: string;
};

export function EcoLogo({
  height = 52,
  width: widthProp,
  style,
  accessibilityLabel = "EcoRuta, movilidad sostenible en Medellín",
}: EcoLogoProps) {
  const boxHeight = height;
  const boxWidth = widthProp ?? Math.round(height * 2.65);

  return (
    <Image
      source={logoSource}
      style={[{ width: boxWidth, height: boxHeight }, style]}
      resizeMode="contain"
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="image"
    />
  );
}
