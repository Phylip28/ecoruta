import { FlatList, Image, Pressable, StyleSheet, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Surface, Text } from "react-native-paper";

import {
  BorderRadius,
  Colors,
  FontFamily,
  Shadows,
  Spacing,
  Typography,
  tableEstadoBadges,
  tableTypeBadges,
} from "../../../design-system";
import type { HistorialItem } from "../../../core/api/client";

function formatFecha(iso: string): string {
  try {
    return new Date(iso).toLocaleString("es-CO", { dateStyle: "short", timeStyle: "short" });
  } catch { return iso; }
}

const ESTADO_ICONS: Record<string, string> = {
  pendiente: "clock-outline",
  en_camino: "truck-delivery-outline",
  completado: "check-circle-outline",
};

type HistorialCiudadanoProps = {
  items: HistorialItem[];
  loading?: boolean;
  onRefresh?: () => void;
};

/** FE-10 — historial de reportes y solicitudes del ciudadano, listo para conectar a la API */
export function HistorialCiudadano({ items, loading = false, onRefresh }: HistorialCiudadanoProps) {
  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.id}
      refreshing={loading}
      onRefresh={onRefresh}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContent}
      ItemSeparatorComponent={() => <View style={{ height: Spacing.s3 }} />}
      renderItem={({ item }) => {
        const tipoBadge = tableTypeBadges[item.tipo === "emergencia" ? "emergencia" : "solicitud"];
        const estadoBadge = tableEstadoBadges[item.estado];
        const estadoIcon = ESTADO_ICONS[item.estado] ?? "help-circle-outline";

        return (
          <Surface style={[styles.card, Shadows.sm]} elevation={0}>
            {/* ── Franja de tipo ── */}
            <View
              style={[
                styles.tipeFranja,
                { backgroundColor: item.tipo === "emergencia" ? `${Colors.danger}12` : `${Colors.teal}10` },
              ]}
            >
              <MaterialCommunityIcons
                name={item.tipo === "emergencia" ? "alert-circle-outline" : "recycle"}
                size={14}
                color={tipoBadge.text}
              />
              <Text style={[styles.tipeFranjaText, { color: tipoBadge.text }]}>
                {item.tipo === "emergencia" ? "Emergencia" : "Solicitud de recolección"}
              </Text>
              <Text style={styles.fecha}>{formatFecha(item.fecha)}</Text>
            </View>

            {/* ── Contenido ── */}
            <View style={styles.body}>
              {/* Miniatura */}
              <View style={styles.thumbnail}>
                {item.miniaturaUri ? (
                  <Image
                    source={{ uri: item.miniaturaUri }}
                    style={styles.thumbnailImg}
                    resizeMode="cover"
                    accessibilityLabel="Foto del reporte"
                  />
                ) : (
                  <View style={styles.thumbnailPlaceholder}>
                    <MaterialCommunityIcons name="image-off-outline" size={22} color={Colors.gray300} />
                  </View>
                )}
              </View>

              {/* Info principal */}
              <View style={styles.info}>
                <View style={styles.idRow}>
                  <Text style={[Typography.heading3, { color: Colors.navy }]}>#{item.id}</Text>
                  {/* Estado badge */}
                  <View style={[styles.estadoBadge, { backgroundColor: estadoBadge.bg }]}>
                    <MaterialCommunityIcons name={estadoIcon as any} size={12} color={estadoBadge.text} />
                    <Text style={[styles.estadoBadgeText, { color: estadoBadge.text }]}>
                      {item.estado === "en_camino" ? "En camino"
                        : item.estado === "completado" ? "Completado"
                        : "Pendiente"}
                    </Text>
                  </View>
                </View>

                {/* Material (si aplica) */}
                {item.material && (
                  <View style={styles.materialRow}>
                    <MaterialCommunityIcons name="recycle" size={12} color={Colors.gray500} />
                    <Text style={styles.materialText}>{item.material}</Text>
                  </View>
                )}

                {/* Descripción */}
                {item.descripcion ? (
                  <Text style={[Typography.bodySm, { color: Colors.gray700 }]} numberOfLines={2}>
                    {item.descripcion}
                  </Text>
                ) : null}

                {/* Reciclador */}
                <View style={styles.recicladorRow}>
                  <MaterialCommunityIcons
                    name={item.estado === "pendiente" ? "account-clock-outline" : item.estado === "en_camino" ? "account-check-outline" : "check-circle-outline"}
                    size={13}
                    color={item.estado !== "pendiente" ? Colors.teal : Colors.gray500}
                  />
                  <Text style={[styles.recicladorText,
                    { color: item.estado !== "pendiente" ? Colors.teal : Colors.gray500 },
                  ]}>
                    {item.estado === "pendiente"
                      ? "Pendiente de asignación"
                      : item.estado === "en_camino"
                        ? "Reciclador asignado"
                        : "Recogido"}
                  </Text>
                </View>
              </View>
            </View>
          </Surface>
        );
      }}
      ListEmptyComponent={
        <View style={styles.empty}>
          <MaterialCommunityIcons name="clipboard-text-outline" size={52} color={Colors.gray300} />
          <Text style={[Typography.bodyMd, { color: Colors.gray500, textAlign: "center" }]}>
            Aún no tienes reportes en el historial.{"\n"}
            ¡Haz tu primer reporte en la pestaña Acciones!
          </Text>
          {onRefresh && (
            <Pressable onPress={onRefresh} style={styles.refreshBtn}>
              <MaterialCommunityIcons name="refresh" size={16} color={Colors.teal} />
              <Text style={styles.refreshBtnLabel}>Actualizar</Text>
            </Pressable>
          )}
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: Spacing.s6,
  },
  card: {
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.white,
    overflow: "hidden",
  },

  // ── Tipo franja ──
  tipeFranja: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.s1,
    paddingHorizontal: Spacing.s3,
    paddingVertical: Spacing.s2,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  tipeFranjaText: {
    flex: 1,
    fontFamily: FontFamily.dmSans700,
    fontSize: 12,
  },
  fecha: {
    fontFamily: FontFamily.dmSans400,
    fontSize: 11,
    color: Colors.gray500,
  },

  // ── Body ──
  body: {
    flexDirection: "row",
    padding: Spacing.s3,
    gap: Spacing.s3,
  },

  // ── Thumbnail ──
  thumbnail: {
    width: 72,
    height: 72,
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
    flexShrink: 0,
  },
  thumbnailImg: {
    width: "100%",
    height: "100%",
  },
  thumbnailPlaceholder: {
    flex: 1,
    backgroundColor: Colors.gray100,
    alignItems: "center",
    justifyContent: "center",
  },

  // ── Info ──
  info: {
    flex: 1,
    gap: 4,
  },
  idRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.s2,
  },
  estadoBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: Spacing.s2,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  estadoBadgeText: {
    fontFamily: FontFamily.dmSans700,
    fontSize: 10,
  },
  materialRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  materialText: {
    fontFamily: FontFamily.dmSans500,
    fontSize: 12,
    color: Colors.gray500,
    textTransform: "capitalize",
  },
  recicladorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  recicladorText: {
    fontFamily: FontFamily.dmSans400,
    fontSize: 12,
  },

  // ── Empty ──
  empty: {
    alignItems: "center",
    paddingVertical: Spacing.s10,
    gap: Spacing.s3,
    paddingHorizontal: Spacing.s6,
  },
  refreshBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.s1,
    paddingHorizontal: Spacing.s4,
    paddingVertical: Spacing.s2,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.teal,
  },
  refreshBtnLabel: {
    fontFamily: FontFamily.dmSans700,
    fontSize: 13,
    color: Colors.teal,
  },
});
