import { Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { Colors } from "../../tokens/colors";
import { IconSize } from "../../tokens/iconSizes";
import { BorderRadius } from "../../tokens/radius";
import { Spacing } from "../../tokens/spacing";
import { Typography } from "../../tokens/typography";

export type FeedbackVariant = "success" | "error" | "warning" | "info";

const feedbackStyle: Record<
  FeedbackVariant,
  { bg: string; border: string; fg: string; icon: keyof typeof MaterialCommunityIcons.glyphMap }
> = {
  success: { bg: "#EDF7E1", border: Colors.lime, fg: "#4A6B1A", icon: "check-circle" },
  error: { bg: "#FDECEA", border: Colors.danger, fg: "#D94F3D", icon: "alert-circle" },
  warning: { bg: "#FEFDE7", border: Colors.yellow, fg: "#8A7600", icon: "alert" },
  info: { bg: "#E6F4F1", border: Colors.teal, fg: Colors.teal, icon: "information" },
};

/** §7.8 / feedback global — banner inline (no toast). */
export function FeedbackBanner({ variant, title, message }: { variant: FeedbackVariant; title: string; message: string }) {
  const s = feedbackStyle[variant];
  return (
    <View
      style={{
        flexDirection: "row",
        gap: Spacing.s3,
        padding: Spacing.s4,
        borderRadius: BorderRadius.md,
        backgroundColor: s.bg,
        borderWidth: 1,
        borderColor: s.border,
      }}
    >
      <MaterialCommunityIcons name={s.icon} size={IconSize.md} color={s.fg} />
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={[Typography.labelMd, { color: s.fg }]}>{title}</Text>
        <Text style={[Typography.bodySm, { color: Colors.gray700, marginTop: Spacing.s1 }]}>{message}</Text>
      </View>
    </View>
  );
}
