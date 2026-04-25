import { Pressable, StyleSheet, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text } from "react-native-paper";

import { BorderRadius, Colors, FontFamily, Spacing } from "../../../design-system";
import type { Material } from "../../reciclador/types";

type MaterialSelectorGridProps = {
  value: Material;
  onChange: (material: Material) => void;
};

type MaterialOption = {
  key: Material;
  label: string;
  icon: string;
  accentColor: string;
  bgColor: string;
};

/** FE-03 — Selector visual táctil (≥48dp) con colores por material */
const OPCIONES: MaterialOption[] = [
  {
    key: "carton",
    label: "Cartón",
    icon: "package-variant-closed",
    accentColor: "#B45309",
    bgColor: "#FEF3C7",
  },
  {
    key: "plastico",
    label: "Plástico",
    icon: "bottle-soda-outline",
    accentColor: "#1D4ED8",
    bgColor: "#DBEAFE",
  },
  {
    key: "vidrio",
    label: "Vidrio",
    icon: "glass-fragile",
    accentColor: "#059669",
    bgColor: "#D1FAE5",
  },
  {
    key: "mixto",
    label: "Mixto",
    icon: "recycle",
    accentColor: Colors.teal,
    bgColor: `${Colors.teal}15`,
  },
];

export function MaterialSelectorGrid({ value, onChange }: MaterialSelectorGridProps) {
  return (
    <View style={styles.grid}>
      {OPCIONES.map((op) => {
        const selected = value === op.key;
        return (
          <Pressable
            key={op.key}
            onPress={() => onChange(op.key)}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            accessibilityLabel={`Material ${op.label}`}
            style={({ pressed }) => [
              styles.item,
              { borderColor: selected ? op.accentColor : Colors.gray200 },
              { backgroundColor: selected ? op.bgColor : Colors.white },
              pressed && { opacity: 0.85 },
            ]}
          >
            <MaterialCommunityIcons
              name={op.icon as any}
              size={26}
              color={selected ? op.accentColor : Colors.gray500}
            />
            <Text style={[
              styles.itemLabel,
              { color: selected ? op.accentColor : Colors.gray700 },
              selected && { fontFamily: FontFamily.dmSans700 },
            ]}>
              {op.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.s2,
  },
  item: {
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.s2,
    paddingVertical: Spacing.s3,
    paddingHorizontal: Spacing.s3,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    minHeight: 52,
  },
  itemLabel: {
    fontFamily: FontFamily.dmSans500,
    fontSize: 15,
  },
});
