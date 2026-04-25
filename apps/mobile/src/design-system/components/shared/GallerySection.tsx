import type { ReactNode } from "react";
import { Text, View } from "react-native";

import { Colors } from "../../tokens/colors";
import { BorderRadius } from "../../tokens/radius";
import { Shadows } from "../../tokens/shadows";
import { Spacing } from "../../tokens/spacing";
import { Typography } from "../../tokens/typography";

type GallerySectionProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export function GallerySection({ title, subtitle, children }: GallerySectionProps) {
  return (
    <View
      style={[
        {
          borderRadius: BorderRadius.lg,
          backgroundColor: Colors.white,
          padding: Spacing.s6,
          borderWidth: 1,
          borderColor: Colors.gray200,
        },
        Shadows.md,
      ]}
    >
      <Text style={[Typography.heading3, { color: Colors.navy }]}>{title}</Text>
      {subtitle ? (
        <Text style={[Typography.bodySm, { color: Colors.gray700, marginTop: Spacing.s2 }]}>{subtitle}</Text>
      ) : null}
      <View style={{ marginTop: Spacing.s4, gap: Spacing.s4 }}>{children}</View>
    </View>
  );
}
