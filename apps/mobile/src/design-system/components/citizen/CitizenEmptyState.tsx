import { Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Button } from "react-native-paper";

import { Colors } from "../../tokens/colors";
import { IconSize } from "../../tokens/iconSizes";
import { BorderRadius } from "../../tokens/radius";
import { Spacing } from "../../tokens/spacing";
import { Typography } from "../../tokens/typography";

type CitizenEmptyStateProps = {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
};

/** §7.7 — vacío ciudadano: ícono gris 500, título navy, cuerpo gris 700, CTA secundario. */
export function CitizenEmptyState({ icon, title, description, actionLabel, onAction }: CitizenEmptyStateProps) {
  return (
    <View
      style={{
        alignItems: "center",
        paddingVertical: Spacing.s8,
        paddingHorizontal: Spacing.s6,
        borderRadius: BorderRadius.lg,
        backgroundColor: Colors.gray50,
        borderWidth: 1,
        borderColor: Colors.gray200,
        gap: Spacing.s3,
      }}
    >
      <MaterialCommunityIcons name={icon} size={IconSize.xl + 8} color={Colors.gray500} />
      <Text style={[Typography.heading3, { color: Colors.navy, textAlign: "center" }]}>{title}</Text>
      <Text style={[Typography.bodyMd, { color: Colors.gray700, textAlign: "center" }]}>{description}</Text>
      {actionLabel && onAction ? (
        <Button mode="outlined" onPress={onAction} textColor={Colors.teal} style={{ marginTop: Spacing.s2 }}>
          {actionLabel}
        </Button>
      ) : null}
    </View>
  );
}
