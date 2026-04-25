import type { TextStyle } from "react-native";

import { FontFamily } from "../fonts";

/** Escala tipográfica mobile — sección 3.2 */

export const Typography: Record<string, TextStyle> = {
  display: {
    fontFamily: FontFamily.sora800,
    fontSize: 32,
    lineHeight: 40,
  },
  heading1: {
    fontFamily: FontFamily.sora700,
    fontSize: 28,
    lineHeight: 36,
  },
  heading2: {
    fontFamily: FontFamily.sora700,
    fontSize: 22,
    lineHeight: 30,
  },
  heading3: {
    fontFamily: FontFamily.sora600,
    fontSize: 18,
    lineHeight: 26,
  },
  bodyLg: {
    fontFamily: FontFamily.dmSans400,
    fontSize: 17,
    lineHeight: 26,
  },
  bodyMd: {
    fontFamily: FontFamily.dmSans400,
    fontSize: 15,
    lineHeight: 22,
  },
  bodySm: {
    fontFamily: FontFamily.dmSans400,
    fontSize: 13,
    lineHeight: 20,
  },
  labelLg: {
    fontFamily: FontFamily.dmSans700,
    fontSize: 16,
    lineHeight: 20,
  },
  labelMd: {
    fontFamily: FontFamily.dmSans700,
    fontSize: 14,
    lineHeight: 18,
  },
  caption: {
    fontFamily: FontFamily.dmSans500,
    fontSize: 12,
    lineHeight: 16,
  },
  metric: {
    fontFamily: FontFamily.dmMono500,
    fontSize: 28,
    lineHeight: 34,
  },
  metricSm: {
    fontFamily: FontFamily.dmMono500,
    fontSize: 20,
    lineHeight: 26,
  },
};
