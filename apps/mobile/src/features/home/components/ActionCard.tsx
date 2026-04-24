import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, spacing } from "../../../theme/tokens";

type ActionCardProps = {
  title: string;
  description: string;
  tone: "normal" | "warning" | "danger";
  onPress?: () => void;
};

export function ActionCard({
  title,
  description,
  tone,
  onPress,
}: ActionCardProps) {
  const stripeColor =
    tone === "danger" ? colors.danger : tone === "warning" ? colors.warning : colors.accent;

  return (
    <Pressable onPress={onPress} style={styles.card}>
      <View style={[styles.stripe, { backgroundColor: stripeColor }]} />
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    backgroundColor: colors.card,
    overflow: "hidden",
    flexDirection: "row",
    marginBottom: spacing.md,
    shadowColor: "#000",
    shadowOpacity: 0.14,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  stripe: {
    width: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.xs,
  },
  title: {
    color: colors.textDark,
    fontSize: 17,
    fontWeight: "700",
  },
  description: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
  },
});
