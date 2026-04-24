import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { env } from "../../../config/env";
import { colors, spacing } from "../../../theme/tokens";
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
      <Text style={styles.sectionTitle}>Sesion reciclador</Text>
      <Text style={styles.sectionSubtitle}>
        Flujo punto 3: pendientes, ruta sugerida y cambio de estado en campo.
      </Text>

      <View style={styles.panel}>
        <Text style={styles.label}>Reciclador ID</Text>
        <TextInput
          value={recicladorId}
          onChangeText={setRecicladorId}
          keyboardType="numeric"
          style={styles.input}
        />

        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={styles.label}>Latitud</Text>
            <TextInput
              value={latitud}
              onChangeText={setLatitud}
              keyboardType="decimal-pad"
              style={styles.input}
            />
          </View>
          <View style={styles.col}>
            <Text style={styles.label}>Longitud</Text>
            <TextInput
              value={longitud}
              onChangeText={setLongitud}
              keyboardType="decimal-pad"
              style={styles.input}
            />
          </View>
        </View>

        <View style={styles.buttonsRow}>
          <Pressable style={styles.btnDark} onPress={cargarPendientes} disabled={cargando}>
            <Text style={styles.btnDarkText}>Cargar pendientes</Text>
          </Pressable>
          <Pressable style={styles.btnLight} onPress={calcularRuta} disabled={cargando}>
            <Text style={styles.btnLightText}>Calcular ruta</Text>
          </Pressable>
        </View>

        <Pressable style={styles.btnGhost} onPress={crearDemo} disabled={cargando}>
          <Text style={styles.btnGhostText}>Crear solicitud demo</Text>
        </Pressable>

        <View style={styles.kpis}>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiValue}>{resumen.pendientes}</Text>
            <Text style={styles.kpiLabel}>Pendientes</Text>
          </View>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiValue}>{resumen.enCamino}</Text>
            <Text style={styles.kpiLabel}>En camino</Text>
          </View>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiValue}>{completadasSesion}</Text>
            <Text style={styles.kpiLabel}>Completadas</Text>
          </View>
        </View>

        {distanciaKm !== null ? (
          <Text style={styles.routeInfo}>Distancia sugerida: {distanciaKm.toFixed(2)} km</Text>
        ) : null}
        {rutaIds.length > 0 ? (
          <Text style={styles.routeInfo}>Orden recomendado: {rutaIds.join(" -> ")}</Text>
        ) : null}
      </View>

      <View style={styles.statusRow}>
        {cargando ? <ActivityIndicator color={colors.accent} /> : null}
        <Text style={styles.statusText}>{mensaje}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {solicitudes.length === 0 ? (
          <Text style={styles.emptyText}>No hay solicitudes en la sesion actual.</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.86)",
    padding: spacing.md,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.25)",
    gap: spacing.sm,
  },
  sectionTitle: {
    color: colors.textDark,
    fontSize: 22,
    fontWeight: "700",
  },
  sectionSubtitle: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
  },
  panel: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.outline,
    padding: spacing.sm,
    gap: spacing.xs,
    backgroundColor: "#FFFFFF",
  },
  label: {
    color: colors.textMuted,
    fontSize: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.outline,
    borderRadius: 12,
    paddingHorizontal: spacing.sm,
    paddingVertical: 10,
    color: colors.textDark,
    fontSize: 14,
    backgroundColor: "#F9FBFD",
  },
  row: {
    flexDirection: "row",
    gap: spacing.xs,
  },
  col: {
    flex: 1,
    gap: 4,
  },
  buttonsRow: {
    flexDirection: "row",
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  btnDark: {
    flex: 1,
    backgroundColor: colors.textDark,
    borderRadius: 12,
    paddingVertical: 11,
    alignItems: "center",
  },
  btnDarkText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  btnLight: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.outline,
    borderRadius: 12,
    paddingVertical: 11,
    alignItems: "center",
  },
  btnLightText: {
    color: colors.textDark,
    fontSize: 12,
    fontWeight: "700",
  },
  btnGhost: {
    marginTop: 2,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: colors.accent,
    paddingVertical: 10,
    alignItems: "center",
  },
  btnGhostText: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: "700",
  },
  kpis: {
    flexDirection: "row",
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  kpiCard: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.outline,
    paddingVertical: spacing.xs,
    alignItems: "center",
    backgroundColor: "#F9FBFD",
  },
  kpiValue: {
    color: colors.textDark,
    fontSize: 20,
    fontWeight: "700",
  },
  kpiLabel: {
    color: colors.textMuted,
    fontSize: 11,
    textTransform: "uppercase",
  },
  routeInfo: {
    color: colors.textDark,
    fontSize: 12,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    minHeight: 20,
  },
  statusText: {
    color: "#E7EEF5",
    fontSize: 12,
    flex: 1,
  },
  list: {
    gap: spacing.sm,
    paddingBottom: spacing.sm,
  },
  emptyText: {
    color: "#D7E3EE",
    fontSize: 13,
  },
});
