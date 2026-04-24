import { useEffect, useMemo, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { getHealth } from "../../../core/api/client";
import { colors, spacing } from "../../../theme/tokens";
import { ActionCard } from "../components/ActionCard";

export function HomeScreen() {
  const [backendStatus, setBackendStatus] = useState("verificando");

  useEffect(() => {
    getHealth()
      .then((data) => setBackendStatus(data.status))
      .catch(() => setBackendStatus("sin conexion"));
  }, []);

  const statusLabel = useMemo(() => {
    if (backendStatus === "ok") {
      return "backend activo";
    }
    if (backendStatus === "verificando") {
      return "revisando backend";
    }
    return "backend no disponible";
  }, [backendStatus]);

  return (
    <LinearGradient colors={[colors.bgDeep, colors.bgSoft]} style={styles.gradient}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.badge}>EcoRuta Mobile</Text>
          <Text style={styles.title}>Panel de sesion inicial</Text>
          <Text style={styles.subtitle}>
            Base modular para ciudadano y reciclador. Estado actual: {statusLabel}.
          </Text>

          <View style={styles.cards}>
            <ActionCard
              title="Reportar punto critico"
              description="Captura foto y coordenadas GPS para emergencias de residuos."
              tone="danger"
            />
            <ActionCard
              title="Solicitar recoleccion"
              description="Solicita retiro de material reciclable y sigue el estado de la ruta."
              tone="normal"
            />
            <ActionCard
              title="Vista reciclador"
              description="Consulta pines pendientes y cambia estado a en_camino y completado."
              tone="warning"
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  container: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
  },
  badge: {
    alignSelf: "flex-start",
    color: "#D7E3EE",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 999,
    overflow: "hidden",
    fontSize: 12,
    marginBottom: spacing.md,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 30,
    lineHeight: 36,
    fontWeight: "700",
    marginBottom: spacing.sm,
  },
  subtitle: {
    color: "#D7E3EE",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  cards: {
    marginTop: spacing.sm,
  },
});
