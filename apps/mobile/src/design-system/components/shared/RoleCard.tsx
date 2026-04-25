import { Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { Colors } from "../../tokens/colors";
import { EcoIcons } from "../../tokens/icons";
import { IconSize } from "../../tokens/iconSizes";
import { BorderRadius } from "../../tokens/radius";
import { Shadows } from "../../tokens/shadows";
import { Spacing } from "../../tokens/spacing";
import { Typography } from "../../tokens/typography";

export type EcoRoleKind = "ciudadano" | "reciclador" | "admin";

const roleMeta: Record<
  EcoRoleKind,
  { title: string; subtitle: string; icon: keyof typeof MaterialCommunityIcons.glyphMap; accent: string }
> = {
  ciudadano: {
    title: "Ciudadano",
    subtitle: "Reportar y solicitar recolección",
    icon: EcoIcons.citizenRole,
    accent: Colors.teal,
  },
  reciclador: {
    title: "Reciclador",
    subtitle: "Rutas y confirmación de recolección",
    icon: EcoIcons.recyclerRole,
    accent: Colors.lime,
  },
  admin: {
    title: "Admin",
    subtitle: "Mapa de calor e impacto",
    icon: EcoIcons.adminRole,
    accent: Colors.navy,
  },
};

/** §10.1 — tarjeta de rol (selector / onboarding). */
export function RoleCard({ role }: { role: EcoRoleKind }) {
  const m = roleMeta[role];
  return (
    <View
      style={[
        {
          borderRadius: BorderRadius.lg,
          backgroundColor: Colors.white,
          padding: Spacing.s5,
          borderLeftWidth: 4,
          borderLeftColor: m.accent,
          gap: Spacing.s3,
        },
        Shadows.sm,
      ]}
    >
      <MaterialCommunityIcons name={m.icon} size={IconSize.xl} color={m.accent} />
      <Text style={[Typography.heading3, { color: Colors.navy }]}>{m.title}</Text>
      <Text style={[Typography.bodySm, { color: Colors.gray700 }]}>{m.subtitle}</Text>
    </View>
  );
}
