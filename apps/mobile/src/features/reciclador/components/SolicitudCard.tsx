import { StyleSheet } from "react-native";
import {
  Button,
  Card,
  Chip,
  List,
  ProgressBar,
  Text,
  useTheme,
} from "react-native-paper";

import type { EstadoSolicitud, Solicitud } from "../types";

type SolicitudCardProps = {
  solicitud: Solicitud;
  onEstado: (solicitudId: number, estado: EstadoSolicitud) => void;
  disabled?: boolean;
};

const estadoInfo: Record<EstadoSolicitud, { label: string; progress: number }> = {
  pendiente: { label: "Pendiente", progress: 0.33 },
  en_camino: { label: "En camino", progress: 0.66 },
  completado: { label: "Completado", progress: 1 },
};

export function SolicitudCard({
  solicitud,
  onEstado,
  disabled = false,
}: SolicitudCardProps) {
  const theme = useTheme();
  const puedeEnCamino = solicitud.estado === "pendiente";
  const puedeCompletar = solicitud.estado === "en_camino";
  const info = estadoInfo[solicitud.estado];

  const accionSiguiente = puedeEnCamino
    ? "Aceptar ruta"
    : puedeCompletar
      ? "Completar servicio"
      : "Servicio finalizado";

  return (
    <Card mode="elevated" style={styles.card}>
      <Card.Title
        title={`Solicitud #${solicitud.id}`}
        titleVariant="titleLarge"
        subtitle={`Material: ${solicitud.material ?? "mixto"} · ${solicitud.kg_estimados} kg`}
        right={() => (
          <Chip compact style={styles.stateChip} textStyle={styles.stateChipText}>
            {info.label}
          </Chip>
        )}
      />

      <Card.Content style={styles.content}>
        <List.Item
          title={solicitud.descripcion ?? "Sin descripcion"}
          titleNumberOfLines={2}
          description={`Lat/Lon: ${solicitud.latitud.toFixed(4)}, ${solicitud.longitud.toFixed(4)}`}
          left={(props) => <List.Icon {...props} icon="map-marker" color={theme.colors.primary} />}
          style={styles.listRow}
        />
        <Text variant="bodyLarge" style={styles.nextAction}>
          Siguiente paso: {accionSiguiente}
        </Text>
        <ProgressBar
          progress={info.progress}
          color={theme.colors.primary}
          style={styles.progress}
        />
      </Card.Content>

      <Card.Actions style={styles.actions}>
        <Button
          mode="contained"
          disabled={disabled || !puedeEnCamino}
          onPress={() => onEstado(solicitud.id, "en_camino")}
          contentStyle={styles.buttonTall}
          labelStyle={styles.buttonLabel}
        >
          Aceptar ruta
        </Button>
        <Button
          mode="contained-tonal"
          disabled={disabled || !puedeCompletar}
          onPress={() => onEstado(solicitud.id, "completado")}
          contentStyle={styles.buttonTall}
          labelStyle={styles.buttonLabel}
        >
          Completar
        </Button>
      </Card.Actions>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    marginBottom: 12,
  },
  content: {
    gap: 6,
  },
  stateChip: {
    marginRight: 14,
    marginTop: 8,
  },
  stateChipText: {
    fontWeight: "700",
  },
  listRow: {
    paddingHorizontal: 0,
  },
  nextAction: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 2,
    marginBottom: 2,
  },
  progress: {
    height: 10,
    borderRadius: 999,
  },
  actions: {
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingBottom: 12,
    gap: 8,
  },
  buttonTall: {
    minHeight: 52,
  },
  buttonLabel: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});
