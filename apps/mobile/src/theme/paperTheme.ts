import { configureFonts, MD3LightTheme, type MD3Theme } from "react-native-paper";

import { FontFamily } from "../design-system/fonts";
import { BorderRadius } from "../design-system/tokens/radius";
import { Colors } from "../design-system/tokens/colors";

const fonts = configureFonts({
  config: {
    ...MD3LightTheme.fonts,
    bodyLarge: {
      ...MD3LightTheme.fonts.bodyLarge,
      fontFamily: FontFamily.dmSans400,
      fontSize: 17,
      lineHeight: 26,
    },
    bodyMedium: {
      ...MD3LightTheme.fonts.bodyMedium,
      fontFamily: FontFamily.dmSans400,
      fontSize: 15,
      lineHeight: 22,
    },
    bodySmall: {
      ...MD3LightTheme.fonts.bodySmall,
      fontFamily: FontFamily.dmSans400,
      fontSize: 13,
      lineHeight: 20,
    },
    labelLarge: {
      ...MD3LightTheme.fonts.labelLarge,
      fontFamily: FontFamily.dmSans700,
      fontSize: 16,
      lineHeight: 20,
    },
    labelMedium: {
      ...MD3LightTheme.fonts.labelMedium,
      fontFamily: FontFamily.dmSans700,
      fontSize: 14,
      lineHeight: 18,
    },
    labelSmall: {
      ...MD3LightTheme.fonts.labelSmall,
      fontFamily: FontFamily.dmSans500,
      fontSize: 12,
      lineHeight: 16,
    },
    titleLarge: {
      ...MD3LightTheme.fonts.titleLarge,
      fontFamily: FontFamily.sora700,
      fontSize: 22,
      lineHeight: 30,
    },
    titleMedium: {
      ...MD3LightTheme.fonts.titleMedium,
      fontFamily: FontFamily.sora600,
      fontSize: 18,
      lineHeight: 26,
    },
    headlineSmall: {
      ...MD3LightTheme.fonts.headlineSmall,
      fontFamily: FontFamily.dmMono500,
      fontSize: 20,
      lineHeight: 26,
    },
  },
});

export const ecoTheme: MD3Theme = {
  ...MD3LightTheme,
  fonts,
  roundness: BorderRadius.lg,
  colors: {
    ...MD3LightTheme.colors,
    primary: Colors.teal,
    onPrimary: Colors.white,
    primaryContainer: "#E6F4F1",
    onPrimaryContainer: Colors.navy,
    secondary: Colors.lime,
    onSecondary: Colors.navy,
    secondaryContainer: "#EDF7E1",
    onSecondaryContainer: Colors.navy,
    tertiary: Colors.yellow,
    onTertiary: Colors.navy,
    tertiaryContainer: "#FEFDE7",
    onTertiaryContainer: "#8A7600",
    error: Colors.danger,
    onError: Colors.white,
    errorContainer: "#FDECEA",
    onErrorContainer: Colors.danger,
    background: Colors.white,
    onBackground: Colors.gray900,
    surface: Colors.white,
    onSurface: Colors.gray900,
    surfaceVariant: Colors.gray100,
    onSurfaceVariant: Colors.gray700,
    outline: Colors.gray300,
    outlineVariant: Colors.gray200,
    inverseSurface: Colors.navy,
    inverseOnSurface: Colors.white,
    inversePrimary: Colors.lime,
    elevation: {
      ...MD3LightTheme.colors.elevation,
      level0: "transparent",
      level1: Colors.gray50,
      level2: Colors.gray100,
      level3: Colors.gray100,
      level4: Colors.gray100,
      level5: Colors.gray200,
    },
    surfaceDisabled: "rgba(17, 24, 39, 0.12)",
    onSurfaceDisabled: "rgba(17, 24, 39, 0.38)",
    backdrop: "rgba(4, 41, 64, 0.72)",
  },
};
