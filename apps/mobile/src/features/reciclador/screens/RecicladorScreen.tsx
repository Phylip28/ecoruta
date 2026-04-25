import { useMemo, useState } from "react";
import * as Haptics from "expo-haptics";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Button,
  FAB,
  HelperText,
  Surface,
  Text,
  TextInput,
} from "react-native-paper";

import { env } from "../../../config/env";
import {
  ActiveRoutePanel,
  BorderRadius,
  Colors,
  EcoIcons,
  FontFamily,
  Shadows,
  Spacing,
  Typography,
  touchTarget,
} from "../../../design-system";
import {
  actualizarEstadoSolicitud,
  crearSolicitudDemo,
  listarSolicitudesPendientes,
  obtenerRutaReciclador,
} from "../api/recicladorClient";
import { ImpactoResumen } from "../components/ImpactoResumen";
import { MapaSolicitudes } from "../components/MapaSolicitudes";
import { SolicitudCard } from "../components/SolicitudCard";
import type { EstadoSolicitud, Solicitud } from "../types";

function numeroSeguro(value: string, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

type RecicladorScreenProps = {
  onFeedback?: (msg: string, tipo?: "exito" | "error" | "info" | "advertencia") => void;
};

export function RecicladorScreen({ onFeedback }: RecicladorScreenProps = {}) {
  const [recicladorId, setRecicladorId] = useState(String(env.mobile.recicladorId));
  const [latitud, setLatitud] = useState(String(env.mobile.latitudInicial));
  const [longitud, setLongitud] = useState(String(env.mobile.longitudInicial));
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [rutaIds, setRutaIds] = useState<number[]>([]);
  const [distanciaKm, setDistanciaKm] = useState<number | null>(null);
  const [completadasSesion, setCompletadasSesion] = useState(0);
  const [statusMsg, setStatusMsg] = useState("Carga las solicitudes para empezar.");
  const [cargando, setCargando] = useState(false);
  const [mostrarParams, setMostrarParams] = useState(false);

  const resumen = useMemo(() => ({
    pendientes: solicitudes.filter((s) => s.estado === "pendiente").length,
    enCamino: solicitudes.filter((s) => s.estado === "en_camino").length,
  }), [solicitudes]);

  const solicitudActiva = useMemo(() => {
    if (rutaIds.length > 0) {
      const porId = new Map(solicitudes.map((s) => [s.id, s]));
      for (const id of rutaIds) {
        const found = porId.get(id);
        if (found && found.estado !== "completado") return found;
      }
    }
    return solicitudes.find((s) => s.estado === "en_camino")
      ?? solicitudes.find((s) => s.estado === "pendiente")
      ?? null;
  }, [rutaIds, solicitudes]);

  // Para ActiveRoutePanel: paradas en orden
  const paradasOrdenadas = useMemo(() => {
    if (rutaIds.length === 0) return [];
    const porId = new Map(solicitudes.map((s) => [s.id, s]));
    return rutaIds
      .map((id) => porId.get(id))
      .filter(Boolean)
      .map((s) => `#${s!.id} · ${s!.material ?? "mixto"} (${s!.kg_estimados} kg)`);
  }, [rutaIds, solicitudes]);

  async function ejecutar(action: () => Promise<void>) {
    setCargando(true);
    try { await action(); }
    catch (e) {
      const msg = e instanceof Error ? e.message : "Error inesperado";
      setStatusMsg(msg);
      onFeedback?.(msg, "error");
    }
    finally { setCargando(false); }
  }

  function upsertSolicitud(upd: Solicitud) {
    setSolicitudes((prev) => {
      const idx = prev.findIndex((s) => s.id === upd.id);
      if (idx < 0) return [upd, ...prev];
      const clone = [...prev]; clone[idx] = upd; return clone;
    });
  }

  function removerSolicitud(id: number) {
    setSolicitudes((prev) => prev.filter((s) => s.id !== id));
    setRutaIds((prev) => prev.filter((rid) => rid !== id));
  }

  async function cargarPendientes() {
    await ejecutar(async () => {
      const data = await listarSolicitudesPendientes();
      setSolicitudes(data); setRutaIds([]); setDistanciaKm(null);
      setStatusMsg(`${data.length} solicitudes pendientes cargadas.`);
      onFeedback?.(`${data.length} solicitudes cargadas.`, "info");
    });
  }

  async function calcularRuta() {
    await ejecutar(async () => {
      const data = await obtenerRutaReciclador({
        recicladorId: numeroSeguro(recicladorId, env.mobile.recicladorId),
        latitudActual: numeroSeguro(latitud, env.mobile.latitudInicial),
        longitudActual: numeroSeguro(longitud, env.mobile.longitudInicial),
      });
      setRutaIds(data.orden.map((s) => s.id));
      setDistanciaKm(data.distancia_total_km);
      setStatusMsg(`Ruta optimizada: ${data.orden.length} puntos · ${data.distancia_total_km.toFixed(2)} km`);
    });
  }

  async function crearDemo() {
    await ejecutar(async () => {
      const baseLat = numeroSeguro(latitud, env.mobile.latitudInicial);
      const baseLon = numeroSeguro(longitud, env.mobile.longitudInicial);
      const materiales = ["carton", "vidrio", "plastico", "mixto"] as const;
      const nueva = await crearSolicitudDemo({
        latitud: Number((baseLat + (Math.random() - 0.5) * 0.02).toFixed(6)),
        longitud: Number((baseLon + (Math.random() - 0.5) * 0.02).toFixed(6)),
        descripcion: "Solicitud demo creada desde app mobile",
        material: materiales[Math.floor(Math.random() * materiales.length)],
        ciudadano_telegram_id: env.mobile.demoTelegramId,
        kg_estimados: Number((Math.random() * 6 + 1).toFixed(1)),
      });
      upsertSolicitud(nueva);
      setStatusMsg(`Demo #${nueva.id} creada.`);
    });
  }

  async function cambiarEstado(id: number, estado: EstadoSolicitud) {
    await ejecutar(async () => {
      const upd = await actualizarEstadoSolicitud(id, estado);
      if (estado === "completado") {
        removerSolicitud(upd.id);
        setCompletadasSesion((n) => n + 1);
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        onFeedback?.(`Solicitud #${upd.id} completada. ¡Buen trabajo!`, "exito");
      } else {
        upsertSolicitud(upd);
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
      setStatusMsg(`#${upd.id} → ${upd.estado}`);
    });
  }

  return (
    <View style={styles.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* ── Barra de acciones — FE-05 / FE-06 ── */}
        <View style={styles.actionBar}>
          <Button
            mode="contained"
            icon="refresh"
            buttonColor={Colors.lime}
            textColor={Colors.navy}
            onPress={() => void cargarPendientes()}
            disabled={cargando}
            loading={cargando}
            style={styles.actionBtn}
            labelStyle={styles.actionBtnLabel}
            contentStyle={styles.actionBtnContent}
            accessibilityLabel="Cargar solicitudes pendientes del backend"
          >
            Cargar pendientes
          </Button>
          <Button
            mode="outlined"
            icon="map-marker-path"
            textColor={Colors.teal}
            onPress={() => void calcularRuta()}
            disabled={cargando || solicitudes.length === 0}
            style={[styles.actionBtn, styles.actionBtnOutlined]}
            labelStyle={[styles.actionBtnLabel, { color: Colors.teal }]}
            contentStyle={styles.actionBtnContent}
            accessibilityLabel="Calcular ruta óptima entre solicitudes"
          >
            Calcular ruta
          </Button>
        </View>

        {/* ── Status ── */}
        <View style={styles.statusRow}>
          {cargando && <ActivityIndicator size={13} color={Colors.teal} />}
          <Text style={styles.statusText} numberOfLines={1}>{statusMsg}</Text>
          {distanciaKm !== null && (
            <View style={styles.distPill}>
              <MaterialCommunityIcons name="road-variant" size={11} color={Colors.teal} />
              <Text style={styles.distLabel}>{distanciaKm.toFixed(2)} km</Text>
            </View>
          )}
        </View>

        {/* ── KPIs ── */}
        <View style={styles.kpiRow}>
          {[
            { label: "Pendientes", value: resumen.pendientes, accent: Colors.yellow },
            { label: "En camino",  value: resumen.enCamino,   accent: Colors.lime },
            { label: "Completadas", value: completadasSesion,  accent: Colors.teal },
          ].map((k) => (
            <Surface key={k.label} style={[styles.kpiCard, { borderTopColor: k.accent }]} elevation={0}>
              <Text style={[Typography.metric, { color: Colors.navy }]}>{k.value}</Text>
              <Text style={styles.kpiLabel}>{k.label}</Text>
            </Surface>
          ))}
        </View>

        {/* ── Gamificación FE-07 ── */}
        <ImpactoResumen completadasSesion={completadasSesion} />

        {/* ── Mapa FE-04 / FE-06 ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="map-outline" size={17} color={Colors.navy} />
            <Text style={styles.sectionTitle}>Mapa de solicitudes</Text>
            {rutaIds.length > 0 && (
              <View style={styles.routePill}>
                <MaterialCommunityIcons name="vector-polyline" size={11} color={Colors.white} />
                <Text style={styles.routePillText}>Ruta activa</Text>
              </View>
            )}
          </View>
          <MapaSolicitudes
            solicitudes={solicitudes}
            rutaIds={rutaIds}
            recicladorLat={numeroSeguro(latitud, env.mobile.latitudInicial)}
            recicladorLng={numeroSeguro(longitud, env.mobile.longitudInicial)}
          />
          <View style={styles.mapLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Colors.danger }]} />
              <Text style={styles.legendText}>Emergencia</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Colors.lime }]} />
              <Text style={styles.legendText}>Solicitud</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: "#7C3AED" }]} />
              <Text style={styles.legendText}>En camino</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Colors.teal }]} />
              <Text style={styles.legendText}>Tú</Text>
            </View>
          </View>
        </View>

        {/* ── Ruta activa FE-06 (ActiveRoutePanel) ── */}
        {rutaIds.length > 0 && paradasOrdenadas.length > 0 && (
          <ActiveRoutePanel
            titulo={`Eco-ruta · ${distanciaKm?.toFixed(2) ?? "?"} km`}
            ordenParadas={paradasOrdenadas}
            siguienteTitulo={
              solicitudActiva
                ? `Próxima parada — Solicitud #${solicitudActiva.id}`
                : "Sin paradas activas"
            }
            siguienteDetalle={
              solicitudActiva
                ? `${solicitudActiva.material ?? "mixto"} · ${solicitudActiva.kg_estimados} kg\n${solicitudActiva.latitud.toFixed(4)}, ${solicitudActiva.longitud.toFixed(4)}`
                : "Todas las solicitudes de la ruta completadas."
            }
          />
        )}

        {/* ── Solicitud activa más cercana ── */}
        {solicitudActiva && (
          <Surface style={[styles.activeSurface, Shadows.md]} elevation={0}>
            <View style={styles.activeHeader}>
              <View style={styles.activePulse} />
              <Text style={styles.activeHeaderLabel}>Siguiente parada</Text>
            </View>
            <Text style={[Typography.heading3, { color: Colors.navy, marginTop: Spacing.s1 }]}>
              Solicitud #{solicitudActiva.id}
            </Text>
            <Text style={[Typography.bodyMd, { color: Colors.gray700, marginTop: 2 }]}>
              {solicitudActiva.material ?? "mixto"} · {solicitudActiva.kg_estimados} kg
            </Text>
            <View style={styles.quickActions}>
              <Button
                mode="contained"
                icon="navigation-variant"
                buttonColor={Colors.teal}
                textColor={Colors.white}
                onPress={() => void cambiarEstado(solicitudActiva.id, "en_camino")}
                disabled={cargando || solicitudActiva.estado !== "pendiente"}
                contentStyle={{ minHeight: touchTarget.ctaReciclador }}
                style={[styles.quickBtn, { flex: 1 }]}
                labelStyle={Typography.labelLg}
              >
                Aceptar ruta
              </Button>
              <Button
                mode="contained"
                icon="check-circle-outline"
                buttonColor={Colors.lime}
                textColor={Colors.navy}
                onPress={() => void cambiarEstado(solicitudActiva.id, "completado")}
                disabled={cargando || solicitudActiva.estado !== "en_camino"}
                contentStyle={{ minHeight: touchTarget.ctaReciclador }}
                style={[styles.quickBtn, { flex: 1 }]}
                labelStyle={Typography.labelLg}
              >
                Completar
              </Button>
            </View>
          </Surface>
        )}

        {/* ── Parámetros (colapsable) ── */}
        <Pressable
          onPress={() => setMostrarParams((v) => !v)}
          style={styles.paramsToggle}
          accessibilityLabel="Configurar parámetros de ruta"
        >
          <MaterialCommunityIcons name="tune-variant" size={16} color={Colors.gray500} />
          <Text style={styles.paramsToggleLabel}>Parámetros de ruta</Text>
          <MaterialCommunityIcons
            name={mostrarParams ? "chevron-up" : "chevron-down"}
            size={16}
            color={Colors.gray500}
          />
        </Pressable>

        {mostrarParams && (
          <Surface style={[styles.paramsPanel, Shadows.sm]} elevation={0}>
            <TextInput
              mode="outlined"
              label="Reciclador ID"
              value={recicladorId}
              onChangeText={setRecicladorId}
              keyboardType="numeric"
              style={styles.paramInput}
              outlineStyle={{ borderRadius: BorderRadius.md }}
              dense
            />
            <View style={styles.paramsRow}>
              <TextInput
                mode="outlined"
                label="Latitud"
                value={latitud}
                onChangeText={setLatitud}
                keyboardType="decimal-pad"
                style={[styles.paramInput, { flex: 1 }]}
                outlineStyle={{ borderRadius: BorderRadius.md }}
                dense
              />
              <TextInput
                mode="outlined"
                label="Longitud"
                value={longitud}
                onChangeText={setLongitud}
                keyboardType="decimal-pad"
                style={[styles.paramInput, { flex: 1 }]}
                outlineStyle={{ borderRadius: BorderRadius.md }}
                dense
              />
            </View>
            {rutaIds.length > 0 && (
              <HelperText type="info" style={Typography.bodySm}>
                Orden optimizado: {rutaIds.join(" → ")}
              </HelperText>
            )}
          </Surface>
        )}

        {/* ── Lista de solicitudes ── */}
        {solicitudes.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="clipboard-list-outline" size={17} color={Colors.navy} />
              <Text style={styles.sectionTitle}>
                Solicitudes ({solicitudes.length})
              </Text>
            </View>
            {solicitudes.map((s) => (
              <SolicitudCard
                key={s.id}
                solicitud={s}
                onEstado={cambiarEstado}
                disabled={cargando}
              />
            ))}
          </View>
        )}

        {/* ── Estado vacío ── */}
        {solicitudes.length === 0 && !cargando && (
          <View style={styles.empty}>
            <MaterialCommunityIcons name="clipboard-text-outline" size={52} color={Colors.gray300} />
            <Text style={[Typography.bodyMd, { color: Colors.gray500, textAlign: "center" }]}>
              Presiona "Cargar pendientes" para ver las solicitudes disponibles
            </Text>
          </View>
        )}

        <View style={{ height: Spacing.s16 + 20 }} />
      </ScrollView>

      {/* ── FAB demo ── */}
      <FAB
        icon="plus"
        label="Demo"
        style={[styles.fab, { backgroundColor: Colors.teal }]}
        color={Colors.white}
        onPress={() => void crearDemo()}
        disabled={cargando}
        accessibilityLabel="Crear solicitud demo para pruebas"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.gray50 },
  content: { paddingHorizontal: Spacing.s4, paddingTop: Spacing.s3, gap: Spacing.s3 },

  // ── Action bar ──
  actionBar: { flexDirection: "row", gap: Spacing.s2 },
  actionBtn: { flex: 1, borderRadius: BorderRadius.lg },
  actionBtnOutlined: { borderColor: Colors.teal, borderWidth: 1.5 },
  actionBtnLabel: { fontFamily: FontFamily.dmSans700, fontSize: 13 },
  actionBtnContent: { minHeight: 48 },

  // ── Status ──
  statusRow: { flexDirection: "row", alignItems: "center", gap: Spacing.s2, minHeight: 20 },
  statusText: { flex: 1, fontFamily: FontFamily.dmSans400, fontSize: 12, color: Colors.gray500 },
  distPill: {
    flexDirection: "row", alignItems: "center", gap: 3,
    backgroundColor: `${Colors.teal}15`,
    paddingHorizontal: Spacing.s2, paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  distLabel: { fontFamily: FontFamily.dmMono500, fontSize: 11, color: Colors.teal },

  // ── KPIs ──
  kpiRow: { flexDirection: "row", gap: Spacing.s2 },
  kpiCard: {
    flex: 1, backgroundColor: Colors.white, borderRadius: BorderRadius.lg,
    padding: Spacing.s3, alignItems: "center", borderTopWidth: 3,
    ...Shadows.sm,
  },
  kpiLabel: { fontFamily: FontFamily.dmSans400, fontSize: 11, color: Colors.gray500, marginTop: 2 },

  // ── Sección ──
  section: { gap: Spacing.s2 },
  sectionHeader: { flexDirection: "row", alignItems: "center", gap: Spacing.s2 },
  sectionTitle: { fontFamily: FontFamily.sora600, fontSize: 15, color: Colors.navy, flex: 1 },
  routePill: {
    flexDirection: "row", alignItems: "center", gap: 4,
    backgroundColor: Colors.teal,
    paddingHorizontal: Spacing.s2, paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  routePillText: { fontFamily: FontFamily.dmSans700, fontSize: 11, color: Colors.white },

  mapLegend: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.s3,
    paddingTop: Spacing.s2,
    paddingHorizontal: Spacing.s1,
  },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontFamily: FontFamily.dmSans500, fontSize: 11, color: Colors.gray700 },

  // ── Solicitud activa ──
  activeSurface: {
    borderRadius: BorderRadius.xl, padding: Spacing.s4,
    backgroundColor: Colors.white, borderLeftWidth: 4, borderLeftColor: Colors.teal,
  },
  activeHeader: { flexDirection: "row", alignItems: "center", gap: Spacing.s2 },
  activePulse: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.teal },
  activeHeaderLabel: {
    fontFamily: FontFamily.dmSans700, fontSize: 11, color: Colors.teal,
    textTransform: "uppercase", letterSpacing: 0.5,
  },
  quickActions: { flexDirection: "row", gap: Spacing.s2, marginTop: Spacing.s3 },
  quickBtn: { borderRadius: BorderRadius.lg },

  // ── Parámetros ──
  paramsToggle: {
    flexDirection: "row", alignItems: "center", gap: Spacing.s2,
    paddingVertical: Spacing.s2, paddingHorizontal: Spacing.s3,
    backgroundColor: Colors.white, borderRadius: BorderRadius.md,
    borderWidth: 1, borderColor: Colors.gray200,
  },
  paramsToggleLabel: { flex: 1, fontFamily: FontFamily.dmSans500, fontSize: 13, color: Colors.gray700 },
  paramsPanel: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing.s3, gap: Spacing.s2 },
  paramsRow: { flexDirection: "row", gap: Spacing.s2 },
  paramInput: { backgroundColor: Colors.white },

  // ── Empty ──
  empty: { alignItems: "center", paddingVertical: Spacing.s8, gap: Spacing.s2 },

  // ── FAB ──
  fab: { position: "absolute", right: Spacing.s4, bottom: Spacing.s4 },
});
