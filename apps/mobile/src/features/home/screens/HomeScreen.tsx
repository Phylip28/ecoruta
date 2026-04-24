import { useEffect, useMemo, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import {
  Appbar,
  Badge,
  Button,
  Card,
  Chip,
  FAB,
  List,
  SegmentedButtons,
  Surface,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";

import { getHealth } from "../../../core/api/client";
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
  const [telegramId, setTelegramId] = useState("");

  useEffect(() => {
    getHealth()
      .then((data) => setBackendStatus(data.status))
      .catch(() => setBackendStatus("sin conexion"));
  }, []);

  const statusData = useMemo(() => {
    if (backendStatus === "ok") {
      return {
        label: "Backend activo",
        severity: "ok",
      };
    }

    if (backendStatus === "verificando") {
      return {
        label: "Revisando backend",
        severity: "loading",
      };
    }

    return {
      label: "Backend no disponible",
      severity: "error",
    };
  }, [backendStatus]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Appbar.Header mode="small" elevated>
        <Appbar.Content title="EcoRuta Mobile" subtitle="Gestion de sesion ciudadana y reciclador" />
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
            <Surface style={styles.statusSurface} elevation={2}>
              <View style={styles.statusHeader}>
                <Text variant="titleMedium" style={styles.statusTitle}>
                  Estado del sistema
                </Text>
                <Badge
                  style={[
                    styles.statusBadge,
                    statusData.severity === "ok"
                      ? { backgroundColor: theme.colors.primary }
                      : statusData.severity === "loading"
                        ? { backgroundColor: theme.colors.tertiary }
                        : { backgroundColor: theme.colors.error },
                  ]}
                >
                  {statusData.label}
                </Badge>
              </View>
              <Text variant="bodyMedium" style={styles.statusBody}>
                Interfaz de alto contraste para uso en calle y bajo luz intensa.
              </Text>
            </Surface>

            <Card mode="elevated" style={styles.card}>
              <Card.Title title="HU-1 Reportar punto critico" subtitle="Foto + GPS + descripcion" />
              <Card.Content style={styles.cardContent}>
                <TextInput
                  mode="outlined"
                  label="Descripcion del punto"
                  value={descripcionReporte}
                  onChangeText={setDescripcionReporte}
                  multiline
                  numberOfLines={3}
                />
                <Button mode="contained-tonal" icon="camera" contentStyle={styles.buttonTall}>
                  Tomar foto
                </Button>
                <Button mode="contained" icon="map-marker" contentStyle={styles.buttonTall}>
                  Capturar ubicacion y enviar reporte
                </Button>
              </Card.Content>
            </Card>

            <Card mode="elevated" style={styles.card}>
              <Card.Title title="HU-2 Solicitar recoleccion" subtitle="Material + Telegram + envio" />
              <Card.Content style={styles.cardContent}>
                <Text variant="labelLarge">Material reciclable</Text>
                <View style={styles.chipRow}>
                  {(["carton", "vidrio", "plastico", "mixto"] as Material[]).map(
                    (material) => (
                      <Chip
                        key={material}
                        selected={materialSeleccionado === material}
                        showSelectedOverlay
                        onPress={() => setMaterialSeleccionado(material)}
                        style={styles.chip}
                      >
                        {material}
                      </Chip>
                    )
                  )}
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
                  label="Descripcion opcional"
                  value={descripcionSolicitud}
                  onChangeText={setDescripcionSolicitud}
                />

                <Button mode="contained" icon="send" contentStyle={styles.buttonTall}>
                  Enviar solicitud de recoleccion
                </Button>
              </Card.Content>
            </Card>

            <List.Section>
              <List.Subheader>Seguimiento de sesion</List.Subheader>
              <List.Item
                title="Solicitud en revision"
                description="Reciclador asignado en ruta"
                left={(props) => <List.Icon {...props} icon="progress-clock" />}
              />
              <List.Item
                title="Notificacion por Telegram"
                description="Se enviara al cambiar estado"
                left={(props) => <List.Icon {...props} icon="message-text" />}
              />
              <List.Item
                title="Impacto ambiental"
                description="Visualiza kg desviados al completar"
                left={(props) => <List.Icon {...props} icon="leaf" />}
              />
            </List.Section>
          </ScrollView>

          <FAB
            icon="plus"
            label="Nueva accion"
            style={styles.fab}
            onPress={() => setVista("reciclador")}
          />
        </>
      ) : (
        <RecicladorScreen />
      )}
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
  statusSurface: {
    borderRadius: 16,
    padding: 14,
    marginTop: 6,
  },
  statusHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  statusTitle: {
    fontWeight: "700",
    flex: 1,
    fontSize: 18,
  },
  statusBadge: {
    alignSelf: "flex-start",
    color: "#FFFFFF",
    fontSize: 12,
  },
  statusBody: {
    marginTop: 8,
    fontSize: 16,
  },
  card: {
    borderRadius: 18,
  },
  cardContent: {
    gap: 12,
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
