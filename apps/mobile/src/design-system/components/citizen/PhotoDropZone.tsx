import { Image, Pressable, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { Colors } from "../../tokens/colors";
import { EcoIcons } from "../../tokens/icons";
import { IconSize } from "../../tokens/iconSizes";
import { BorderRadius } from "../../tokens/radius";
import { Spacing } from "../../tokens/spacing";
import { Typography } from "../../tokens/typography";

type PhotoDropZoneProps = {
  uri?: string | null;
  onPress: () => void;
  label?: string;
  hint?: string;
};

/** §7.3 — zona de foto: borde punteado simulado (border dashed no en RN core → borde teal suave). */
export function PhotoDropZone({
  uri,
  onPress,
  label = "Agregar foto",
  hint = "Opcional · mejora la prioridad",
}: PhotoDropZoneProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={{
        minHeight: 120,
        borderRadius: BorderRadius.lg,
        borderWidth: 2,
        borderColor: Colors.teal,
        backgroundColor: uri ? Colors.white : "rgba(0,92,83,0.06)",
        overflow: "hidden",
        alignItems: "center",
        justifyContent: "center",
        padding: Spacing.s4,
      }}
    >
      {uri ? (
        <Image source={{ uri }} style={{ width: "100%", height: 160, borderRadius: BorderRadius.md }} resizeMode="cover" />
      ) : (
        <>
          <MaterialCommunityIcons name={EcoIcons.camera} size={IconSize.xl} color={Colors.teal} />
          <Text style={[Typography.labelMd, { color: Colors.navy, marginTop: Spacing.s2 }]}>{label}</Text>
          <Text style={[Typography.caption, { color: Colors.gray500, marginTop: Spacing.s1 }]}>{hint}</Text>
        </>
      )}
    </Pressable>
  );
}
