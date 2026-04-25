import { View } from "react-native";

import { Colors } from "../../tokens/colors";
import { BorderRadius } from "../../tokens/radius";

type SkeletonPlaceholderProps = {
  width?: number | `${number}%`;
  height: number;
  radius?: number;
};

/** §10.2 — bloque skeleton (animación opcional omitida en MVP). */
export function SkeletonPlaceholder({ width = "100%", height, radius = BorderRadius.md }: SkeletonPlaceholderProps) {
  return (
    <View
      style={{
        width: width as number | `${number}%`,
        height,
        borderRadius: radius,
        backgroundColor: Colors.gray200,
      }}
    />
  );
}
