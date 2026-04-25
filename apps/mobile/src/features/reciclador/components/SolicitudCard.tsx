import { Pressable, StyleSheet, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ProgressBar, Surface, Text } from "react-native-paper";

import {
  BorderRadius,
  Colors,
  FontFamily,
  Shadows,
  Spacing,
  Typography,
  touchTarget,
} from "../../../design-system";
import type { EstadoSolicitud, Solicitud } from "../types";

type SolicitudCardProps = {
  solicitud: Solicitud;
  onEstado: (solicitudId: number, estado: EstadoSolicitud) => void;
  disabled?: boolean;
};

const ESTADO_CONFIG: Record<EstadoSolicitud, {
  label: string;
  progress: number;
  dotColor: string;
  bgColor: string;
  textColor: string;
}> = {
  pendiente: {
    label: "Pendiente",
    progress: 0.33,
    dotColor: Colors.yellow,
    bgColor: "#FEF9C3",
    textColor: "#854D0E",
  },
  en_camino: {
    label: "En camino",
    progress: 0.66,
    dotColor: Colors.lime,
    bgColor: "#F0FDF4",
    textColor: "#166534",
  },
  completado: {
    label: "Completado",
    progress: 1,
    dotColor: Colors.teal,
    bgColor: `${Colors.teal}15`,
    textColor: Colors.teal,
  },
};

const MATERIAL_ICONS: Record<string, string> = {
  carton: "package-variant-closed",
  plastico: "bottle-soda-outline",
  vidrio: "glass-fragile",
  mixto: "recycle",
};

