import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  ActivityIndicator,
  Banner,
  Button,
  FAB,
  HelperText,
  List,
  Surface,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";

import { env } from "../../../config/env";
import {
  BorderRadius,
  Colors,
  EcoIcons,
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
import { SolicitudCard } from "../components/SolicitudCard";
import type { EstadoSolicitud, Solicitud } from "../types";

function numeroSeguro(value: string, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function RecicladorScreen() {
  const theme = useTheme();
  const [recicladorId, setRecicladorId] = useState(String(env.mobile.recicladorId));
  const [latitud, setLatitud] = useState(String(env.mobile.latitudInicial));
  const [longitud, setLongitud] = useState(String(env.mobile.longitudInicial));
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [rutaIds, setRutaIds] = useState<number[]>([]);
  const [distanciaKm, setDistanciaKm] = useState<number | null>(null);
  const [completadasSesion, setCompletadasSesion] = useState(0);
  const [mensaje, setMensaje] = useState("Listo para cargar pendientes.");
  const [cargando, setCargando] = useState(false);

  const resumen = useMemo(() => {
    const pendientes = solicitudes.filter((item) => item.estado === "pendiente").length;
    const enCamino = solicitudes.filter((item) => item.estado === "en_camino").length;

    return { pendientes, enCamino };
  }, [solicitudes]);

  const solicitudActiva = useMemo(() => {
    if (rutaIds.length > 0) {
      const porId = new Map(solicitudes.map((item) => [item.id, item]));
      for (const id of rutaIds) {
        const encontrada = porId.get(id);
        if (encontrada) {
          return encontrada;
        }
      }
    }

    return (
      solicitudes.find((item) => item.estado === "en_camino") ??
      solicitudes.find((item) => item.estado === "pendiente") ??
      null
    );
  }, [rutaIds, solicitudes]);

  async function ejecutar(action: () => Promise<void>) {
    setCargando(true);
    try {
      await action();
    } catch (error) {
      setMensaje(error instanceof Error ? error.message : "Error inesperado");
    } finally {
      setCargando(false);
    }
  }

  function upsertSolicitud(updated: Solicitud) {
    setSolicitudes((actuales) => {
      const idx = actuales.findIndex((item) => item.id === updated.id);
      if (idx < 0) {
        return [updated, ...actuales];
      }
      const clone = [...actuales];
      clone[idx] = updated;
      return clone;
    });
  }

  function removerSolicitud(solicitudId: number) {
    setSolicitudes((actuales) => actuales.filter((item) => item.id !== solicitudId));
    setRutaIds((actuales) => actuales.filter((id) => id !== solicitudId));
  }

  async function cargarPendientes() {
    await ejecutar(async () => {
      const data = await listarSolicitudesPendientes();
      setSolicitudes(data);
      setRutaIds([]);
      setDistanciaKm(null);
      setMensaje(`Pendientes cargadas: ${data.length}`);
    });
  }

  async function calcularRuta() {
    await ejecutar(async () => {
      const data = await obtenerRutaReciclador({
        recicladorId: numeroSeguro(recicladorId, env.mobile.recicladorId),
        latitudActual: numeroSeguro(latitud, env.mobile.latitudInicial),
        longitudActual: numeroSeguro(longitud, env.mobile.longitudInicial),
      });

      setRutaIds(data.orden.map((item) => item.id));
      setDistanciaKm(data.distancia_total_km);
      setMensaje(`Ruta calculada con ${data.orden.length} puntos.`);
    });
  }

  async function crearDemo() {
    await ejecutar(async () => {
      const baseLat = numeroSeguro(latitud, env.mobile.latitudInicial);
      const baseLon = numeroSeguro(longitud, env.mobile.longitudInicial);
      const materiales = ["carton", "vidrio", "plastico", "mixto"] as const;
      const material = materiales[Math.floor(Math.random() * materiales.length)];
      const jitterLat = (Math.random() - 0.5) * 0.02;
      const jitterLon = (Math.random() - 0.5) * 0.02;
      const kgEstimados = Number((Math.random() * 6 + 1).toFixed(1));

      const nueva = await crearSolicitudDemo({
        latitud: Number((baseLat + jitterLat).toFixed(6)),
        longitud: Number((baseLon + jitterLon).toFixed(6)),
        descripcion: "Solicitud demo creada desde app mobile",
        material,
        ciudadano_telegram_id: env.mobile.demoTelegramId,
        kg_estimados: kgEstimados,
      });

      upsertSolicitud(nueva);
      setMensaje(`Solicitud demo #${nueva.id} creada.`);
    });
  }

  async function cambiarEstado(solicitudId: number, estado: EstadoSolicitud) {
    await ejecutar(async () => {
      const updated = await actualizarEstadoSolicitud(solicitudId, estado);

      if (estado === "completado") {
        removerSolicitud(updated.id);
        setCompletadasSesion((actual) => actual + 1);
      } else {
        upsertSolicitud(updated);
      }

      setMensaje(`Solicitud #${updated.id} actualizada a ${updated.estado}.`);
    });
  }

  return (
    <View className="flex-1 gap-eco-3 bg-eco-gray-50 px-eco-4 pb-[78px]">
      <Banner
        visible
        icon={EcoIcons.stats}
        style={styles.banner}
        actions={[
          {
            label: "Cargar pendientes",
            onPress: cargarPendientes,
          },
          {
            label: "Calcular ruta",
            onPress: calcularRuta,
          },
        ]}
      >
        Sesion reciclador: botones amplios (64dp) y contraste alto para uso al aire libre.
      </Banner>

      <Surface style={[styles.activeSurface, Shadows.lg]} elevation={0}>
        <Text style={[Typography.caption, { color: Colors.sage, textTransform: "uppercase" }]}>
          Solicitud activa
        </Text>
        <Text style={[Typography.heading2, { color: Colors.navy, marginTop: Spacing.s1 }]}>
          Mas cercana
        </Text>

        {solicitudActiva ? (
          <>
            <List.Item
              title={`Solicitud #${solicitudActiva.id}`}
              titleStyle={Typography.heading3}
              description={`${solicitudActiva.material ?? "mixto"} · ${solicitudActiva.kg_estimados} kg`}
              descriptionStyle={Typography.bodyMd}
              left={(props) => (
                <List.Icon {...props} icon={EcoIcons.routes} color={theme.colors.primary} />
              )}
              style={styles.activeRow}
            />

            <View style={styles.quickActions}>
              <Button
                mode="contained"
                onPress={() => cambiarEstado(solicitudActiva.id, "en_camino")}
                disabled={cargando || solicitudActiva.estado !== "pendiente"}
                contentStyle={{ minHeight: touchTarget.ctaReciclador }}
                style={{ flex: 1, borderRadius: BorderRadius.lg }}
                buttonColor={Colors.teal}
                textColor={Colors.white}
                labelStyle={Typography.labelLg}
                accessibilityLabel="Marcar en camino hacia la solicitud activa"
              >
                Aceptar ruta
              </Button>
              <Button
                mode="contained"
                onPress={() => cambiarEstado(solicitudActiva.id, "completado")}
                disabled={cargando || solicitudActiva.estado !== "en_camino"}
                contentStyle={{ minHeight: touchTarget.ctaReciclador }}
                style={{ flex: 1, borderRadius: BorderRadius.lg }}
                buttonColor={Colors.yellow}
                textColor={Colors.black}
                labelStyle={Typography.labelLg}
                accessibilityLabel="Completar servicio de recoleccion"
              >
                Completar servicio
              </Button>
            </View>
          </>
        ) : (
          <Text style={[Typography.bodyMd, { color: Colors.gray700 }]}>
            No hay solicitud activa en este momento.
          </Text>
        )}
      </Surface>

      <Surface style={[styles.panel, Shadows.sm]} elevation={0}>
        <Text style={[Typography.heading3, { color: Colors.navy }]}>Parametros de ruta</Text>
        <TextInput
          mode="outlined"
          label="Reciclador ID"
          value={recicladorId}
          onChangeText={setRecicladorId}
          keyboardType="numeric"
          style={Typography.bodyMd}
        />
        <View style={styles.row}>
          <TextInput
            mode="outlined"
            style={[styles.col, Typography.bodyMd]}
            label="Latitud"
            value={latitud}
            onChangeText={setLatitud}
            keyboardType="decimal-pad"
          />
          <TextInput
            mode="outlined"
            style={[styles.col, Typography.bodyMd]}
            label="Longitud"
            value={longitud}
            onChangeText={setLongitud}
            keyboardType="decimal-pad"
          />
        </View>

        <View style={styles.kpis}>
          <Surface style={[styles.kpiCard, { backgroundColor: Colors.gray50 }]} elevation={0}>
            <Text style={[Typography.metricSm, { color: Colors.navy }]}>{resumen.pendientes}</Text>
            <Text style={[Typography.caption, { color: Colors.gray700 }]}>Pendientes</Text>
          </Surface>
          <Surface style={[styles.kpiCard, { backgroundColor: Colors.gray50 }]} elevation={0}>
            <Text style={[Typography.metricSm, { color: Colors.navy }]}>{resumen.enCamino}</Text>
            <Text style={[Typography.caption, { color: Colors.gray700 }]}>En camino</Text>
          </Surface>
          <Surface style={[styles.kpiCard, { backgroundColor: Colors.gray50 }]} elevation={0}>
            <Text style={[Typography.metricSm, { color: Colors.navy }]}>{completadasSesion}</Text>
            <Text style={[Typography.caption, { color: Colors.gray700 }]}>Completadas</Text>
          </Surface>
        </View>

        {distanciaKm !== null ? (
          <List.Item
            title={`Distancia sugerida: ${distanciaKm.toFixed(2)} km`}
            titleStyle={Typography.bodyMd}
            left={(props) => <List.Icon {...props} icon={EcoIcons.routes} />}
          />
        ) : null}
        {rutaIds.length > 0 ? (
          <HelperText type="info" style={[Typography.bodyMd, { marginTop: -2 }]}>
            Orden recomendado: {rutaIds.join(" -> ")}
          </HelperText>
        ) : null}
      </Surface>

      <View style={styles.statusRow}>
        {cargando ? <ActivityIndicator animating size={18} color={theme.colors.primary} /> : null}
        <Text style={[Typography.bodyMd, styles.statusText]}>{mensaje}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {solicitudes.length === 0 ? (
          <Text style={Typography.bodyMd}>No hay solicitudes en la sesion actual.</Text>
        ) : (
          solicitudes.map((item) => (
            <SolicitudCard
              key={item.id}
              solicitud={item}
              onEstado={cambiarEstado}
              disabled={cargando}
            />
          ))
        )}
      </ScrollView>

      <FAB
        icon="plus"
        label="Demo"
        style={[styles.fab, { backgroundColor: Colors.teal }]}
        color={Colors.white}
        onPress={crearDemo}
        disabled={cargando}
        accessibilityLabel="Crear solicitud demo"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.s2,
    backgroundColor: Colors.white,
  },
  activeSurface: {
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.s3,
    paddingHorizontal: Spacing.s2,
    backgroundColor: Colors.white,
    borderLeftWidth: 4,
    borderLeftColor: Colors.teal,
  },
  activeRow: {
    paddingHorizontal: 0,
  },
  quickActions: {
    flexDirection: "column",
    gap: Spacing.s2,
    paddingHorizontal: Spacing.s2,
    paddingBottom: Spacing.s2,
  },
  panel: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.s3,
    gap: Spacing.s2,
    backgroundColor: Colors.white,
  },
  row: {
    flexDirection: "row",
    gap: Spacing.s2,
  },
  col: {
    flex: 1,
  },
  kpis: {
    flexDirection: "row",
    gap: Spacing.s2,
  },
  kpiCard: {
    flex: 1,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.s2,
    alignItems: "center",
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.s2,
    minHeight: 24,
    paddingHorizontal: Spacing.s1,
  },
  statusText: {
    flex: 1,
    color: Colors.gray700,
  },
  list: {
    paddingTop: Spacing.s1,
    paddingBottom: Spacing.s2,
  },
  fab: {
    position: "absolute",
    right: Spacing.s4,
    bottom: 14,
  },
});
