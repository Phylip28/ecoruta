import { Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { Colors } from "../../tokens/colors";
import { IconSize } from "../../tokens/iconSizes";
import { BorderRadius } from "../../tokens/radius";
import { Spacing } from "../../tokens/spacing";
import { Typography } from "../../tokens/typography";

type ContextHelpBannerProps = {
  title: string;
  body: string;
};

/** §7.6 — ayuda contextual: fondo sage 12%, borde lime 30%, ícono info teal. */
export function ContextHelpBanner({ title, body }: ContextHelpBannerProps) {
  return (
    <View
      style={{
        flexDirection: "row",
        gap: Spacing.s3,
        padding: Spacing.s4,
        borderRadius: BorderRadius.md,
        backgroundColor: "rgba(214,213,142,0.12)",
        borderWidth: 1,
        borderColor: "rgba(159,193,49,0.3)",
      }}
    >
      <MaterialCommunityIcons name="information-outline" size={IconSize.md} color={Colors.teal} />
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={[Typography.labelMd, { color: Colors.navy }]}>{title}</Text>
        <Text style={[Typography.bodySm, { color: Colors.gray700, marginTop: Spacing.s1 }]}>{body}</Text>
      </View>
    </View>
  );
}
