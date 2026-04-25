import { Text, View } from "react-native";

import { Colors } from "../../tokens/colors";
import { BorderRadius } from "../../tokens/radius";
import { Spacing } from "../../tokens/spacing";
import { Typography } from "../../tokens/typography";

const pinColors = {
  pendiente: Colors.danger,
  enCamino: Colors.teal,
  completado: Colors.lime,
} as const;

/** §8.2 — leyenda de pines mapa reciclador. */
export function MapPinSpecRow() {
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: Spacing.s4, alignItems: "center" }}>
      {(
        [
          ["pendiente", "Pendiente / Emergencia", pinColors.pendiente],
          ["enCamino", "En camino", pinColors.enCamino],
          ["completado", "Completado", pinColors.completado],
        ] as const
      ).map(([key, label, color]) => (
        <View key={key} style={{ flexDirection: "row", alignItems: "center", gap: Spacing.s2 }}>
          <View
            style={{
              width: 14,
              height: 14,
              borderRadius: BorderRadius.full,
              backgroundColor: color,
              borderWidth: key === "completado" ? 1 : 0,
              borderColor: Colors.navy,
            }}
          />
          <Text style={[Typography.caption, { color: Colors.gray700 }]}>{label}</Text>
        </View>
      ))}
    </View>
  );
}
