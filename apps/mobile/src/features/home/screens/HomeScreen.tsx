import { useEffect, useMemo, useState } from "react";
import { Pressable, SafeAreaView, StyleSheet, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Snackbar, Text } from "react-native-paper";

import { EcoLogo } from "../../../components/EcoLogo";
import { getHealth } from "../../../core/api/client";
import {
  BorderRadius,
  Colors,
  FontFamily,
  Shadows,
  Spacing,
  Typography,
} from "../../../design-system";
import { DesignSystemScreen } from "../../../design-system/DesignSystemScreen";
import type { UserRole } from "../../auth/context/AuthContext";
import { CiudadanoHomeScreen } from "../../ciudadano/screens/CiudadanoHomeScreen";
import { RecicladorScreen } from "../../reciclador/screens/RecicladorScreen";

type HomeScreenProps = {
  role: UserRole;
  onLogout: () => void;
};

type SnackState = {
  visible: boolean;
  mensaje: string;
  tipo: "exito" | "error" | "info" | "advertencia";
};

const ROLE_META: Record<UserRole, { label: string; icon: string; accent: string; bg: string }> = {
  ciudadano: { label: "Ciudadano", icon: "account-circle-outline", accent: Colors.lime, bg: `${Colors.lime}20` },
  reciclador: { label: "Reciclador", icon: "recycle", accent: Colors.teal, bg: `${Colors.teal}18` },
};

type BackendStatus = "ok" | "verificando" | "error";

export function HomeScreen({ role, onLogout }: HomeScreenProps) {
  const [backendStatus, setBackendStatus] = useState<BackendStatus>("verificando");
  const [snackbar, setSnackbar] = useState<SnackState>({ visible: false, mensaje: "", tipo: "info" });
  const [mostrarDesignSystem, setMostrarDesignSystem] = useState(false);

  const meta = ROLE_META[role];

  useEffect(() => {
    getHealth()
      .then((data) => setBackendStatus(data.status === "ok" ? "ok" : "error"))
      .catch(() => setBackendStatus("error"));
  }, []);

  const statusConfig = useMemo(() => {
    if (backendStatus === "ok") return { color: Colors.lime, label: "Conectado" };
    if (backendStatus === "verificando") return { color: Colors.yellow, label: "Verificando" };
    return { color: Colors.danger, label: "Sin conexión" };
  }, [backendStatus]);

  function mostrarMensaje(mensaje: string, tipo: SnackState["tipo"] = "info") {
    setSnackbar({ visible: true, mensaje, tipo });
  }

  const snackbarBg =
    snackbar.tipo === "exito" ? Colors.teal
    : snackbar.tipo === "error" ? Colors.danger
    : snackbar.tipo === "advertencia" ? Colors.yellow
    : Colors.navy;

  const snackbarTextColor = snackbar.tipo === "advertencia" ? Colors.navy : Colors.white;

  if (mostrarDesignSystem) {
    return (
      <SafeAreaView style={styles.root}>
        <DesignSystemScreen onClose={() => setMostrarDesignSystem(false)} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root}>
      {/* ── App Bar ── */}
      <View style={styles.header}>
        {/* Logo */}
        <EcoLogo height={36} width={108} />

        {/* Spacer */}
        <View style={{ flex: 1 }} />

        {/* Role pill */}
        <View style={[styles.rolePill, { backgroundColor: meta.bg }]}>
          <MaterialCommunityIcons name={meta.icon as any} size={14} color={meta.accent} />
          <Text style={[styles.rolePillText, { color: meta.accent }]}>{meta.label}</Text>
        </View>

        {/* Status dot */}
        <View style={styles.statusDot}>
          <View style={[styles.dot, { backgroundColor: statusConfig.color }]} />
        </View>

        {/* Dev: Design system */}
        <Pressable
          onPress={() => setMostrarDesignSystem(true)}
          style={styles.headerBtn}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Design system"
        >
          <MaterialCommunityIcons name="palette-outline" size={22} color={Colors.gray300} />
        </Pressable>

        {/* Salir / volver a elegir perfil */}
        <Pressable
          onPress={onLogout}
          style={styles.headerBtn}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Volver a elegir perfil"
        >
          <MaterialCommunityIcons name="logout" size={22} color={Colors.gray700} />
        </Pressable>
      </View>

      {/* ── Content ── */}
      {role === "ciudadano" ? (
        <CiudadanoHomeScreen onFeedback={mostrarMensaje} />
      ) : (
        <RecicladorScreen onFeedback={mostrarMensaje} />
      )}

      {/* ── Snackbar ── */}
      <Snackbar
        visible={snackbar.visible}
        onDismiss={() => setSnackbar((s) => ({ ...s, visible: false }))}
        duration={4000}
        style={{ backgroundColor: snackbarBg }}
        elevation={4}
      >
        <Text style={[Typography.bodyMd, { color: snackbarTextColor }]}>{snackbar.mensaje}</Text>
      </Snackbar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.s4,
    paddingVertical: Spacing.s2,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
    minHeight: 52,
    ...Shadows.sm,
  },
  rolePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: Spacing.s2,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    marginRight: Spacing.s1,
  },
  rolePillText: {
    fontFamily: FontFamily.dmSans700,
    fontSize: 12,
  },
  statusDot: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  headerBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
});
