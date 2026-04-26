import { useCallback, useEffect, useMemo, useState } from "react";
import { Dimensions, FlatList, Pressable, StyleSheet, View } from "react-native";
import * as Haptics from "expo-haptics";
import * as Location from "expo-location";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ActivityIndicator, Button, Text } from "react-native-paper";

import { env } from "../../../config/env";
import {
  BorderRadius,
  Colors,
  FontFamily,
  Shadows,
  Spacing,
} from "../../../design-system";
import {
  actualizarEstadoSolicitud,
  listarSolicitudesPendientes,
  obtenerRutaReciclador,
} from "../api/recicladorClient";
import { MapaSolicitudes } from "../components/MapaSolicitudes";
import type { EstadoSolicitud, Solicitud } from "../types";

const MATERIAL_LABEL: Record<string, string> = {
  carton: "Cartón",
  plastico: "Plástico",
  vidrio: "Vidrio",
  mixto: "Mixto",
};

const NIVELES = [
  { label: "Bronce", icon: "medal-outline", color: "#B45309", minCompleted: 0 },
  { label: "Plata", icon: "medal", color: "#6B7280", minCompleted: 5 },
  { label: "Oro", icon: "crown-outline", color: "#D97706", minCompleted: 12 },
] as const;

const KG_POR_SERVICIO = 2.8;

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatMinutos(km: number): string {
  return `~${Math.max(1, Math.round((km / 20) * 60))} min`;
}

function formatDist(km: number): string {
  return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;
}

const MAP_HEIGHT = Math.round(Dimensions.get("window").height * 0.40);

type RecicladorScreenProps = {
  onFeedback?: (msg: string, tipo?: "exito" | "error" | "info" | "advertencia") => void;
};

