import { Image, Pressable, Text, View } from "react-native";

import { Colors, tableEstadoBadges, tableTypeBadges } from "../../tokens/colors";
import { BorderRadius } from "../../tokens/radius";
import { Shadows } from "../../tokens/shadows";
import { Spacing } from "../../tokens/spacing";
import { Typography } from "../../tokens/typography";

export type CitizenReportTipo = "emergencia" | "solicitud";
export type CitizenReportEstado = "pendiente" | "en_camino" | "completado";

type CitizenReportCardProps = {
  id: string;
  fechaLabel: string;
  tipo: CitizenReportTipo;
  estado: CitizenReportEstado;
  materialLabel?: string;
  descripcion?: string;
  miniaturaUri?: string | null;
  onPress?: () => void;
};

const estadoEtiqueta: Record<CitizenReportEstado, string> = {
  pendiente: "Pendiente",
  en_camino: "En camino",
  completado: "Completado",
};

const tipoEtiqueta: Record<CitizenReportTipo, string> = {
  emergencia: "Emergencia",
  solicitud: "Solicitud",
};

/** §7.3 — tarjeta de reporte ciudadano (badges alineados con admin §9.4). */
export function CitizenReportCard({
  id,
  fechaLabel,
  tipo,
  estado,
  materialLabel,
  descripcion,
  miniaturaUri,
  onPress,
}: CitizenReportCardProps) {
  const tipoBadge = tableTypeBadges[tipo === "emergencia" ? "emergencia" : "solicitud"];
  const estadoBadge = tableEstadoBadges[estado];

  const inner = (
    <>
      <View style={{ flexDirection: "row", gap: Spacing.s3 }}>
        <View
          style={{
            width: 64,
            height: 64,
            borderRadius: BorderRadius.md,
            backgroundColor: Colors.gray200,
            overflow: "hidden",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {miniaturaUri ? (
            <Image source={{ uri: miniaturaUri }} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
          ) : (
            <Text style={[Typography.caption, { color: Colors.gray500 }]}>Sin foto</Text>
          )}
        </View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={Typography.heading3}>#{id}</Text>
          <Text style={[Typography.caption, { color: Colors.gray700 }]}>{fechaLabel}</Text>
        </View>
      </View>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: Spacing.s2 }}>
        <View style={{ borderRadius: BorderRadius.full, paddingHorizontal: Spacing.s3, paddingVertical: Spacing.s1, backgroundColor: tipoBadge.bg }}>
          <Text style={[Typography.labelMd, { color: tipoBadge.text }]}>{tipoEtiqueta[tipo]}</Text>
        </View>
        <View style={{ borderRadius: BorderRadius.full, paddingHorizontal: Spacing.s3, paddingVertical: Spacing.s1, backgroundColor: estadoBadge.bg }}>
          <Text style={[Typography.labelMd, { color: estadoBadge.text }]}>{estadoEtiqueta[estado]}</Text>
        </View>
      </View>

      {materialLabel ? (
        <Text style={[Typography.bodySm, { color: Colors.gray700 }]}>
          <Text style={Typography.labelMd}>Material: </Text>
          {materialLabel}
        </Text>
      ) : null}
      {descripcion ? (
        <Text style={[Typography.bodySm, { color: Colors.navy }]} numberOfLines={3}>
          {descripcion}
        </Text>
      ) : null}
    </>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        style={[
          {
            borderRadius: BorderRadius.lg,
            backgroundColor: Colors.white,
            padding: Spacing.s4,
            gap: Spacing.s3,
            borderWidth: 1,
            borderColor: Colors.gray200,
          },
          Shadows.sm,
        ]}
      >
        {inner}
      </Pressable>
    );
  }

  return (
    <View
      style={[
        {
          borderRadius: BorderRadius.lg,
          backgroundColor: Colors.white,
          padding: Spacing.s4,
          gap: Spacing.s3,
          borderWidth: 1,
          borderColor: Colors.gray200,
        },
        Shadows.sm,
      ]}
    >
      {inner}
    </View>
  );
}
