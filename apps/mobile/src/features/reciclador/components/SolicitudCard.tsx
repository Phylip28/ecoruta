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

import {
  BorderRadius,
  Colors,
  EcoIcons,
  Spacing,
  Typography,
  touchTarget,
} from "../../../design-system";
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

const estadoChipStyle: Record<
  EstadoSolicitud,
  { backgroundColor: string; color: string }
> = {
  pendiente: { backgroundColor: Colors.yellow, color: Colors.navy },
  en_camino: { backgroundColor: Colors.lime, color: Colors.navy },
  completado: { backgroundColor: Colors.teal, color: Colors.white },
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
  const chipColors = estadoChipStyle[solicitud.estado];

  const accionSiguiente = puedeEnCamino
    ? "Aceptar ruta"
    : puedeCompletar
      ? "Completar servicio"
      : "Servicio finalizado";

  return (
    <Card mode="elevated" style={[styles.card, { backgroundColor: Colors.white }]}>
      <Card.Title
        title={`Solicitud #${solicitud.id}`}
        titleStyle={Typography.heading3}
        subtitle={`Material: ${solicitud.material ?? "mixto"} · ${solicitud.kg_estimados} kg`}
        subtitleStyle={Typography.bodyMd}
        right={() => (
          <Chip
            compact
            style={[styles.stateChip, { backgroundColor: chipColors.backgroundColor }]}
            textStyle={[Typography.labelMd, { color: chipColors.color }]}
            accessibilityLabel={`Estado: ${info.label}`}
          >
            {info.label}
          </Chip>
        )}
      />

      <Card.Content style={styles.content}>
        <List.Item
          title={solicitud.descripcion ?? "Sin descripcion"}
          titleNumberOfLines={2}
          titleStyle={Typography.bodyMd}
          description={`Lat/Lon: ${solicitud.latitud.toFixed(4)}, ${solicitud.longitud.toFixed(4)}`}
          descriptionStyle={[Typography.caption, { color: Colors.gray500 }]}
          left={(props) => (
            <List.Icon {...props} icon={EcoIcons.collection} color={theme.colors.primary} />
          )}
          style={styles.listRow}
        />
        <Text style={[Typography.bodyMd, { color: Colors.gray700 }]}>
          Siguiente paso: {accionSiguiente}
        </Text>
        <ProgressBar
          progress={info.progress}
          color={Colors.lime}
          style={styles.progress}
        />
      </Card.Content>

      <Card.Actions style={styles.actions}>
        <Button
          mode="contained"
          disabled={disabled || !puedeEnCamino}
          onPress={() => onEstado(solicitud.id, "en_camino")}
          contentStyle={{ minHeight: touchTarget.ctaReciclador }}
          style={{ flex: 1, borderRadius: BorderRadius.lg }}
          buttonColor={Colors.teal}
          textColor={Colors.white}
          labelStyle={Typography.labelLg}
          accessibilityLabel="Marcar solicitud en camino"
          accessibilityHint="Indica que vas en ruta hacia el punto"
        >
          Aceptar ruta
        </Button>
        <Button
          mode="contained"
          disabled={disabled || !puedeCompletar}
          onPress={() => onEstado(solicitud.id, "completado")}
          contentStyle={{ minHeight: touchTarget.ctaReciclador }}
          style={{ flex: 1, borderRadius: BorderRadius.lg }}
          buttonColor={Colors.yellow}
          textColor={Colors.black}
          labelStyle={Typography.labelLg}
          accessibilityLabel="Completar recoleccion en este punto"
          accessibilityHint="Confirma que terminaste el servicio"
        >
          Completar
        </Button>
      </Card.Actions>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.s3,
  },
  content: {
    gap: Spacing.s2,
  },
  stateChip: {
    marginRight: Spacing.s3,
    marginTop: Spacing.s2,
    borderRadius: BorderRadius.full,
  },
  listRow: {
    paddingHorizontal: 0,
  },
  progress: {
    height: 6,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.gray300,
  },
  actions: {
    flexDirection: "column",
    paddingHorizontal: Spacing.s3,
    paddingBottom: Spacing.s3,
    gap: Spacing.s2,
  },
});