/** FE-05 — estado Pendiente → En camino → Completado con feedback visual */
export function SolicitudCard({ solicitud, onEstado, disabled = false }: SolicitudCardProps) {
  const cfg = ESTADO_CONFIG[solicitud.estado];
  const puedeEnCamino = solicitud.estado === "pendiente" && !disabled;
  const puedeCompletar = solicitud.estado === "en_camino" && !disabled;
  const matIcon = MATERIAL_ICONS[solicitud.material ?? "mixto"] ?? "recycle";

  return (
    <Surface style={[styles.card, Shadows.sm]} elevation={0}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={[Typography.heading3, { color: Colors.navy }]}>
            Solicitud #{solicitud.id}
          </Text>
          <View style={styles.metaRow}>
            <MaterialCommunityIcons name={matIcon as any} size={14} color={Colors.gray500} />
            <Text style={styles.metaText}>
              {solicitud.material ?? "mixto"} · {solicitud.kg_estimados} kg
            </Text>
          </View>
        </View>
        {/* Estado badge */}
        <View style={[styles.estadoBadge, { backgroundColor: cfg.bgColor }]}>
          <View style={[styles.estadoDot, { backgroundColor: cfg.dotColor }]} />
          <Text style={[styles.estadoLabel, { color: cfg.textColor }]}>{cfg.label}</Text>
        </View>
      </View>

      {/* ── Progreso ── */}
      <View style={styles.progressSection}>
        <View style={styles.progressSteps}>
          {(["pendiente", "en_camino", "completado"] as EstadoSolicitud[]).map((step, i) => {
            const stepCfg = ESTADO_CONFIG[step];
            const active = solicitud.estado === step;
            const done = cfg.progress > stepCfg.progress || solicitud.estado === step;
            return (
              <View key={step} style={styles.progressStepWrap}>
                <View style={[
                  styles.progressStepDot,
                  { backgroundColor: done ? stepCfg.dotColor : Colors.gray300 },
                  active && styles.progressStepDotActive,
                ]} />
                <Text style={[styles.progressStepLabel, active && { color: Colors.navy }]}>
                  {stepCfg.label}
                </Text>
              </View>
            );
          })}
        </View>
        <ProgressBar
          progress={cfg.progress}
          color={cfg.dotColor}
          style={styles.progressBar}
        />
      </View>

      {/* ── Descripción + coords ── */}
      <View style={styles.details}>
        {solicitud.descripcion ? (
          <Text style={[Typography.bodyMd, { color: Colors.gray700 }]} numberOfLines={2}>
            {solicitud.descripcion}
          </Text>
        ) : null}
        <View style={styles.coordsRow}>
          <MaterialCommunityIcons name="map-marker-outline" size={14} color={Colors.gray500} />
          <Text style={styles.coordsText}>
            {solicitud.latitud.toFixed(4)}, {solicitud.longitud.toFixed(4)}
          </Text>
        </View>
      </View>

      {/* ── Acciones ── */}
      <View style={styles.actions}>
        <Pressable
          onPress={() => onEstado(solicitud.id, "en_camino")}
          disabled={!puedeEnCamino}
          style={({ pressed }) => [
            styles.actionBtn,
            { backgroundColor: Colors.teal },
            !puedeEnCamino && styles.actionBtnDisabled,
            pressed && puedeEnCamino && { opacity: 0.85 },
          ]}
          accessibilityRole="button"
          accessibilityLabel="Marcar en camino"
          accessibilityHint="Indica que vas en ruta hacia este punto"
          accessibilityState={{ disabled: !puedeEnCamino }}
        >
          <MaterialCommunityIcons name="navigation-variant" size={18} color={Colors.white} />
          <Text style={[styles.actionBtnLabel, { color: Colors.white }]}>Aceptar ruta</Text>
        </Pressable>

        <Pressable
          onPress={() => onEstado(solicitud.id, "completado")}
          disabled={!puedeCompletar}
          style={({ pressed }) => [
            styles.actionBtn,
            { backgroundColor: Colors.lime },
            !puedeCompletar && styles.actionBtnDisabled,
            pressed && puedeCompletar && { opacity: 0.85 },
          ]}
          accessibilityRole="button"
          accessibilityLabel="Completar servicio"
          accessibilityHint="Confirma que terminaste la recolección"
          accessibilityState={{ disabled: !puedeCompletar }}
        >
          <MaterialCommunityIcons name="check-circle-outline" size={18} color={Colors.navy} />
          <Text style={[styles.actionBtnLabel, { color: Colors.navy }]}>Completar</Text>
        </Pressable>
      </View>
    </Surface>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.white,
    overflow: "hidden",
    marginBottom: Spacing.s3,
  },

  // ── Header ──
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    padding: Spacing.s4,
    paddingBottom: Spacing.s2,
  },
  headerLeft: {
    flex: 1,
    gap: 3,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  metaText: {
    fontFamily: FontFamily.dmSans400,
    fontSize: 13,
    color: Colors.gray500,
  },
  estadoBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: Spacing.s2,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    marginLeft: Spacing.s2,
  },
  estadoDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  estadoLabel: {
    fontFamily: FontFamily.dmSans700,
    fontSize: 11,
  },

  // ── Progreso ──
  progressSection: {
    paddingHorizontal: Spacing.s4,
    gap: Spacing.s2,
  },
  progressSteps: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  progressStepWrap: {
    alignItems: "center",
    gap: 3,
  },
  progressStepDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  progressStepDotActive: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  progressStepLabel: {
    fontFamily: FontFamily.dmSans400,
    fontSize: 10,
    color: Colors.gray500,
  },
  progressBar: {
    height: 6,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.gray200,
  },

  // ── Details ──
  details: {
    paddingHorizontal: Spacing.s4,
    paddingTop: Spacing.s2,
    paddingBottom: Spacing.s2,
    gap: Spacing.s1,
  },
  coordsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  coordsText: {
    fontFamily: FontFamily.dmMono500,
    fontSize: 11,
    color: Colors.gray500,
  },

  // ── Actions ──
  actions: {
    flexDirection: "row",
    gap: Spacing.s2,
    padding: Spacing.s3,
    paddingTop: Spacing.s2,
    borderTopWidth: 1,
    borderTopColor: Colors.gray100,
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.s1,
    minHeight: touchTarget.ctaReciclador,
    borderRadius: BorderRadius.lg,
  },
  actionBtnDisabled: {
    opacity: 0.35,
  },
  actionBtnLabel: {
    fontFamily: FontFamily.dmSans700,
    fontSize: 14,
  },
});
