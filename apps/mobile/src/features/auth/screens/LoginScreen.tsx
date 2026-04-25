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
import { Button } from "react-native-paper";

import { EcoLogo } from "../../../components/EcoLogo";
import { BorderRadius, Colors, FontFamily, Shadows, Spacing } from "../../../design-system";
import type { UserRole } from "../context/AuthContext";

/** Colores sólidos (hex) para el CTA: evitan que NativeWind / tema aplasten el contraste. */
const CTA = {
  ciudadanoBg: "#DBF227",
  ciudadanoFg: "#042940",
  recicladorBg: "#005C53",
  recicladorFg: "#FFFFFF",
  invitacionBg: "rgba(255,255,255,0.22)",
  invitacionFg: "#FFFFFF",
  invitacionBorder: "rgba(255,255,255,0.55)",
} as const;

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
    description:
      "Reporta puntos críticos con foto, solicita recolección por material y sigue el estado de tus solicitudes.",
    accentColor: Colors.lime,
    bgColor: "rgba(159,193,49,0.14)",
    borderColor: "rgba(159,193,49,0.45)",
  },
  {
    role: "reciclador",
    icon: "recycle",
    title: "Reciclador",
    subtitle: "Gestiona rutas",
    description:
      "Mapa de pendientes, ruta optimizada, estados con feedback y resumen de impacto ambiental.",
    accentColor: Colors.teal,
    bgColor: "rgba(0,92,83,0.14)",
    borderColor: "rgba(0,92,83,0.45)",
  },
];

