import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ActivityIndicator } from "react-native-paper";

import { EcoLogo } from "../../../components/EcoLogo";
import { BorderRadius, Colors, FontFamily, Shadows, Spacing, Typography } from "../../../design-system";
import type { UserRole } from "../context/AuthContext";

type RoleOption = {
  role: UserRole;
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  accentColor: string;
  bgColor: string;
  borderColor: string;
};

const ROLES: RoleOption[] = [
  {
    role: "ciudadano",
    icon: "account-circle-outline",
    title: "Ciudadano",
    subtitle: "Reporta y solicita",
    description: "Reporta puntos críticos, solicita recolección de reciclables y sigue el estado de tus solicitudes.",
    accentColor: Colors.lime,
    bgColor: "rgba(159,193,49,0.10)",
    borderColor: "rgba(159,193,49,0.35)",
  },
  {
    role: "reciclador",
    icon: "recycle",
    title: "Reciclador",
    subtitle: "Gestiona rutas",
    description: "Visualiza solicitudes pendientes, optimiza tu ruta de recolección y registra el impacto ambiental.",
    accentColor: Colors.teal,
    bgColor: "rgba(0,92,83,0.10)",
    borderColor: "rgba(0,92,83,0.35)",
  },
];

type LoginScreenProps = {
  onLogin: (role: UserRole) => void;
};

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [selected, setSelected] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleContinue() {
    if (!selected) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    setLoading(false);
    onLogin(selected);
  }

  return (
    <LinearGradient
      colors={[Colors.navy, "#063A56", "#042940"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* ── Marca ── */}
        <View style={styles.brandSection}>
          <EcoLogo height={72} width={200} />
          <View style={styles.taglineRow}>
            <View style={styles.taglineDot} />
            <Text style={styles.tagline}>Reciclaje inteligente para Medellín</Text>
          </View>
        </View>

        {/* ── Headline ── */}
        <View style={styles.headlineSection}>
          <Text style={styles.headline}>¿Cómo{"\n"}participas hoy?</Text>
          <Text style={styles.headlineSub}>
            Selecciona tu rol para acceder a tu experiencia personalizada
          </Text>
        </View>

        {/* ── Tarjetas de rol ── */}
        <View style={styles.cardsSection}>
          {ROLES.map((opt) => {
            const isSelected = selected === opt.role;
            return (
              <Pressable
                key={opt.role}
                onPress={() => setSelected(opt.role)}
                style={({ pressed }) => [
                  styles.roleCard,
                  { borderColor: isSelected ? opt.accentColor : "rgba(255,255,255,0.10)" },
                  { backgroundColor: isSelected ? opt.bgColor : "rgba(255,255,255,0.05)" },
                  isSelected && styles.roleCardSelected,
                  pressed && { opacity: 0.88 },
                ]}
                accessibilityRole="radio"
                accessibilityState={{ selected: isSelected }}
                accessibilityLabel={`Seleccionar rol ${opt.title}: ${opt.description}`}
              >
                {/* Indicador de selección */}
                <View style={[
                  styles.selectIndicator,
                  { borderColor: isSelected ? opt.accentColor : "rgba(255,255,255,0.25)" },
                  isSelected && { backgroundColor: opt.accentColor },
                ]}>
                  {isSelected && (
                    <MaterialCommunityIcons name="check" size={12} color={Colors.navy} />
                  )}
                </View>

                {/* Ícono del rol */}
                <View style={[styles.roleIconWrap, { backgroundColor: isSelected ? opt.bgColor : "rgba(255,255,255,0.07)" }]}>
                  <MaterialCommunityIcons
                    name={opt.icon as any}
                    size={36}
                    color={isSelected ? opt.accentColor : "rgba(255,255,255,0.55)"}
                  />
                </View>

                {/* Texto */}
                <View style={styles.roleText}>
                  <Text style={[styles.roleTitle, isSelected && { color: opt.accentColor }]}>
                    {opt.title}
                  </Text>
                  <Text style={styles.roleSubtitle}>{opt.subtitle}</Text>
                  <Text style={styles.roleDesc}>{opt.description}</Text>
                </View>

                {/* Flecha de selección */}
                {isSelected && (
                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={20}
                    color={opt.accentColor}
                    style={styles.roleChevron}
                  />
                )}
              </Pressable>
            );
          })}
        </View>

        {/* ── CTA ── */}
        <View style={styles.ctaSection}>
          <Pressable
            onPress={() => void handleContinue()}
            disabled={!selected || loading}
            style={({ pressed }) => [
              styles.ctaButton,
              !selected && styles.ctaButtonDisabled,
              pressed && selected && { opacity: 0.9 },
              selected === "ciudadano" && styles.ctaButtonLime,
              selected === "reciclador" && styles.ctaButtonTeal,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Continuar con el rol seleccionado"
            accessibilityState={{ disabled: !selected || loading }}
          >
            {loading ? (
              <ActivityIndicator
                size="small"
                color={selected === "reciclador" ? Colors.white : Colors.navy}
              />
            ) : (
              <>
                <MaterialCommunityIcons
                  name="arrow-right-circle"
                  size={24}
                  color={
                    !selected
                      ? "rgba(255,255,255,0.92)"
                      : selected === "reciclador"
                        ? Colors.white
                        : Colors.navy
                  }
                />
                <Text
                  style={[
                    styles.ctaLabel,
                    !selected && styles.ctaLabelDisabled,
                    selected === "reciclador" && styles.ctaLabelOnTeal,
                  ]}
                >
                  Continuar
                </Text>
              </>
            )}
          </Pressable>

          <Text style={styles.demoNote}>
            Modo demo — sin contraseña requerida
          </Text>
        </View>

        {/* ── Footer ── */}
        <View style={styles.footer}>
          <View style={styles.footerDivider} />
          <Text style={styles.footerText}>EcoRuta Inteligente · Hackatón V2.0 · 2026</Text>
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
  scroll: {
    paddingHorizontal: Spacing.s5,
    paddingTop: Spacing.s8,
    paddingBottom: Spacing.s10,
    gap: Spacing.s6,
  },

  // ── Marca ──
  brandSection: {
    alignItems: "center",
    gap: Spacing.s2,
  },
  taglineRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.s2,
    marginTop: Spacing.s1,
  },
  taglineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.lime,
  },
  tagline: {
    fontFamily: FontFamily.dmSans400,
    fontSize: 13,
    color: "rgba(255,255,255,0.50)",
    letterSpacing: 0.2,
  },

  // ── Headline ──
  headlineSection: {
    gap: Spacing.s2,
    marginTop: Spacing.s2,
  },
  headline: {
    fontFamily: FontFamily.sora800,
    fontSize: 34,
    lineHeight: 42,
    color: Colors.white,
    letterSpacing: -0.5,
  },
  headlineSub: {
    fontFamily: FontFamily.dmSans400,
    fontSize: 15,
    lineHeight: 22,
    color: "rgba(255,255,255,0.55)",
  },

  // ── Cards ──
  cardsSection: {
    gap: Spacing.s3,
  },
  roleCard: {
    borderRadius: BorderRadius.xl,
    borderWidth: 1.5,
    padding: Spacing.s4,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.s3,
    minHeight: 96,
    position: "relative",
    ...Shadows.sm,
  },
  roleCardSelected: {
    ...Shadows.md,
  },
  selectIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    position: "absolute",
    top: Spacing.s3,
    right: Spacing.s3,
    alignItems: "center",
    justifyContent: "center",
  },
  roleIconWrap: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  roleText: {
    flex: 1,
    gap: 3,
    paddingRight: Spacing.s5,
  },
  roleTitle: {
    fontFamily: FontFamily.sora700,
    fontSize: 17,
    color: Colors.white,
    lineHeight: 22,
  },
  roleSubtitle: {
    fontFamily: FontFamily.dmSans500,
    fontSize: 12,
    color: "rgba(255,255,255,0.45)",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  roleDesc: {
    fontFamily: FontFamily.dmSans400,
    fontSize: 13,
    lineHeight: 19,
    color: "rgba(255,255,255,0.60)",
    marginTop: 2,
  },
  roleChevron: {
    position: "absolute",
    bottom: Spacing.s3,
    right: Spacing.s3,
  },

  // ── CTA ──
  ctaSection: {
    gap: Spacing.s3,
    alignItems: "center",
  },
  ctaButton: {
    width: "100%",
    minHeight: 54,
    paddingVertical: Spacing.s3,
    paddingHorizontal: Spacing.s5,
    borderRadius: BorderRadius.lg,
    backgroundColor: "rgba(255,255,255,0.14)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.s3,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.35)",
  },
  ctaButtonDisabled: {
    backgroundColor: "rgba(255,255,255,0.10)",
    borderColor: "rgba(255,255,255,0.45)",
  },
  ctaButtonLime: {
    backgroundColor: Colors.lime,
    borderColor: Colors.lime,
    ...Shadows.md,
  },
  ctaButtonTeal: {
    backgroundColor: Colors.teal,
    borderColor: Colors.teal,
    ...Shadows.md,
  },
  ctaLabel: {
    fontFamily: FontFamily.dmSans700,
    fontSize: 17,
    color: Colors.navy,
    letterSpacing: 0.3,
  },
  ctaLabelDisabled: {
    color: "rgba(255,255,255,0.95)",
  },
  ctaLabelOnTeal: {
    color: Colors.white,
  },
  demoNote: {
    fontFamily: FontFamily.dmSans400,
    fontSize: 12,
    color: "rgba(255,255,255,0.45)",
  },

  // ── Footer ──
  footer: {
    alignItems: "center",
    gap: Spacing.s3,
    marginTop: Spacing.s2,
  },
  footerDivider: {
    width: 40,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  footerText: {
    fontFamily: FontFamily.dmSans400,
    fontSize: 11,
    color: "rgba(255,255,255,0.20)",
    textAlign: "center",
  },
});
