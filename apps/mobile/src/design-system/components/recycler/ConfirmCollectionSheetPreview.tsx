import { Text, View } from "react-native";
import { Button, Checkbox } from "react-native-paper";

import { Colors } from "../../tokens/colors";
import { BorderRadius } from "../../tokens/radius";
import { Shadows } from "../../tokens/shadows";
import { Spacing } from "../../tokens/spacing";
import { Typography } from "../../tokens/typography";

type ConfirmCollectionSheetPreviewProps = {
  material: string;
  kilogramos: number;
  direccionResumida?: string;
};

/**
 * §8.3 — preview bottom sheet confirmación (solo layout; el sheet real lo maneja la pantalla).
 * Radio superior 24px, handle, título 22pt, subtítulo gris, checkbox, CTAs.
 */
export function ConfirmCollectionSheetPreview({
  material,
  kilogramos,
  direccionResumida = "Calle 45 #12-30",
}: ConfirmCollectionSheetPreviewProps) {
  return (
    <View
      style={[
        {
          borderTopLeftRadius: BorderRadius.xl,
          borderTopRightRadius: BorderRadius.xl,
          backgroundColor: Colors.white,
          paddingTop: Spacing.s3,
          paddingHorizontal: Spacing.s6,
          paddingBottom: Spacing.s6,
          gap: Spacing.s4,
        },
        Shadows.lg,
      ]}
    >
      <View style={{ alignSelf: "center", width: 40, height: 4, borderRadius: 2, backgroundColor: Colors.gray300 }} />
      <Text style={[Typography.heading2, { color: Colors.navy }]}>Confirmar recolección</Text>
      <Text style={[Typography.bodyMd, { color: Colors.gray700 }]}>
        {material} · {kilogramos} kg · {direccionResumida}
      </Text>
      <View style={{ flexDirection: "row", alignItems: "center", gap: Spacing.s3 }}>
        <Checkbox.Android status="checked" color={Colors.teal} />
        <Text style={[Typography.bodyMd, { color: Colors.navy, flex: 1 }]}>
          Confirmo que el material coincide con lo reportado
        </Text>
      </View>
      <View style={{ flexDirection: "row", gap: Spacing.s3 }}>
        <Button mode="outlined" style={{ flex: 1 }} textColor={Colors.teal}>
          Cancelar
        </Button>
        <Button mode="contained" style={{ flex: 1 }} buttonColor={Colors.teal} textColor={Colors.white}>
          Confirmar
        </Button>
      </View>
    </View>
  );
}
