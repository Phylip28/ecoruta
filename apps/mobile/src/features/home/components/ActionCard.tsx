import { Pressable, StyleSheet, Text, View } from "react-native";

import {
  BorderRadius,
  Colors,
  Shadows,
  Spacing,
  Typography,
} from "../../../design-system";

type ActionCardProps = {
  title: string;
  description: string;
  tone: "normal" | "warning" | "danger";
  onPress?: () => void;
};

export function ActionCard({ title, description, tone, onPress }: ActionCardProps) {
  const stripeColor =
    tone === "danger"
      ? Colors.danger
      : tone === "warning"
        ? Colors.warning
        : Colors.teal;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        Shadows.md,
        pressed ? { opacity: 0.85, transform: [{ scale: 0.97 }] } : null,
      ]}
    >
      <View style={[styles.stripe, { backgroundColor: stripeColor }]} />
      <View style={styles.content}>
        <Text style={[Typography.heading3, { color: Colors.navy }]}>{title}</Text>
        <Text style={[Typography.bodySm, { color: Colors.gray700 }]}>{description}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.white,
    overflow: "hidden",
    flexDirection: "row",
    marginBottom: Spacing.s4,
  },
  stripe: {
    width: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.s6,
    paddingVertical: Spacing.s6,
    gap: Spacing.s2,
  },
});
