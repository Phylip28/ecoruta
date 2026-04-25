import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { Colors } from "../../tokens/colors";
import { EcoIcons } from "../../tokens/icons";
import { IconSize } from "../../tokens/iconSizes";
import { Opacity } from "../../tokens/motion";
import { BorderRadius } from "../../tokens/radius";
import { Shadows } from "../../tokens/shadows";
import { Spacing, touchTarget } from "../../tokens/spacing";
import { Typography } from "../../tokens/typography";

export type CitizenCTAVariant = "emergency" | "collection";

type CitizenCTAProps = {
  label: string;
  variant: CitizenCTAVariant;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
};

const variantStyle: Record<CitizenCTAVariant, { bg: string; fg: string; icon: keyof typeof MaterialCommunityIcons.glyphMap }> = {
  emergency: { bg: Colors.danger, fg: Colors.white, icon: EcoIcons.emergency },
  collection: { bg: Colors.teal, fg: Colors.white, icon: EcoIcons.collection },
};

/**
 * §7.1 — CTA ciudadano: 64dp, radius-lg, shadow-md, gap ícono 12px, padding H 24px.
 * Estados: pressed opacity 0.85 + scale 0.97; disabled sage + gray-500 sin sombra.
 */
export function CitizenCTA({ label, variant, onPress, disabled = false, loading = false }: CitizenCTAProps) {
  const v = variantStyle[variant];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: disabled ? Colors.sage : v.bg,
          opacity: pressed && !disabled ? Opacity.pressed : 1,
          transform: pressed && !disabled ? [{ scale: 0.97 }] : undefined,
          shadowOpacity: disabled ? 0 : Shadows.md.shadowOpacity,
          elevation: disabled ? 0 : Shadows.md.elevation,
        },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={v.fg} />
      ) : (
        <>
          <MaterialCommunityIcons name={v.icon} size={IconSize.xl} color={disabled ? Colors.gray500 : v.fg} />
          <Text style={[Typography.labelLg, { color: disabled ? Colors.gray500 : v.fg, marginLeft: Spacing.s3 }]}>
            {label}
          </Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: touchTarget.ctaCitizenPrimary,
    paddingHorizontal: Spacing.s6,
    borderRadius: BorderRadius.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.md,
  },
});
