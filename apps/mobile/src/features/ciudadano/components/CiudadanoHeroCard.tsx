import { StyleSheet, View } from "react-native";
import { Surface, Text } from "react-native-paper";

import {
  BorderRadius,
  Colors,
  FontFamily,
  Shadows,
  Spacing,
} from "../../../design-system";

/** Resumen visual alineado con features ciudadano — datos demo de impacto. */
export function CiudadanoHeroCard() {
  return (
    <Surface style={[styles.card, Shadows.sm]} elevation={0}>
      <View style={styles.metricRow}>
        <View style={styles.metricBlock}>
          <Text style={styles.metricValue}>12,4 kg</Text>
          <Text style={styles.metricLabel}>reciclaje estimado</Text>
        </View>
        <View style={styles.metricDivider} />
        <View style={styles.metricBlock}>
          <Text style={styles.metricValue}>3</Text>
          <Text style={styles.metricLabel}>reportes este mes</Text>
        </View>
      </View>
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
});
