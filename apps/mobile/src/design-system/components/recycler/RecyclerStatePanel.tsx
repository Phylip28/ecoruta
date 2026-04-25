import { Text, View } from "react-native";

import { Colors } from "../../tokens/colors";
import { BorderRadius } from "../../tokens/radius";
import { Spacing } from "../../tokens/spacing";
import { Typography } from "../../tokens/typography";

type RecyclerStatePanelProps = {
  pendientes: number;
  enRecoleccion: number;
  completados: number;
};

/** §8.5 — tarjetas resumen por estado (Pendiente / En recolección / Completado). */
export function RecyclerStatePanel({ pendientes, enRecoleccion, completados }: RecyclerStatePanelProps) {
  const items: { label: string; value: number; bg: string; border: string }[] = [
    { label: "Pendientes", value: pendientes, bg: "#FEFDE7", border: Colors.yellow },
    { label: "En recolección", value: enRecoleccion, bg: "rgba(214,213,142,0.35)", border: Colors.teal },
    { label: "Completados", value: completados, bg: "#E6F4F1", border: Colors.teal },
  ];

  return (
    <View style={{ flexDirection: "row", gap: Spacing.s2 }}>
      {items.map((item) => (
        <View
          key={item.label}
          style={{
            flex: 1,
            borderRadius: BorderRadius.md,
            padding: Spacing.s3,
            backgroundColor: item.bg,
            borderWidth: 1,
            borderColor: item.border,
            minHeight: 72,
            justifyContent: "center",
          }}
        >
          <Text style={[Typography.metricSm, { color: Colors.navy }]}>{item.value}</Text>
          <Text style={[Typography.caption, { color: Colors.gray700, marginTop: Spacing.s1 }]} numberOfLines={2}>
            {item.label}
          </Text>
        </View>
      ))}
    </View>
  );
}
