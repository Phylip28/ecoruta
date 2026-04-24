import { useEffect, useMemo, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import {
  Appbar,
  Badge,
  Button,
  Card,
  Chip,
  FAB,
  SegmentedButtons,
  Snackbar,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";

import { crearReporte, crearSolicitud, getHealth } from "../../../core/api/client";
import { env } from "../../../config/env";
import { RecicladorScreen } from "../../reciclador/screens/RecicladorScreen";

type VistaSesion = "ciudadano" | "reciclador";
type Material = "carton" | "vidrio" | "plastico" | "mixto";

export function HomeScreen() {
  const theme = useTheme();
  const [backendStatus, setBackendStatus] = useState("verificando");
  const [vista, setVista] = useState<VistaSesion>("ciudadano");
  const [materialSeleccionado, setMaterialSeleccionado] = useState<Material>("mixto");
  const [descripcionReporte, setDescripcionReporte] = useState("");
  const [descripcionSolicitud, setDescripcionSolicitud] = useState("");
  const [telegramId, setTelegramId] = useState(String(env.mobile.demoTelegramId));
  const [cargandoReporte, setCargandoReporte] = useState(false);
  const [cargandoSolicitud, setCargandoSolicitud] = useState(false);
  const [snackbar, setSnackbar] = useState<{ visible: boolean; mensaje: string; error: boolean }>({
    visible: false,
    mensaje: "",
    error: false,
  });

  useEffect(() => {
    getHealth()
      .then((data) => setBackendStatus(data.status))
      .catch(() => setBackendStatus("sin conexion"));
  }, []);

  const statusSeverity = useMemo(() => {
    if (backendStatus === "ok") return "ok";
    if (backendStatus === "verificando") return "loading";
    return "error";
  }, [backendStatus]);

  function mostrarMensaje(mensaje: string, error = false) {
    setSnackbar({ visible: true, mensaje, error });
  }

  async function enviarReporte() {
    setCargandoReporte(true);
    try {
      const data = await crearReporte({
        tipo: "emergencia",
        latitud: env.mobile.latitudInicial,
        longitud: env.mobile.longitudInicial,
        descripcion: descripcionReporte || undefined,
      });
      mostrarMensaje(`Reporte #${data.id} enviado.`);
      setDescripcionReporte("");
    } catch (err) {
      mostrarMensaje(err instanceof Error ? err.message : "Error al enviar reporte.", true);
    } finally {
      setCargandoReporte(false);
    }
  }

  async function enviarSolicitud() {
    const tid = Number(telegramId);
    if (!Number.isFinite(tid) || tid <= 0) {
      mostrarMensaje("Ingresa un Telegram ID valido.", true);
      return;
    }
    setCargandoSolicitud(true);
    try {
      const data = await crearSolicitud({
        latitud: env.mobile.latitudInicial,
        longitud: env.mobile.longitudInicial,
        material: materialSeleccionado,
        ciudadano_telegram_id: tid,
        descripcion: descripcionSolicitud || undefined,
        kg_estimados: 0,
      });
      mostrarMensaje(`Solicitud #${data.id} enviada. Te avisamos por Telegram.`);
      setDescripcionSolicitud("");
    } catch (err) {
      mostrarMensaje(err instanceof Error ? err.message : "Error al enviar solicitud.", true);
    } finally {
      setCargandoSolicitud(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Appbar.Header mode="small" elevated>
        <Appbar.Content title="EcoRuta" />
        <Badge
          style={[
            styles.statusBadge,
            statusSeverity === "ok"
              ? { backgroundColor: theme.colors.primary }
              : statusSeverity === "loading"
                ? { backgroundColor: theme.colors.tertiary }
                : { backgroundColor: theme.colors.error },
          ]}
        >
          {backendStatus}
        </Badge>
      </Appbar.Header>

      <View style={styles.switchContainer}>
        <SegmentedButtons
          value={vista}
          onValueChange={(value) => setVista(value as VistaSesion)}
          density="regular"
          buttons={[
            { value: "ciudadano", label: "Ciudadano", icon: "account" },
            { value: "reciclador", label: "Reciclador", icon: "bike" },
          ]}
        />
      </View>

      {vista === "ciudadano" ? (
        <>
          <ScrollView contentContainerStyle={styles.container}>
            <Card mode="elevated" style={styles.card}>
              <Card.Title title="Reportar punto critico" />
              <Card.Content style={styles.cardContent}>
                <TextInput
                  mode="outlined"
                  label="Descripcion"
                  value={descripcionReporte}
                  onChangeText={setDescripcionReporte}
                  multiline
                  numberOfLines={3}
                />
                <Button
                  mode="contained"
                  icon="map-marker"
                  contentStyle={styles.buttonTall}
                  loading={cargandoReporte}
                  disabled={cargandoReporte}
                  onPress={() => void enviarReporte()}
                >
                  Enviar reporte
                </Button>
              </Card.Content>
            </Card>

            <Card mode="elevated" style={styles.card}>
              <Card.Title title="Solicitar recoleccion" />
              <Card.Content style={styles.cardContent}>
                <Text variant="labelLarge">Material</Text>
                <View style={styles.chipRow}>
                  {(["carton", "vidrio", "plastico", "mixto"] as Material[]).map((material) => (
                    <Chip
                      key={material}
                      selected={materialSeleccionado === material}
                      showSelectedOverlay
                      onPress={() => setMaterialSeleccionado(material)}
                      style={styles.chip}
                    >
                      {material}
                    </Chip>
                  ))}
                </View>

                <TextInput
                  mode="outlined"
                  label="Telegram ID"
                  keyboardType="number-pad"
                  value={telegramId}
                  onChangeText={setTelegramId}
                />
                <TextInput
                  mode="outlined"
                  label="Descripcion (opcional)"
                  value={descripcionSolicitud}
                  onChangeText={setDescripcionSolicitud}
                />
                <Button
                  mode="contained"
                  icon="send"
                  contentStyle={styles.buttonTall}
                  loading={cargandoSolicitud}
                  disabled={cargandoSolicitud}
                  onPress={() => void enviarSolicitud()}
                >
                  Solicitar recoleccion
                </Button>
              </Card.Content>
            </Card>
          </ScrollView>

          <FAB icon="bike" style={styles.fab} onPress={() => setVista("reciclador")} />
        </>
      ) : (
        <RecicladorScreen />
      )}

      <Snackbar
        visible={snackbar.visible}
        onDismiss={() => setSnackbar((s) => ({ ...s, visible: false }))}
        duration={3500}
        style={snackbar.error ? { backgroundColor: theme.colors.errorContainer } : undefined}
      >
        <Text style={snackbar.error ? { color: theme.colors.onErrorContainer } : undefined}>
          {snackbar.mensaje}
        </Text>
      </Snackbar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F4F8F3",
  },
  switchContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 6,
  },
  container: {
    paddingHorizontal: 16,
    paddingBottom: 90,
    gap: 14,
  },
  statusBadge: {
    marginRight: 12,
    color: "#FFFFFF",
    fontSize: 12,
  },
  card: {
    borderRadius: 18,
  },
  cardContent: {
    gap: 12,
    paddingBottom: 8,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    borderRadius: 12,
  },
  buttonTall: {
    minHeight: 52,
  },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 16,
  },
});
