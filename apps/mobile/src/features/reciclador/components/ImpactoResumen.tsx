import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Surface, Text } from "react-native-paper";

import {
  BorderRadius,
  Colors,
  FontFamily,
  Shadows,
  Spacing,
  Typography,
} from "../../../design-system";

type ImpactoResumenProps = {
  completadasSesion: number;
};

const KG_POR_SERVICIO = 2.8;
const CO2_POR_KG = 1.2;
const ARBOLES_POR_KG = 0.02;

type Nivel = { label: string; icon: string; color: string; minCompleted: number };

const NIVELES: Nivel[] = [
  { label: "Bronce", icon: "medal-outline", color: "#B45309", minCompleted: 0 },
  { label: "Plata",  icon: "medal",         color: Colors.gray500, minCompleted: 5 },
  { label: "Oro",    icon: "crown-outline",  color: "#D97706", minCompleted: 12 },
];

/** FE-07 — Gamificación: kg desviados, CO₂ evitado, árboles equivalentes, nivel */
export function ImpactoResumen({ completadasSesion }: ImpactoResumenProps) {
  const kg = useMemo(() => Number((completadasSesion * KG_POR_SERVICIO).toFixed(1)), [completadasSesion]);
  const co2 = useMemo(() => Number((kg * CO2_POR_KG).toFixed(1)), [kg]);
  const arboles = useMemo(() => Number((kg * ARBOLES_POR_KG).toFixed(1)), [kg]);

  const nivel = useMemo(() => {
    for (let i = NIVELES.length - 1; i >= 0; i--) {
      if (completadasSesion >= NIVELES[i].minCompleted) return NIVELES[i];
    }
    return NIVELES[0];
  }, [completadasSesion]);

  // Progreso hacia el siguiente nivel
  const nextNivel = NIVELES.find((n) => n.minCompleted > completadasSesion);
  const progressPct = nextNivel
    ? Math.min((completadasSesion / nextNivel.minCompleted), 1)
    : 1;

  return (
    <Surface style={[styles.card, Shadows.sm]} elevation={0}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerLabel}>Impacto de sesión</Text>
          <Text style={styles.headerSub}>
            {completadasSesion} {completadasSesion === 1 ? "servicio completado" : "servicios completados"}
          </Text>
        </View>
        {/* Nivel badge */}
        <View style={[styles.nivelBadge, { borderColor: nivel.color }]}>
          <MaterialCommunityIcons name={nivel.icon as any} size={16} color={nivel.color} />
          <Text style={[styles.nivelLabel, { color: nivel.color }]}>{nivel.label}</Text>
        </View>
      </View>

      {/* ── Progreso al siguiente nivel ── */}
      {nextNivel && (
        <View style={styles.nivelProgress}>
          <View style={styles.nivelProgressBar}>
            <View style={[styles.nivelProgressFill, { width: `${progressPct * 100}%`, backgroundColor: nivel.color }]} />
          </View>
          <Text style={styles.nivelProgressLabel}>
            {completadasSesion}/{nextNivel.minCompleted} para {nextNivel.label}
          </Text>
        </View>
      )}

      {/* ── Métricas ── */}
      <View style={styles.metricsRow}>
        <View style={styles.metricItem}>
          <View style={[styles.metricIcon, { backgroundColor: `${Colors.teal}15` }]}>
            <MaterialCommunityIcons name="weight-kilogram" size={20} color={Colors.teal} />
          </View>
          <Text style={[Typography.metric, { color: Colors.navy }]}>{kg}</Text>
          <Text style={styles.metricUnit}>kg</Text>
          <Text style={styles.metricLabel}>desviados{"\n"}del vertedero</Text>
        </View>

        <View style={styles.metricDivider} />

        <View style={styles.metricItem}>
          <View style={[styles.metricIcon, { backgroundColor: `${Colors.lime}18` }]}>
            <MaterialCommunityIcons name="molecule-co2" size={20} color="#166534" />
          </View>
          <Text style={[Typography.metric, { color: Colors.navy }]}>{co2}</Text>
          <Text style={styles.metricUnit}>kg</Text>
          <Text style={styles.metricLabel}>CO₂{"\n"}evitado</Text>
        </View>

        <View style={styles.metricDivider} />

        <View style={styles.metricItem}>
          <View style={[styles.metricIcon, { backgroundColor: "#FEF9C3" }]}>
            <MaterialCommunityIcons name="tree-outline" size={20} color="#854D0E" />
          </View>
          <Text style={[Typography.metric, { color: Colors.navy }]}>{arboles}</Text>
          <Text style={styles.metricUnit}>{arboles === 1 ? "árbol" : "árboles"}</Text>
          <Text style={styles.metricLabel}>equivalente{"\n"}plantado</Text>
        </View>
      </View>
    </Surface>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.white,
    overflow: "hidden",
    padding: Spacing.s4,
    gap: Spacing.s3,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLabel: {
    fontFamily: FontFamily.sora700,
    fontSize: 15,
    color: Colors.navy,
  },
  headerSub: {
    fontFamily: FontFamily.dmSans400,
    fontSize: 12,
    color: Colors.gray500,
    marginTop: 2,
  },
  nivelBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: Spacing.s3,
    paddingVertical: Spacing.s1,
    borderRadius: BorderRadius.full,
    borderWidth: 1.5,
    backgroundColor: Colors.white,
  },
  nivelLabel: {
    fontFamily: FontFamily.dmSans700,
    fontSize: 13,
  },

  // ── Progreso nivel ──
  nivelProgress: {
    gap: 4,
  },
  nivelProgressBar: {
    height: 6,
    backgroundColor: Colors.gray200,
    borderRadius: BorderRadius.full,
    overflow: "hidden",
  },
  nivelProgressFill: {
    height: "100%",
    borderRadius: BorderRadius.full,
  },
  nivelProgressLabel: {
    fontFamily: FontFamily.dmSans400,
    fontSize: 11,
    color: Colors.gray500,
    textAlign: "right",
  },

  // ── Métricas ──
  metricsRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingTop: Spacing.s1,
  },
  metricItem: {
    flex: 1,
    alignItems: "center",
    gap: 3,
  },
  metricIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.s1,
  },
  metricUnit: {
    fontFamily: FontFamily.dmSans500,
    fontSize: 12,
    color: Colors.gray500,
    marginTop: -4,
  },
  metricLabel: {
    fontFamily: FontFamily.dmSans400,
    fontSize: 11,
    color: Colors.gray500,
    textAlign: "center",
    lineHeight: 15,
  },
  metricDivider: {
    width: 1,
    height: 80,
    backgroundColor: Colors.gray200,
    alignSelf: "center",
  },
});
