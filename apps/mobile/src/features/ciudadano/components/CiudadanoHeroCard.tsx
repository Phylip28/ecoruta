import { StyleSheet, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Surface, Text } from "react-native-paper";

import {
  BorderRadius,
  Colors,
  FontFamily,
  Shadows,
  Spacing,
} from "../../../design-system";

type HeroRow = {
  icon: string;
  title: string;
  hint: string;
};

const HERO_ROWS: HeroRow[] = [
  {
    icon: "camera-outline",
    title: "Reporte con evidencia",
    hint: "Foto, ubicación y tipo (FE-02)",
  },
  {
    icon: "recycle",
    title: "Recolección a domicilio",
    hint: "Material, kg y aviso por Telegram (FE-03)",
  },
  {
    icon: "timeline-text-outline",
    title: "Seguimiento de solicitudes",
    hint: "Historial y estados (FE-10)",
  },
];

/** Resumen visual alineado con features ciudadano — datos demo de impacto. */
export function CiudadanoHeroCard() {
  return (
    <Surface style={[styles.card, Shadows.sm]} elevation={0}>
      <View style={styles.metricRow}>
        <View style={styles.metricBlock}>
          <Text style={styles.metricValue}>12,4 kg</Text>
          <Text style={styles.metricLabel}>estimados evitados (demo)</Text>
        </View>
        <View style={styles.metricDivider} />
        <View style={styles.metricBlock}>
          <Text style={styles.metricValue}>3</Text>
          <Text style={styles.metricLabel}>reportes este mes (demo)</Text>
        </View>
      </View>
      <Text style={styles.introTitle}>Lo que puedes hacer aquí</Text>
      {HERO_ROWS.map((row) => (
        <View key={row.title} style={styles.row}>
          <View style={styles.rowIcon}>
            <MaterialCommunityIcons name={row.icon as never} size={20} color={Colors.teal} />
          </View>
          <View style={styles.rowText}>
            <Text style={styles.rowTitle}>{row.title}</Text>
            <Text style={styles.rowHint}>{row.hint}</Text>
          </View>
        </View>
      ))}
    </Surface>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.white,
    padding: Spacing.s4,
    gap: Spacing.s3,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  metricRow: {
    flexDirection: "row",
    alignItems: "stretch",
    backgroundColor: Colors.gray50,
    borderRadius: BorderRadius.lg,
    padding: Spacing.s3,
  },
  metricBlock: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  metricValue: {
    fontFamily: FontFamily.dmMono500,
    fontSize: 22,
    color: Colors.teal,
    lineHeight: 28,
  },
  metricLabel: {
    fontFamily: FontFamily.dmSans400,
    fontSize: 11,
    color: Colors.gray500,
    textAlign: "center",
    marginTop: 4,
  },
  metricDivider: {
    width: 1,
    backgroundColor: Colors.gray200,
    marginVertical: Spacing.s1,
  },
  introTitle: {
    fontFamily: FontFamily.sora600,
    fontSize: 15,
    color: Colors.navy,
    marginTop: Spacing.s1,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.s3,
    paddingVertical: Spacing.s1,
  },
  rowIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    backgroundColor: `${Colors.teal}12`,
    alignItems: "center",
    justifyContent: "center",
  },
  rowText: {
    flex: 1,
  },
  rowTitle: {
    fontFamily: FontFamily.dmSans700,
    fontSize: 15,
    color: Colors.navy,
  },
  rowHint: {
    fontFamily: FontFamily.dmSans400,
    fontSize: 12,
    color: Colors.gray500,
    marginTop: 2,
    lineHeight: 17,
  },
});
