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
import {
  BorderRadius,
  Colors,
  EcoIcons,
  Shadows,
  Spacing,
  Typography,
  touchTarget,
} from "../../../design-system";
import { DesignSystemScreen } from "../../design-system/DesignSystemScreen";
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
  const [snackbar, setSnackbar] = useState<{
    visible: boolean;
    mensaje: string;
    tipo: "exito" | "error" | "info" | "advertencia";
  }>({ visible: false, mensaje: "", tipo: "info" });
  const [mostrarDesignSystem, setMostrarDesignSystem] = useState(false);

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

  function mostrarMensaje(mensaje: string, tipo: "exito" | "error" | "info" | "advertencia" = "info") {
    setSnackbar({ visible: true, mensaje, tipo });
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
      mostrarMensaje(
        `Tu reporte fue enviado. Un reciclador lo vera pronto. (#${data.id})`,
        "exito",
      );
      setDescripcionReporte("");
    } catch (err) {
      mostrarMensaje(
        err instanceof Error
          ? err.message
          : "No pudimos guardar tu reporte. Revisa tu conexion a internet e intenta de nuevo.",
        "error",
      );
    } finally {
      setCargandoReporte(false);
    }
  }

  async function enviarSolicitud() {
    const tid = Number(telegramId);
    if (!Number.isFinite(tid) || tid <= 0) {
      mostrarMensaje("Ingresa un Telegram ID valido.", "error");
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
      mostrarMensaje(`Solicitud #${data.id} enviada. Te avisamos por Telegram.`, "exito");
      setDescripcionSolicitud("");
    } catch (err) {
      mostrarMensaje(
        err instanceof Error ? err.message : "No pudimos enviar la solicitud. Intenta de nuevo.",
        "error",
      );
    } finally {
      setCargandoSolicitud(false);
    }
  }

  const snackbarStyle =
    snackbar.tipo === "exito"
      ? { backgroundColor: Colors.teal }
      : snackbar.tipo === "error"
        ? { backgroundColor: Colors.danger }
        : snackbar.tipo === "advertencia"
          ? { backgroundColor: Colors.yellow }
          : { backgroundColor: Colors.navy };

  const snackbarTextColor =
    snackbar.tipo === "advertencia" ? Colors.navy : Colors.white;

  if (mostrarDesignSystem) {
    return (
      <SafeAreaView className="flex-1 bg-eco-white">
        <DesignSystemScreen onClose={() => setMostrarDesignSystem(false)} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-eco-white">
      <Appbar.Header mode="small" elevated style={styles.appBar}>
        <Appbar.Content title="EcoRuta" titleStyle={Typography.heading2} color={Colors.navy} />
        <Appbar.Action
          icon="palette"
          color={Colors.teal}
          onPress={() => setMostrarDesignSystem(true)}
          accessibilityLabel="Abrir referencia del design system"
        />
        <Badge
          style={[
            styles.statusBadge,
            statusSeverity === "ok"
              ? { backgroundColor: theme.colors.primary }
              : statusSeverity === "loading"
                ? { backgroundColor: Colors.sage }
                : { backgroundColor: theme.colors.error },
          ]}
        >
          {backendStatus}
        </Badge>
      </Appbar.Header>

      <View className="px-eco-4 pb-2 pt-2">
        <SegmentedButtons
          value={vista}
          onValueChange={(value) => setVista(value as VistaSesion)}
          density="regular"
          buttons={[
            { value: "ciudadano", label: "Ciudadano", icon: EcoIcons.citizenRole },
            { value: "reciclador", label: "Reciclador", icon: EcoIcons.recyclerRole },
          ]}
        />
      </View>

      {vista === "ciudadano" ? (
        <>
          <ScrollView className="flex-1" contentContainerStyle={styles.container}>
            <Card mode="elevated" style={[styles.card, Shadows.md]}>
              <Card.Title
                title="Reportar punto critico"
                titleStyle={Typography.heading3}
                subtitle="Emergencia"
                subtitleStyle={[Typography.caption, { color: Colors.gray700 }]}
              />
              <Card.Content style={styles.cardContent}>
                <TextInput
                  mode="outlined"
                  label="Descripcion"
                  value={descripcionReporte}
                  onChangeText={setDescripcionReporte}
                  multiline
                  numberOfLines={3}
                  style={Typography.bodyLg}
                />
                <Button
                  mode="contained"
                  icon={EcoIcons.emergency}
                  buttonColor={Colors.danger}
                  textColor={Colors.white}
                  contentStyle={{ minHeight: touchTarget.ctaCiudadano }}
                  style={{ borderRadius: BorderRadius.lg }}
                  labelStyle={Typography.labelLg}
                  loading={cargandoReporte}
                  disabled={cargandoReporte}
                  onPress={() => void enviarReporte()}
                  accessibilityLabel="Enviar reporte de emergencia en tu ubicacion"
                  accessibilityHint="Envia el reporte al equipo de recicladores"
                >
                  Enviar reporte
                </Button>
              </Card.Content>
            </Card>

            <Card mode="elevated" style={[styles.card, Shadows.md]}>
              <Card.Title
                title="Solicitar recoleccion"
                titleStyle={Typography.heading3}
                subtitle="Recoleccion programada"
                subtitleStyle={[Typography.caption, { color: Colors.gray700 }]}
              />
              <Card.Content style={styles.cardContent}>
                <Text style={[Typography.labelMd, { color: Colors.gray700 }]}>Material</Text>
                <View style={styles.chipRow}>
                  {(["carton", "vidrio", "plastico", "mixto"] as Material[]).map((material) => {
                    const selected = materialSeleccionado === material;
                    return (
                      <Chip
                        key={material}
                        selected={selected}
                        onPress={() => setMaterialSeleccionado(material)}
                        style={[
                          styles.chip,
                          {
                            height: touchTarget.chipAction,
                            backgroundColor: selected ? Colors.teal : Colors.gray100,
                            borderColor: selected ? Colors.teal : Colors.gray300,
                            borderWidth: selected ? 0 : 1,
                          },
                        ]}
                        textStyle={[
                          Typography.labelMd,
                          { color: selected ? Colors.white : Colors.gray700 },
                        ]}
                        selectedColor={Colors.teal}
                      >
                        {material}
                      </Chip>
                    );
                  })}
                </View>

                <TextInput
                  mode="outlined"
                  label="Telegram ID"
                  keyboardType="number-pad"
                  value={telegramId}
                  onChangeText={setTelegramId}
                  style={Typography.bodyMd}
                />
                <TextInput
                  mode="outlined"
                  label="Descripcion (opcional)"
                  value={descripcionSolicitud}
                  onChangeText={setDescripcionSolicitud}
                  style={Typography.bodyMd}
                />
                <Button
                  mode="contained"
                  icon={EcoIcons.collection}
                  buttonColor={Colors.teal}
                  textColor={Colors.white}
                  contentStyle={{ minHeight: touchTarget.ctaCiudadano }}
                  style={{ borderRadius: BorderRadius.lg }}
                  labelStyle={Typography.labelLg}
                  loading={cargandoSolicitud}
                  disabled={cargandoSolicitud}
                  onPress={() => void enviarSolicitud()}
                  accessibilityLabel="Enviar solicitud de recoleccion"
                  accessibilityHint="Registra la solicitud con el material seleccionado"
                >
                  Solicitar recoleccion
                </Button>
              </Card.Content>
            </Card>
          </ScrollView>

          <FAB
            icon={EcoIcons.recyclerRole}
            style={[styles.fab, Shadows.lg]}
            color={Colors.white}
            size="medium"
            onPress={() => setVista("reciclador")}
            accessibilityLabel="Cambiar a vista reciclador"
          />
        </>
      ) : (
        <RecicladorScreen />
      )}

      <Snackbar
        visible={snackbar.visible}
        onDismiss={() => setSnackbar((s) => ({ ...s, visible: false }))}
        duration={4000}
        style={snackbarStyle}
        elevation={4}
      >
        <Text style={[Typography.bodyMd, { color: snackbarTextColor }]}>{snackbar.mensaje}</Text>
      </Snackbar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  appBar: {
    backgroundColor: Colors.white,
    ...Shadows.sm,
  },
  container: {
    paddingHorizontal: Spacing.s4,
    paddingBottom: 90,
    gap: Spacing.s4,
  },
  statusBadge: {
    marginRight: Spacing.s3,
    color: Colors.white,
    ...Typography.caption,
  },
  card: {
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.white,
  },
  cardContent: {
    gap: Spacing.s3,
    paddingBottom: Spacing.s2,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.s2,
  },
  chip: {
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.s4,
  },
  fab: {
    position: "absolute",
    right: Spacing.s4,
    bottom: Spacing.s4,
    backgroundColor: Colors.teal,
    borderRadius: BorderRadius.full,
  },
});
