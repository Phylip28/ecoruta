import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, spacing } from "../../../theme/tokens";
import type { EstadoSolicitud, Solicitud } from "../types";

type SolicitudCardProps = {
  solicitud: Solicitud;
  onEstado: (solicitudId: number, estado: EstadoSolicitud) => void;
  disabled?: boolean;
};

const estadoColor: Record<EstadoSolicitud, string> = {
  pendiente: colors.warning,
  en_camino: colors.accent,
  completado: colors.deepGreen,
};

export function SolicitudCard({
  solicitud,
  onEstado,
  disabled = false,
}: SolicitudCardProps) {
  const puedeEnCamino = solicitud.estado === "pendiente";
  const puedeCompletar = solicitud.estado === "en_camino";

  return (
    <View style={styles.card}>
      <View style={[styles.estadoBadge, { backgroundColor: estadoColor[solicitud.estado] }]}>
        <Text style={styles.estadoText}>{solicitud.estado}</Text>
      </View>

      <Text style={styles.title}>Solicitud #{solicitud.id}</Text>
      <Text style={styles.meta}>
        Material: {solicitud.material ?? "mixto"} | KG: {solicitud.kg_estimados}
      </Text>
      <Text style={styles.meta}>
        Lat/Lon: {solicitud.latitud.toFixed(4)}, {solicitud.longitud.toFixed(4)}
      </Text>
      <Text style={styles.desc}>{solicitud.descripcion ?? "Sin descripcion"}</Text>

      <View style={styles.actions}>
        <Pressable
          disabled={disabled || !puedeEnCamino}
          onPress={() => onEstado(solicitud.id, "en_camino")}
          style={({ pressed }) => [
            styles.button,
            styles.primary,
            (disabled || !puedeEnCamino) && styles.buttonDisabled,
            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={styles.primaryText}>Pasar a en_camino</Text>
        </Pressable>

        <Pressable
          disabled={disabled || !puedeCompletar}
          onPress={() => onEstado(solicitud.id, "completado")}
          style={({ pressed }) => [
            styles.button,
            styles.secondary,
            (disabled || !puedeCompletar) && styles.buttonDisabled,
            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={styles.secondaryText}>Marcar completado</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: spacing.md,
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: colors.outline,
  },
  estadoBadge: {
    alignSelf: "flex-start",
    borderRadius: 999,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  estadoText: {
    color: "#FFFFFF",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    fontWeight: "700",
  },
  title: {
    color: colors.textDark,
    fontWeight: "700",
    fontSize: 16,
  },
  meta: {
    color: colors.textMuted,
    fontSize: 12,
  },
  desc: {
    color: colors.textDark,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: spacing.xs,
  },
  actions: {
    flexDirection: "row",
    gap: spacing.xs,
  },
  button: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  primary: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  secondary: {
    backgroundColor: "#FFFFFF",
    borderColor: colors.outline,
  },
  primaryText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  secondaryText: {
    color: colors.textDark,
    fontSize: 12,
    fontWeight: "700",
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonDisabled: {
    opacity: 0.45,
  },
});
