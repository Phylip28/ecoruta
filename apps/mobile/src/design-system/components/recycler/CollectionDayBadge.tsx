import { Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { Colors } from "../../tokens/colors";
import { EcoIcons } from "../../tokens/icons";
import { IconSize } from "../../tokens/iconSizes";
import { BorderRadius } from "../../tokens/radius";
import { Spacing } from "../../tokens/spacing";
import { Typography } from "../../tokens/typography";

type CollectionDayBadgeProps = {
  kilogramos: number;
  etiqueta?: string;
};

/** §8.4 — widget kg del día: círculo lime, borde navy 2px, métrica mono. */
export function CollectionDayBadge({ kilogramos, etiqueta = "Recolectado hoy" }: CollectionDayBadgeProps) {
  return (
    <View style={{ alignItems: "center", gap: Spacing.s2 }}>
      <View
        style={{
          width: 112,
          height: 112,
          borderRadius: BorderRadius.full,
          backgroundColor: Colors.lime,
          borderWidth: 2,
          borderColor: Colors.navy,
          alignItems: "center",
          justifyContent: "center",
          gap: Spacing.s1,
        }}
      >
        <MaterialCommunityIcons name={EcoIcons.weight} size={IconSize.md} color={Colors.navy} />
        <Text style={[Typography.metric, { color: Colors.navy }]}>{kilogramos.toFixed(1)}</Text>
        <Text style={[Typography.caption, { color: Colors.navy }]}>kg</Text>
      </View>
      <Text style={[Typography.bodySm, { color: Colors.gray700, textAlign: "center" }]}>{etiqueta}</Text>
    </View>
  );
}
