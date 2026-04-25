import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Button, Card, Text, TextInput } from "react-native-paper";

import { crearSolicitud } from "../../../core/api/client";
import { env } from "../../../config/env";
import {
  BorderRadius,
  Colors,
  EcoIcons,
  FontFamily,
  Shadows,
  Spacing,
  Typography,
  touchTarget,
} from "../../../design-system";
import type { Material } from "../../reciclador/types";
import { HistorialCiudadano } from "../components/HistorialCiudadano";
import { MaterialSelectorGrid } from "../components/MaterialSelectorGrid";
import { ReporteConFoto } from "../components/ReporteConFoto";
import { historialCiudadanoMock } from "../mock/historialMock";

type FeedbackTipo = "exito" | "error" | "info" | "advertencia";

type CiudadanoHomeScreenProps = {
  onFeedback: (mensaje: string, tipo?: FeedbackTipo) => void;
};

type Tab = "acciones" | "historial";

const TABS: { value: Tab; label: string; icon: string }[] = [
  { value: "acciones", label: "Acciones", icon: "gesture-tap" },
  { value: "historial", label: "Mi historial", icon: "history" },
];

export function CiudadanoHomeScreen({ onFeedback }: CiudadanoHomeScreenProps) {
  const [tab, setTab] = useState<Tab>("acciones");
  const [material, setMaterial] = useState<Material>("mixto");
  const [kg, setKg] = useState("2");
  const [descripcion, setDescripcion] = useState("");
  const [telegramId, setTelegramId] = useState(String(env.mobile.demoTelegramId));
  const [cargando, setCargando] = useState(false);

  async function enviarSolicitud() {
    const tid = Number(telegramId);
    if (!Number.isFinite(tid) || tid <= 0) {
      onFeedback("Ingresa un Telegram ID válido.", "error");
      return;
    }
    const kgNum = Number(kg.replace(",", "."));
    if (!Number.isFinite(kgNum) || kgNum < 0) {
      onFeedback("Indica kg estimados válidos (ej. 1.5).", "error");
      return;
    }
    setCargando(true);
    try {
      const data = await crearSolicitud({
        latitud: env.mobile.latitudInicial,
        longitud: env.mobile.longitudInicial,
        material,
        ciudadano_telegram_id: tid,
        descripcion: descripcion || undefined,
        kg_estimados: kgNum,
      });
      onFeedback(`Solicitud #${data.id} enviada. Te avisamos por Telegram.`, "exito");
      setDescripcion("");
    } catch (err) {
      onFeedback(
        err instanceof Error ? err.message : "No pudimos enviar la solicitud. Intenta de nuevo.",
        "error",
      );
    } finally {
      setCargando(false);
    }
  }

  return (
    <View style={styles.root}>
      {/* ── Tab bar ── */}
      <View style={styles.tabBar}>
        {TABS.map((t) => {
          const active = tab === t.value;
          return (
            <Pressable
              key={t.value}
              onPress={() => setTab(t.value)}
              style={[styles.tab, active && styles.tabActive]}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
            >
              <MaterialCommunityIcons
                name={t.icon as any}
                size={18}
                color={active ? Colors.teal : Colors.gray500}
              />
              <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
                {t.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* ── Historial ── */}
      {tab === "historial" ? (
        <View style={styles.historialWrapper}>
          <View style={styles.historialHeader}>
            <MaterialCommunityIcons name="clock-outline" size={16} color={Colors.gray500} />
            <Text style={[Typography.bodySm, { color: Colors.gray500 }]}>
              Mostrando datos demo (FE-10)
            </Text>
          </View>
          <HistorialCiudadano items={historialCiudadanoMock} />
        </View>
      ) : (
        /* ── Acciones ── */
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Reporte con foto */}
          <ReporteConFoto onFeedback={onFeedback} />

          {/* Solicitar recolección */}
          <Card mode="elevated" style={[styles.card, Shadows.md]}>
            {/* Card header accent */}
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderIcon}>
                <MaterialCommunityIcons name="recycle" size={20} color={Colors.teal} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[Typography.heading3, { color: Colors.navy }]}>
                  Solicitar recolección
                </Text>
                <Text style={[Typography.bodySm, { color: Colors.gray500, marginTop: 2 }]}>
                  Selecciona el material y cantidad estimada
                </Text>
              </View>
            </View>

            <Card.Content style={styles.cardContent}>
              {/* Material selector */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Tipo de material</Text>
                <MaterialSelectorGrid value={material} onChange={setMaterial} />
              </View>

              {/* Kg estimados */}
              <View style={styles.fieldGroup}>
                <View style={styles.fieldLabelRow}>
                  <MaterialCommunityIcons name="weight-kilogram" size={18} color={Colors.teal} />
                  <Text style={styles.fieldLabel}>Cantidad estimada</Text>
                </View>
                <TextInput
                  mode="outlined"
                  label="Kg estimados"
                  keyboardType="decimal-pad"
                  value={kg}
                  onChangeText={setKg}
                  style={styles.input}
                  outlineStyle={{ borderRadius: BorderRadius.md }}
                  accessibilityLabel="Kilogramos estimados de residuo"
                />
              </View>

              {/* Telegram */}
              <View style={styles.fieldGroup}>
                <View style={styles.fieldLabelRow}>
                  <MaterialCommunityIcons name="send" size={18} color={Colors.teal} />
                  <Text style={styles.fieldLabel}>Notificación vía Telegram</Text>
                </View>
                <TextInput
                  mode="outlined"
                  label="Tu Telegram ID"
                  keyboardType="number-pad"
                  value={telegramId}
                  onChangeText={setTelegramId}
                  style={styles.input}
                  outlineStyle={{ borderRadius: BorderRadius.md }}
                />
              </View>

              {/* Descripción */}
              <TextInput
                mode="outlined"
                label="Descripción opcional"
                value={descripcion}
                onChangeText={setDescripcion}
                multiline
                numberOfLines={2}
                style={styles.input}
                outlineStyle={{ borderRadius: BorderRadius.md }}
              />

              {/* CTA */}
              <Button
                mode="contained"
                icon={EcoIcons.collection}
                buttonColor={Colors.teal}
                textColor={Colors.white}
                contentStyle={styles.ctaContent}
                style={styles.ctaButton}
                labelStyle={Typography.labelLg}
                loading={cargando}
                disabled={cargando}
                onPress={() => void enviarSolicitud()}
                accessibilityLabel="Enviar solicitud de recolección"
              >
                Solicitar recolección
              </Button>
            </Card.Content>
          </Card>

          {/* Espacio para el FAB / bottom */}
          <View style={{ height: Spacing.s16 }} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.gray50,
  },

  // ── Tab bar ──
  tabBar: {
    flexDirection: "row",
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
    paddingHorizontal: Spacing.s4,
    gap: Spacing.s2,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.s1,
    paddingVertical: Spacing.s3,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabActive: {
    borderBottomColor: Colors.teal,
  },
  tabLabel: {
    fontFamily: FontFamily.dmSans500,
    fontSize: 14,
    color: Colors.gray500,
  },
  tabLabelActive: {
    color: Colors.teal,
    fontFamily: FontFamily.dmSans700,
  },

  // ── Historial ──
  historialWrapper: {
    flex: 1,
    paddingHorizontal: Spacing.s4,
    paddingTop: Spacing.s3,
  },
  historialHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.s1,
    marginBottom: Spacing.s3,
    backgroundColor: Colors.gray100,
    padding: Spacing.s2,
    borderRadius: BorderRadius.md,
  },

  // ── Scroll ──
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.s4,
    paddingTop: Spacing.s4,
    gap: Spacing.s4,
  },

  // ── Card solicitud ──
  card: {
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.white,
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.s3,
    backgroundColor: `${Colors.teal}08`,
    borderBottomWidth: 1,
    borderBottomColor: `${Colors.teal}18`,
    paddingHorizontal: Spacing.s4,
    paddingVertical: Spacing.s3,
  },
  cardHeaderIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.lg,
    backgroundColor: `${Colors.teal}15`,
    alignItems: "center",
    justifyContent: "center",
  },
  cardContent: {
    gap: Spacing.s3,
    paddingTop: Spacing.s4,
    paddingBottom: Spacing.s4,
  },

  // ── Campos ──
  fieldGroup: {
    gap: Spacing.s1,
  },
  fieldLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.s2,
  },
  fieldLabel: {
    fontFamily: FontFamily.dmSans700,
    fontSize: 13,
    color: Colors.gray700,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: Colors.white,
  },

  // ── CTA ──
  ctaContent: {
    minHeight: touchTarget.ctaCiudadano,
  },
  ctaButton: {
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.s1,
  },
});
