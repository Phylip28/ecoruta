import { Text, View } from "react-native";
import { Button } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { Colors } from "../../tokens/colors";
import { EcoIcons } from "../../tokens/icons";
import { IconSize } from "../../tokens/iconSizes";
import { BorderRadius } from "../../tokens/radius";
import { Shadows } from "../../tokens/shadows";
import { Spacing } from "../../tokens/spacing";
import { Typography } from "../../tokens/typography";

type ActiveRoutePanelProps = {
  titulo?: string;
  ordenParadas: string[];
  siguienteTitulo: string;
  siguienteDetalle: string;
  onNavigate?: () => void;
};

/** §8.1 — panel ruta activa: header navy, orden con ícono routes, siguiente parada destacada. */
export function ActiveRoutePanel({
  titulo = "Ruta activa",
  ordenParadas,
  siguienteTitulo,
  siguienteDetalle,
  onNavigate,
}: ActiveRoutePanelProps) {
  return (
    <View
      style={[
        {
          borderRadius: BorderRadius.lg,
          backgroundColor: Colors.white,
          padding: Spacing.s4,
          borderWidth: 1,
          borderColor: Colors.gray200,
          gap: Spacing.s4,
        },
        Shadows.md,
      ]}
    >
      <Text style={[Typography.heading3, { color: Colors.navy }]}>{titulo}</Text>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: Spacing.s2, alignItems: "center" }}>
        <MaterialCommunityIcons name={EcoIcons.routes} size={IconSize.md} color={Colors.teal} />
        {ordenParadas.map((label, i) => (
          <View key={`${label}-${i}`} style={{ flexDirection: "row", alignItems: "center", gap: Spacing.s2 }}>
            <View
              style={{
                minWidth: 28,
                height: 28,
                borderRadius: BorderRadius.full,
                backgroundColor: Colors.lime,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={[Typography.labelMd, { color: Colors.navy }]}>{i + 1}</Text>
            </View>
            <Text style={[Typography.bodySm, { color: Colors.gray700 }]}>{label}</Text>
            {i < ordenParadas.length - 1 ? (
              <Text style={[Typography.caption, { color: Colors.gray500 }]}>→</Text>
            ) : null}
          </View>
        ))}
      </View>

      <View style={{ height: 1, backgroundColor: Colors.gray200 }} />

      <View
        style={{
          borderRadius: BorderRadius.md,
          backgroundColor: "rgba(159,193,49,0.12)",
          borderWidth: 1,
          borderColor: Colors.lime,
          padding: Spacing.s4,
          gap: Spacing.s2,
        }}
      >
        <Text style={[Typography.labelMd, { color: Colors.teal }]}>{siguienteTitulo}</Text>
        <Text style={[Typography.bodyMd, { color: Colors.navy }]}>{siguienteDetalle}</Text>
      </View>

      {onNavigate ? (
        <Button mode="contained" buttonColor={Colors.teal} textColor={Colors.white} onPress={onNavigate}>
          Navegar
        </Button>
      ) : null}
    </View>
  );
}