export function RecicladorScreen({ onFeedback }: RecicladorScreenProps = {}) {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [rutaIds, setRutaIds] = useState<number[]>([]);
  const [tiempoRuta, setTiempoRuta] = useState<number | null>(null);
  const [completadasSesion, setCompletadasSesion] = useState(0);
  const [kgSesion, setKgSesion] = useState(0);
  const [cargando, setCargando] = useState(false);
  const [cargandoId, setCargandoId] = useState<number | null>(null);
  const [recicladorLat, setRecicladorLat] = useState(env.mobile.latitudInicial);
  const [recicladorLon, setRecicladorLon] = useState(env.mobile.longitudInicial);

  // GPS on mount
  useEffect(() => {
    void (async () => {
      try {
        const perm = await Location.requestForegroundPermissionsAsync();
        if (perm.status === "granted") {
          const pos = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });
          setRecicladorLat(pos.coords.latitude);
          setRecicladorLon(pos.coords.longitude);
        }
      } catch {
        /* keep default coords */
      }
    })();
  }, []);

  const nivel = useMemo(() => {
    for (let i = NIVELES.length - 1; i >= 0; i--) {
      if (completadasSesion >= NIVELES[i].minCompleted) return NIVELES[i];
    }
    return NIVELES[0];
  }, [completadasSesion]);

  const solicitudesOrdenadas = useMemo(
    () =>
      [...solicitudes].sort((a, b) => {
        // en_camino siempre primero
        if (a.estado === "en_camino" && b.estado !== "en_camino") return -1;
        if (b.estado === "en_camino" && a.estado !== "en_camino") return 1;
        const da = haversineKm(recicladorLat, recicladorLon, a.latitud, a.longitud);
        const db = haversineKm(recicladorLat, recicladorLon, b.latitud, b.longitud);
        return da - db;
      }),
    [solicitudes, recicladorLat, recicladorLon],
  );

  function upsertSolicitud(upd: Solicitud) {
    setSolicitudes((prev) => {
      const idx = prev.findIndex((s) => s.id === upd.id);
      if (idx < 0) return [upd, ...prev];
      const clone = [...prev];
      clone[idx] = upd;
      return clone;
    });
  }

  async function ejecutar(action: () => Promise<void>) {
    await action();
  }

  const cargarPendientes = useCallback(async () => {
    setCargando(true);
    try {
      const data = await listarSolicitudesPendientes();
      setSolicitudes(data);
      setRutaIds([]);
      setTiempoRuta(null);

      if (data.length > 1) {
        try {
          const ruta = await obtenerRutaReciclador({
            recicladorId: env.mobile.recicladorId,
            latitudActual: recicladorLat,
            longitudActual: recicladorLon,
          });
          // Reorder solicitudes per ORS-optimized order and populate route polyline
          setSolicitudes(ruta.orden);
          setRutaIds(ruta.orden.map((s) => s.id));
          setTiempoRuta(ruta.tiempo_estimado_min ?? null);
        } catch {
          // ORS failed — use solicitudes as-is (Haversine order from screen)
        }
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Error al cargar solicitudes";
      onFeedback?.(msg, "error");
    } finally {
      setCargando(false);
    }
  }, [onFeedback, recicladorLat, recicladorLon]);

  useEffect(() => {
    void cargarPendientes();
  }, [cargarPendientes]);

  async function accionSolicitud(solicitud: Solicitud) {
    if (cargandoId !== null) return;
    setCargandoId(solicitud.id);
    try {
      if (solicitud.estado === "pendiente") {
        const upd = await actualizarEstadoSolicitud(solicitud.id, "en_camino");
        upsertSolicitud(upd);
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        const label = solicitud.tipo === "emergencia" ? "emergencia" : "solicitud";
        onFeedback?.(`En camino a ${label} #${upd.id}`, "info");
      } else if (solicitud.estado === "en_camino") {
        const upd = await actualizarEstadoSolicitud(solicitud.id, "completado");
        setSolicitudes((prev) => prev.filter((s) => s.id !== upd.id));
        setRutaIds((prev) => prev.filter((id) => id !== upd.id));
        setCompletadasSesion((n) => n + 1);
        setKgSesion((k) => k + (solicitud.kg_estimados || KG_POR_SERVICIO));
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        onFeedback?.(`¡Completado! #${upd.id}`, "exito");
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Error inesperado";
      onFeedback?.(msg, "error");
    } finally {
      setCargandoId(null);
    }
  }

  function renderSolicitud({ item, index }: { item: Solicitud; index: number }) {
    const dist = haversineKm(recicladorLat, recicladorLon, item.latitud, item.longitud);
    const enCaminoItem = item.estado === "en_camino";
    const esEmergencia = item.tipo === "emergencia";
    const esteItemCargando = cargandoId === item.id;

    const dotColor = enCaminoItem ? Colors.teal : esEmergencia ? "#EF4444" : "#22C55E";
    const cardBorder = enCaminoItem ? Colors.teal : esEmergencia ? "#EF444440" : Colors.gray200;
    const cardBg = enCaminoItem ? `${Colors.teal}08` : esEmergencia ? "#EF444408" : Colors.white;

    const btnBg = enCaminoItem ? Colors.teal : esEmergencia ? "#EF4444" : Colors.yellow;
    const btnFg = enCaminoItem || esEmergencia ? Colors.white : Colors.navy;
    const btnLabel = enCaminoItem ? "Completar" : "Voy";

    return (
      <View style={[styles.listCard, { borderColor: cardBorder, backgroundColor: cardBg }]}>
        {/* Número de orden */}
        <View style={[styles.orderBadge, { backgroundColor: dotColor }]}>
          <Text style={styles.orderBadgeText}>{index + 1}</Text>
        </View>

        {/* Info central */}
        <View style={styles.listCardInfo}>
          <Text style={styles.listCardTitle} numberOfLines={1}>
            {esEmergencia ? "⚠ Emergencia" : MATERIAL_LABEL[item.material ?? "mixto"]}
            {"  "}
            <Text style={styles.listCardId}>#{item.id}</Text>
          </Text>
          <View style={styles.listCardMeta}>
            <MaterialCommunityIcons name="clock-fast" size={13} color={Colors.gray500} />
            <Text style={styles.listCardMetaText}>{formatMinutos(dist)} · {formatDist(dist)}</Text>
            {item.kg_estimados > 0 && (
              <>
                <MaterialCommunityIcons name="weight-kilogram" size={13} color={Colors.gray500} />
                <Text style={styles.listCardMetaText}>~{item.kg_estimados} kg</Text>
              </>
            )}
          </View>
          {item.descripcion ? (
            <Text style={styles.listCardDesc} numberOfLines={1}>{item.descripcion}</Text>
          ) : null}
        </View>

        {/* CTA */}
        <Button
          mode="contained"
          buttonColor={btnBg}
          textColor={btnFg}
          compact
          onPress={() => void accionSolicitud(item)}
          disabled={cargandoId !== null}
          loading={esteItemCargando}
          style={styles.listBtn}
          labelStyle={styles.listBtnLabel}
        >
          {btnLabel}
        </Button>
      </View>
    );
  }



  return (
    <View style={styles.root}>

      {/* ── Banner: contador + refresh ── */}
      <Pressable
        onPress={() => void cargarPendientes()}
        style={styles.banner}
        disabled={cargando}
        accessibilityRole="button"
        accessibilityLabel={`${solicitudes.length} solicitudes. Toca para refrescar`}
      >
        <MaterialCommunityIcons name="map-marker-multiple" size={20} color={Colors.yellow} />
        <Text style={styles.bannerText}>
          {cargando ? "Actualizando…" : `${solicitudes.length} solicitudes cerca de ti`}
        </Text>
        <View style={styles.flex1} />
        {cargando
          ? <ActivityIndicator size={16} color={Colors.yellow} />
          : <MaterialCommunityIcons name="refresh" size={20} color="rgba(255,255,255,0.5)" />
        }
      </Pressable>

      {/* ── Mapa ── */}
      <View style={styles.mapWrap}>
        <MapaSolicitudes
          solicitudes={solicitudes}
          rutaIds={rutaIds}
          recicladorLat={recicladorLat}
          recicladorLng={recicladorLon}
        />
      </View>

      {/* ── Leyenda ── */}
      <View style={styles.legend}>
        {[
          { color: "#22C55E", label: "solicitud" },
          { color: "#EF4444", label: "emergencia" },
          { color: Colors.teal, label: "en camino" },
          { color: "#9CA3AF", label: "tú" },
        ].map((l) => (
          <View key={l.label} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: l.color }]} />
            <Text style={styles.legendLabel}>{l.label}</Text>
          </View>
        ))}
      </View>

      {/* ── Lista de solicitudes ordenadas por proximidad ── */}
      <FlatList
        data={solicitudesOrdenadas}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderSolicitud}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyCard}>
            <MaterialCommunityIcons
              name={cargando ? "loading" : "check-circle-outline"}
              size={32}
              color={cargando ? Colors.teal : Colors.gray300}
            />
            <Text style={styles.emptyText}>
              {cargando ? "Buscando solicitudes…" : "No hay solicitudes pendientes"}
            </Text>
          </View>
        }
      />

      {/* ── Barra inferior: métricas + nivel ── */}
      <View style={styles.bottomBar}>
        <MaterialCommunityIcons name="recycle" size={16} color={Colors.teal} />
        <Text style={styles.bottomText}>
          {"Hoy: "}
          <Text style={styles.bottomBold}>{kgSesion.toFixed(1)} kg</Text>
          {" recogidos"}
        </Text>
        <View style={styles.flex1} />
        {tiempoRuta !== null && (
          <>
            <MaterialCommunityIcons name="clock-outline" size={16} color={Colors.gray500} />
            <Text style={styles.bottomText}>
              <Text style={styles.bottomBold}>~{Math.round(tiempoRuta)} min</Text>
              {" ruta"}
            </Text>
          </>
        )}
        <MaterialCommunityIcons name={nivel.icon as any} size={16} color={nivel.color} />
        <Text style={[styles.bottomNivel, { color: nivel.color }]}>{nivel.label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  flex1: { flex: 1 },

  // ── Banner ──
  banner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.navy,
    paddingHorizontal: Spacing.s4,
    paddingVertical: Spacing.s3,
    gap: Spacing.s2,
    minHeight: 52,
  },
  bannerText: {
    fontFamily: FontFamily.sora700,
    fontSize: 16,
    color: Colors.white,
    letterSpacing: -0.2,
  },

  // ── Mapa ──
  mapWrap: {
    height: MAP_HEIGHT,
    backgroundColor: Colors.gray200,
  },

  // ── Leyenda ──
  legend: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.gray50,
    paddingHorizontal: Spacing.s4,
    paddingVertical: Spacing.s2,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 5 },
  legendDot: { width: 9, height: 9, borderRadius: 5 },
  legendLabel: {
    fontFamily: FontFamily.dmSans500,
    fontSize: 11,
    color: Colors.gray700,
  },

  // ── Lista ──
  list: {
    flex: 1,
  },
  listContent: {
    padding: Spacing.s4,
    gap: Spacing.s3,
    paddingBottom: Spacing.s6,
  },

  // ── Fila de solicitud ──
  listCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    backgroundColor: Colors.white,
    paddingVertical: Spacing.s3,
    paddingLeft: Spacing.s3,
    paddingRight: Spacing.s2,
    gap: Spacing.s3,
    ...Shadows.sm,
  },
  orderBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  orderBadgeText: {
    fontFamily: FontFamily.dmSans700,
    fontSize: 13,
    color: Colors.white,
  },
  listCardInfo: {
    flex: 1,
    gap: 3,
  },
  listCardTitle: {
    fontFamily: FontFamily.dmSans700,
    fontSize: 15,
    color: Colors.navy,
  },
  listCardId: {
    fontFamily: FontFamily.dmSans400,
    fontSize: 13,
    color: Colors.gray500,
  },
  listCardMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    flexWrap: "wrap",
  },
  listCardMetaText: {
    fontFamily: FontFamily.dmSans400,
    fontSize: 12,
    color: Colors.gray500,
  },
  listCardDesc: {
    fontFamily: FontFamily.dmSans400,
    fontSize: 12,
    color: Colors.gray400,
    fontStyle: "italic",
  },
  listBtn: {
    borderRadius: BorderRadius.md,
    flexShrink: 0,
  },
  listBtnLabel: {
    fontFamily: FontFamily.dmSans700,
    fontSize: 13,
    marginHorizontal: Spacing.s2,
  },

  // ── Empty ──
  emptyCard: {
    alignItems: "center",
    gap: Spacing.s3,
    paddingVertical: Spacing.s8,
  },
  emptyText: {
    fontFamily: FontFamily.dmSans500,
    fontSize: 15,
    color: Colors.gray500,
    textAlign: "center",
  },

  // ── Bottom bar ──
  bottomBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.gray50,
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
    paddingHorizontal: Spacing.s4,
    paddingVertical: Spacing.s3,
    gap: Spacing.s2,
    minHeight: 48,
  },
  bottomText: {
    fontFamily: FontFamily.dmSans400,
    fontSize: 14,
    color: Colors.gray700,
  },
  bottomBold: {
    fontFamily: FontFamily.dmSans700,
    color: Colors.navy,
  },
  bottomNivel: {
    fontFamily: FontFamily.dmSans700,
    fontSize: 14,
  },
});

