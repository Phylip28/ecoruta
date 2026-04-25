import { Pressable, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { Colors } from "../../tokens/colors";
import { IconSize } from "../../tokens/iconSizes";
import { BorderRadius } from "../../tokens/radius";
import { Spacing, touchTarget } from "../../tokens/spacing";
import { Typography } from "../../tokens/typography";

export type MaterialChipOption = {
  id: string;
  label: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
};

type MaterialChipsRowProps = {
  options: MaterialChipOption[];
  selectedId: string;
  onSelect: (id: string) => void;
};

/** §7.3 — chips de material: seleccionado teal+white; no seleccionado gris + borde. */
export function MaterialChipsRow({ options, selectedId, onSelect }: MaterialChipsRowProps) {
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: Spacing.s2 }}>
      {options.map((opt) => {
        const selected = opt.id === selectedId;
        return (
          <Pressable
            key={opt.id}
            onPress={() => onSelect(opt.id)}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            style={{
              minHeight: touchTarget.chipAction,
              flexDirection: "row",
              alignItems: "center",
              gap: Spacing.s2,
              paddingHorizontal: Spacing.s4,
              paddingVertical: Spacing.s3,
              borderRadius: BorderRadius.full,
              backgroundColor: selected ? Colors.teal : Colors.gray100,
              borderWidth: selected ? 0 : 1,
              borderColor: selected ? "transparent" : Colors.gray300,
            }}
          >
            <MaterialCommunityIcons
              name={opt.icon}
              size={IconSize.lg}
              color={selected ? Colors.white : Colors.gray700}
            />
            <Text style={[Typography.labelMd, { color: selected ? Colors.white : Colors.gray700 }]}>{opt.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