const FEATURE_CHIPS: { icon: string; label: string }[] = [
  { icon: "camera-outline", label: "Foto + GPS" },
  { icon: "shape-outline", label: "Materiales" },
  { icon: "map-marker-radius", label: "Mapa y ruta" },
  { icon: "chart-line", label: "Impacto" },
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
    await new Promise((r) => setTimeout(r, 500));
    setLoading(false);
    onLogin(selected);
  }

  const ctaLabel = !selected ? "Selecciona un rol arriba" : "Continuar";
  const buttonColor = !selected
    ? CTA.invitacionBg
    : selected === "ciudadano"
      ? CTA.ciudadanoBg
      : CTA.recicladorBg;
  const textColor = !selected
    ? CTA.invitacionFg
    : selected === "ciudadano"
      ? CTA.ciudadanoFg
      : CTA.recicladorFg;

  return (
    <LinearGradient
      colors={["#021a28", "#042940", "#063A56"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.2, y: 1 }}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.safe}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={styles.brandSection}>
            <View style={styles.logoBadge}>
              <EcoLogo height={80} width={210} />
            </View>
            <View style={styles.taglineRow}>
              <View style={styles.taglineDot} />
              <Text style={styles.tagline}>Reciclaje inteligente para Medellín</Text>
            </View>
          </View>

          <View style={styles.headlineSection}>
            <Text style={styles.headline}>¿Cómo participas hoy?</Text>
            <Text style={styles.headlineSub}>
              Elige tu rol para ver las herramientas de EcoRuta adaptadas a ti.
            </Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipRow}
          >
            {FEATURE_CHIPS.map((c) => (
              <View key={c.label} style={styles.chip}>
                <MaterialCommunityIcons name={c.icon as never} size={14} color={Colors.lime} />
                <Text style={styles.chipText}>{c.label}</Text>
              </View>
            ))}
          </ScrollView>

          <View style={styles.cardsSection}>
            {ROLES.map((opt) => {
              const isSelected = selected === opt.role;
              return (
                <Pressable
                  key={opt.role}
                  onPress={() => setSelected(opt.role)}
                  style={({ pressed }) => [
                    styles.roleCard,
                    { borderColor: isSelected ? opt.accentColor : "rgba(255,255,255,0.14)" },
                    { backgroundColor: isSelected ? opt.bgColor : "rgba(255,255,255,0.06)" },
                    isSelected && styles.roleCardSelected,
                    pressed && { opacity: 0.9 },
                  ]}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: isSelected }}
                  accessibilityLabel={`Rol ${opt.title}. ${opt.description}`}
                >
                  <View
                    style={[
                      styles.selectIndicator,
                      { borderColor: isSelected ? opt.accentColor : "rgba(255,255,255,0.35)" },
                      isSelected && { backgroundColor: opt.accentColor },
                    ]}
                  >
                    {isSelected && (
                      <MaterialCommunityIcons name="check" size={12} color={Colors.navy} />
                    )}
                  </View>

                  <View
                    style={[
                      styles.roleIconWrap,
                      {
                        backgroundColor: isSelected ? `${opt.accentColor}22` : "rgba(255,255,255,0.08)",
                      },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={opt.icon as never}
                      size={36}
                      color={isSelected ? opt.accentColor : "rgba(255,255,255,0.65)"}
                    />
                  </View>

                  <View style={styles.roleText}>
                    <Text style={[styles.roleTitle, isSelected && { color: opt.accentColor }]}>
                      {opt.title}
                    </Text>
                    <Text style={styles.roleSubtitle}>{opt.subtitle}</Text>
                    <Text style={styles.roleDesc}>{opt.description}</Text>
                  </View>

                  {isSelected && (
                    <MaterialCommunityIcons
                      name="chevron-right"
                      size={22}
                      color={opt.accentColor}
                      style={styles.roleChevron}
                    />
                  )}
                </Pressable>
              );
            })}
          </View>

          <View style={styles.ctaSection}>
            <Button
              mode="contained"
              icon="arrow-right"
              onPress={() => {
                if (!selected) return;
                void handleContinue();
              }}
              disabled={loading}
              loading={loading}
              buttonColor={buttonColor}
              textColor={textColor}
              style={[
                styles.ctaButton,
                !selected && {
                  borderWidth: 1.5,
                  borderColor: CTA.invitacionBorder,
                },
              ]}
              contentStyle={styles.ctaContent}
              labelStyle={styles.ctaLabel}
              accessibilityLabel={ctaLabel}
              accessibilityHint={
                !selected ? "Primero elige Ciudadano o Reciclador en las tarjetas superiores." : undefined
              }
            >
              {ctaLabel}
            </Button>

            <Text style={styles.demoNote}>Modo demo — sin contraseña requerida</Text>
          </View>

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
  gradient: { flex: 1 },
  safe: { flex: 1 },
  scroll: {
    paddingHorizontal: Spacing.s5,
    paddingTop: Spacing.s6,
    paddingBottom: Spacing.s12,
    gap: Spacing.s5,
  },

  brandSection: {
    alignItems: "center",
    gap: Spacing.s3,
  },
  logoBadge: {
    backgroundColor: "rgba(255,255,255,0.96)",
    paddingVertical: Spacing.s3,
    paddingHorizontal: Spacing.s5,
    borderRadius: BorderRadius.xl,
    ...Shadows.lg,
  },
  taglineRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.s2,
  },
  taglineDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.lime,
  },
  tagline: {
    fontFamily: FontFamily.dmSans500,
    fontSize: 14,
    color: "rgba(255,255,255,0.72)",
    letterSpacing: 0.2,
  },

  headlineSection: { gap: Spacing.s2 },
  headline: {
    fontFamily: FontFamily.sora800,
    fontSize: 32,
    lineHeight: 40,
    color: Colors.white,
    letterSpacing: -0.5,
  },
  headlineSub: {
    fontFamily: FontFamily.dmSans400,
    fontSize: 16,
    lineHeight: 24,
    color: "rgba(255,255,255,0.62)",
  },

  chipRow: {
    flexDirection: "row",
    gap: Spacing.s2,
    paddingVertical: Spacing.s1,
    alignItems: "center",
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: Spacing.s3,
    paddingVertical: Spacing.s2,
    borderRadius: BorderRadius.full,
    backgroundColor: "rgba(255,255,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },
  chipText: {
    fontFamily: FontFamily.dmSans700,
    fontSize: 12,
    color: "rgba(255,255,255,0.88)",
  },

  cardsSection: { gap: Spacing.s3 },
  roleCard: {
    borderRadius: BorderRadius.xl,
    borderWidth: 1.5,
    padding: Spacing.s4,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.s3,
    minHeight: 108,
    position: "relative",
  },
  roleCardSelected: {
    ...Shadows.md,
  },
  selectIndicator: {
    width: 22,
    height: 22,
    borderRadius: 11,
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
  roleText: { flex: 1, gap: 4, paddingRight: Spacing.s6 },
  roleTitle: {
    fontFamily: FontFamily.sora700,
    fontSize: 18,
    color: Colors.white,
    lineHeight: 24,
  },
  roleSubtitle: {
    fontFamily: FontFamily.dmSans700,
    fontSize: 11,
    color: "rgba(255,255,255,0.55)",
    textTransform: "uppercase",
    letterSpacing: 0.7,
  },
  roleDesc: {
    fontFamily: FontFamily.dmSans400,
    fontSize: 14,
    lineHeight: 20,
    color: "rgba(255,255,255,0.72)",
    marginTop: 4,
  },
  roleChevron: {
    position: "absolute",
    bottom: Spacing.s3,
    right: Spacing.s3,
  },

  ctaSection: { gap: Spacing.s3, alignItems: "stretch", marginTop: Spacing.s2 },
  ctaButton: {
    borderRadius: BorderRadius.lg,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  ctaContent: {
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  ctaLabel: {
    fontFamily: FontFamily.dmSans700,
    fontSize: 17,
    letterSpacing: 0.3,
  },
  demoNote: {
    fontFamily: FontFamily.dmSans400,
    fontSize: 13,
    color: "rgba(255,255,255,0.48)",
    textAlign: "center",
  },

  footer: { alignItems: "center", gap: Spacing.s3, marginTop: Spacing.s2 },
  footerDivider: {
    width: 48,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  footerText: {
    fontFamily: FontFamily.dmSans400,
    fontSize: 12,
    color: "rgba(255,255,255,0.38)",
    textAlign: "center",
  },
});
