import { Pressable, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { Colors } from "../../tokens/colors";
import { EcoIcons } from "../../tokens/icons";
import { IconSize } from "../../tokens/iconSizes";
import { BorderRadius } from "../../tokens/radius";
import { Spacing, touchTarget } from "../../tokens/spacing";
import { Typography } from "../../tokens/typography";

type LocationReadonlyRowProps = {
  latitude: number;
  longitude: number;
  onChangePress?: () => void;
};

/** §7.4 — ubicación solo lectura con acción opcional. */
export function LocationReadonlyRow({ latitude, longitude, onChangePress }: LocationReadonlyRowProps) {
  const coordText = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;

  return (
    <View
      style={{
        minHeight: touchTarget.input,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: Spacing.s4,
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        borderColor: Colors.gray300,
        backgroundColor: Colors.gray50,
        gap: Spacing.s3,
      }}
    >
      <MaterialCommunityIcons name={EcoIcons.gps} size={IconSize.md} color={Colors.teal} />
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={[Typography.caption, { color: Colors.gray500 }]}>Ubicación</Text>
        <Text style={[Typography.bodyMd, { color: Colors.navy }]} numberOfLines={1}>
          {coordText}
        </Text>
      </View>
      {onChangePress ? (
        <Pressable onPress={onChangePress} accessibilityRole="button" accessibilityLabel="Cambiar ubicación">
          <Text style={[Typography.labelMd, { color: Colors.teal }]}>Cambiar</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
