import { Text, View } from "react-native";

import { Colors } from "../../tokens/colors";
import { BorderRadius } from "../../tokens/radius";
import { Spacing } from "../../tokens/spacing";
import { Typography } from "../../tokens/typography";

export type ReportUiStatus = "pendiente" | "en_proceso" | "completado";

const config: Record<
  ReportUiStatus,
  { label: string; bg: string; border: string; text: string }
> = {
  pendiente: {
    label: "Pendiente",
    bg: Colors.gray100,
    border: Colors.gray300,
    text: Colors.navy,
  },
  en_proceso: {
    label: "En proceso",
    bg: "rgba(214,213,142,0.4)",
    border: Colors.teal,
    text: Colors.teal,
  },
  completado: {
    label: "Completado",
    bg: "rgba(159,193,49,0.12)",
    border: Colors.lime,
    text: Colors.navy,
  },
};

/** §7.5 — estados de reporte ciudadano (UI). */
export function ReportStatusBadge({ status }: { status: ReportUiStatus }) {
  const c = config[status];
  return (
    <View
      style={{
        alignSelf: "flex-start",
        paddingHorizontal: Spacing.s3,
        paddingVertical: Spacing.s1,
        borderRadius: BorderRadius.full,
        backgroundColor: c.bg,
        borderWidth: 1,
        borderColor: c.border,
      }}
    >
      <Text style={[Typography.labelMd, { color: c.text }]}>{c.label}</Text>
    </View>
  );
}
