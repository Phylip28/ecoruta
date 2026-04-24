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
    <View style={styles.wrapper}>
      <Banner
        visible
        icon="white-balance-sunny"
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
        Sesion reciclador en modo calle: botones amplios y lectura rapida bajo sol.
      </Banner>

      <Surface style={styles.activeSurface} elevation={2}>
        <Text variant="titleLarge" style={styles.activeTitle}>
          Solicitud activa mas cercana
        </Text>

        {solicitudActiva ? (
          <>
            <List.Item
              title={`Solicitud #${solicitudActiva.id}`}
              description={`${solicitudActiva.material ?? "mixto"} · ${solicitudActiva.kg_estimados} kg`}
              left={(props) => (
                <List.Icon {...props} icon="bike-fast" color={theme.colors.primary} />
              )}
              style={styles.activeRow}
            />

            <View style={styles.quickActions}>
              <Button
                mode="contained"
                onPress={() => cambiarEstado(solicitudActiva.id, "en_camino")}
                disabled={cargando || solicitudActiva.estado !== "pendiente"}
                contentStyle={styles.buttonTall}
              >
                Aceptar ruta
              </Button>
              <Button
                mode="contained-tonal"
                onPress={() => cambiarEstado(solicitudActiva.id, "completado")}
                disabled={cargando || solicitudActiva.estado !== "en_camino"}
                contentStyle={styles.buttonTall}
              >
                Completar servicio
              </Button>
            </View>
          </>
        ) : (
          <Text variant="bodyLarge">No hay solicitud activa en este momento.</Text>
        )}
      </Surface>

      <Surface style={styles.panel} elevation={1}>
        <Text variant="titleMedium" style={styles.panelTitle}>
          Parametros de ruta
        </Text>
        <TextInput
          mode="outlined"
          label="Reciclador ID"
          value={recicladorId}
          onChangeText={setRecicladorId}
          keyboardType="numeric"
        />
        <View style={styles.row}>
          <TextInput
            mode="outlined"
            style={styles.col}
            label="Latitud"
            value={latitud}
            onChangeText={setLatitud}
            keyboardType="decimal-pad"
          />
          <TextInput
            mode="outlined"
            style={styles.col}
            label="Longitud"
            value={longitud}
            onChangeText={setLongitud}
            keyboardType="decimal-pad"
          />
        </View>

        <View style={styles.kpis}>
          <Surface style={styles.kpiCard} elevation={0}>
            <Text variant="headlineSmall" style={styles.kpiValue}>
              {resumen.pendientes}
            </Text>
            <Text variant="labelLarge">Pendientes</Text>
          </Surface>
          <Surface style={styles.kpiCard} elevation={0}>
            <Text variant="headlineSmall" style={styles.kpiValue}>
              {resumen.enCamino}
            </Text>
            <Text variant="labelLarge">En camino</Text>
          </Surface>
          <Surface style={styles.kpiCard} elevation={0}>
            <Text variant="headlineSmall" style={styles.kpiValue}>
              {completadasSesion}
            </Text>
            <Text variant="labelLarge">Completadas</Text>
          </Surface>
        </View>

        {distanciaKm !== null ? (
          <List.Item
            title={`Distancia sugerida: ${distanciaKm.toFixed(2)} km`}
            left={(props) => <List.Icon {...props} icon="map-search" />}
          />
        ) : null}
        {rutaIds.length > 0 ? (
          <HelperText type="info" style={styles.routeText}>
            Orden recomendado: {rutaIds.join(" -> ")}
          </HelperText>
        ) : null}
      </Surface>

      <View style={styles.statusRow}>
        {cargando ? <ActivityIndicator animating size={18} color={theme.colors.primary} /> : null}
        <Text variant="bodyMedium" style={styles.statusText}>
          {mensaje}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {solicitudes.length === 0 ? (
          <Text variant="bodyLarge">No hay solicitudes en la sesion actual.</Text>
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
        label="Crear solicitud demo"
        style={styles.fab}
        onPress={crearDemo}
        disabled={cargando}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 78,
    gap: 12,
  },
  banner: {
    borderRadius: 16,
    marginTop: 8,
  },
  activeSurface: {
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  activeTitle: {
    fontWeight: "700",
    fontSize: 22,
    paddingHorizontal: 8,
  },
  activeRow: {
    paddingHorizontal: 0,
  },
  quickActions: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  panel: {
    borderRadius: 16,
    padding: 12,
    gap: 10,
  },
  panelTitle: {
    fontWeight: "700",
    fontSize: 18,
  },
  row: {
    flexDirection: "row",
    gap: 8,
  },
  col: {
    flex: 1,
  },
  kpis: {
    flexDirection: "row",
    gap: 8,
  },
  kpiCard: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 8,
    alignItems: "center",
  },
  kpiValue: {
    fontWeight: "700",
  },
  routeText: {
    fontSize: 15,
    marginTop: -2,
  },
  buttonTall: {
    minHeight: 52,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    minHeight: 24,
    paddingHorizontal: 4,
  },
  statusText: {
    fontSize: 16,
    flex: 1,
  },
  list: {
    paddingTop: 4,
    paddingBottom: 8,
  },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 14,
  },
});
