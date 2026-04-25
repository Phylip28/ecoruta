import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { Appbar, Card } from "react-native-paper";

import {
  ActiveRoutePanel,
  BorderRadius,
  CitizenCTA,
  CitizenEmptyState,
  CitizenReportCard,
  CollectionDayBadge,
  Colors,
  ConfirmCollectionSheetPreview,
  ContextHelpBanner,
  Duration,
  EcoIcons,
  FeedbackBanner,
  GallerySection,
  LocationReadonlyRow,
  MapPinSpecRow,
  MaterialChipsRow,
  Opacity,
  PhotoDropZone,
  RecyclerStatePanel,
  ReportStatusBadge,
  RoleCard,
  SkeletonPlaceholder,
  Spacing,
  Typography,
  chartColors,
  tableEstadoBadges,
  tableTypeBadges,
} from "./index";

type DesignSystemScreenProps = {
  onClose: () => void;
};

const baseKeys = ["navy", "teal", "lime", "yellow", "sage", "white", "black"] as const;
const semanticKeys = ["success", "warning", "danger", "info"] as const;
const grayKeys = ["gray900", "gray700", "gray500", "gray300", "gray200", "gray100", "gray50"] as const;

const materialDemoOptions = [
  { id: "carton", label: "Cartón", icon: EcoIcons.materialCarton },
  { id: "plastico", label: "Plástico", icon: EcoIcons.materialPlastic },
  { id: "vidrio", label: "Vidrio", icon: EcoIcons.materialGlass },
  { id: "mixto", label: "Mixto", icon: EcoIcons.materialMixto },
] as const;

export function DesignSystemScreen({ onClose }: DesignSystemScreenProps) {
  const [materialId, setMaterialId] = useState<string>("carton");

  return (
    <View className="flex-1 bg-eco-gray-50">
      <Appbar.Header mode="small" elevated style={{ backgroundColor: Colors.white }}>
        <Appbar.BackAction onPress={onClose} accessibilityLabel="Volver a la app" />
        <Appbar.Content title="Design system" titleStyle={Typography.heading2} color={Colors.navy} />
      </Appbar.Header>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: Spacing.s4, paddingBottom: Spacing.s12, gap: Spacing.s6 }}
      >
        <Text style={[Typography.bodyMd, { color: Colors.gray700 }]}>
          EcoRuta mobile — tokens en <Text style={Typography.labelMd}>src/design-system</Text>, componentes §7–§10 del
          design system, y utilidades <Text style={Typography.labelMd}>eco.*</Text> (NativeWind).
        </Text>

        <GallerySection title="Ciudadano — CTA §7.1" subtitle="Emergencia (danger) y recolección (teal), 64dp">
          <CitizenCTA label="Reportar emergencia" variant="emergency" onPress={() => undefined} />
          <CitizenCTA label="Solicitar recolección" variant="collection" onPress={() => undefined} />
          <CitizenCTA label="Cargando…" variant="collection" onPress={() => undefined} loading />
          <CitizenCTA label="Deshabilitado" variant="emergency" onPress={() => undefined} disabled />
        </GallerySection>

        <GallerySection title="Ciudadano — formulario §7.3–7.4" subtitle="Chips material, ubicación, foto">
          <MaterialChipsRow
            options={[...materialDemoOptions]}
            selectedId={materialId}
            onSelect={setMaterialId}
          />
          <LocationReadonlyRow latitude={6.2442} longitude={-75.5812} onChangePress={() => undefined} />
          <PhotoDropZone onPress={() => undefined} />
        </GallerySection>

        <GallerySection title="Ciudadano — ayuda y estados §7.5–7.7" subtitle="Banner contextual, badges reporte, vacío">
          <ContextHelpBanner
            title="¿Qué es una emergencia?"
            body="Usa emergencia solo si hay riesgo inmediato para personas o el entorno."
          />
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: Spacing.s2 }}>
            <ReportStatusBadge status="pendiente" />
            <ReportStatusBadge status="en_proceso" />
            <ReportStatusBadge status="completado" />
          </View>
          <CitizenEmptyState
            icon="inbox-outline"
            title="Aún no hay reportes"
            description="Cuando envíes un reporte o solicitud, aparecerá aquí."
            actionLabel="Cómo reportar"
            onAction={() => undefined}
          />
        </GallerySection>

        <GallerySection title="Ciudadano — tarjeta historial §7.3" subtitle="Badges tipo/estado alineados con admin §9.4">
          <CitizenReportCard
            id="r-1042"
            fechaLabel="22/04/2026, 10:15"
            tipo="emergencia"
            estado="en_camino"
            descripcion="Acumulación en andén 12"
          />
          <CitizenReportCard
            id="r-1040"
            fechaLabel="21/04/2026, 18:40"
            tipo="solicitud"
            estado="completado"
            materialLabel="Plástico · 4 kg"
            miniaturaUri="https://picsum.photos/seed/ecoruta/200"
          />
        </GallerySection>

        <GallerySection title="Feedback §7.8" subtitle="Variantes success / error / warning / info">
          <FeedbackBanner variant="success" title="Listo" message="Tu solicitud fue enviada correctamente." />
          <FeedbackBanner variant="error" title="Error" message="No pudimos conectar con el servidor." />
          <FeedbackBanner variant="warning" title="Atención" message="Revisa la ubicación antes de enviar." />
          <FeedbackBanner variant="info" title="Información" message="El reciclador verá tu solicitud en la cola." />
        </GallerySection>

        <GallerySection title="Reciclador — ruta y mapa §8.1–8.2" subtitle="Panel activo + leyenda de pines">
          <ActiveRoutePanel
            ordenParadas={["Laureles", "Centro", "Envigado"]}
            siguienteTitulo="Siguiente parada"
            siguienteDetalle="Calle 45 #12-30 · Plástico · 12 kg"
            onNavigate={() => undefined}
          />
          <MapPinSpecRow />
        </GallerySection>

        <GallerySection title="Reciclador — confirmación y métricas §8.3–8.5" subtitle="Sheet preview, kg día, resumen">
          <ConfirmCollectionSheetPreview material="Plástico" kilogramos={12} />
          <View style={{ flexDirection: "row", justifyContent: "space-around", flexWrap: "wrap", gap: Spacing.s4 }}>
            <CollectionDayBadge kilogramos={48.5} />
            <RecyclerStatePanel pendientes={4} enRecoleccion={1} completados={12} />
          </View>
        </GallerySection>

        <GallerySection title="Compartido — roles y skeleton §10" subtitle="Tarjetas rol + placeholders">
          <View style={{ gap: Spacing.s3 }}>
            <RoleCard role="ciudadano" />
            <RoleCard role="reciclador" />
            <RoleCard role="admin" />
          </View>
          <SkeletonPlaceholder height={20} />
          <SkeletonPlaceholder height={48} width="80%" />
        </GallerySection>

        <GallerySection title="Tokens — badges tabla §9.4" subtitle="Misma paleta que admin (tipo solicitud en mobile)">
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: Spacing.s2 }}>
            {(Object.keys(tableTypeBadges) as (keyof typeof tableTypeBadges)[]).map((k) => {
              const b = tableTypeBadges[k];
              return (
                <View key={k} style={{ borderRadius: BorderRadius.full, paddingHorizontal: Spacing.s3, paddingVertical: Spacing.s1, backgroundColor: b.bg }}>
                  <Text style={[Typography.labelMd, { color: b.text }]}>{k}</Text>
                </View>
              );
            })}
            {(Object.keys(tableEstadoBadges) as (keyof typeof tableEstadoBadges)[]).map((k) => {
              const b = tableEstadoBadges[k];
              return (
                <View key={k} style={{ borderRadius: BorderRadius.full, paddingHorizontal: Spacing.s3, paddingVertical: Spacing.s1, backgroundColor: b.bg }}>
                  <Text style={[Typography.labelMd, { color: b.text }]}>{k}</Text>
                </View>
              );
            })}
          </View>
        </GallerySection>

        <GallerySection title="Motion §6.3–6.4" subtitle="Duración y opacidades (referencia)">
          <Text style={Typography.bodyMd}>
            Duration fast {Duration.fast}ms · normal {Duration.normal}ms · slow {Duration.slow}ms · deliberate{" "}
            {Duration.deliberate}ms
          </Text>
          <Text style={Typography.bodyMd}>
            Opacity disabled {Opacity.disabled} · overlay {Opacity.overlay} · hint {Opacity.hint} · pressed{" "}
            {Opacity.pressed}
          </Text>
        </GallerySection>

        <Card mode="elevated" style={{ borderRadius: BorderRadius.lg, backgroundColor: Colors.white }}>
          <Card.Title title="Paleta base" titleStyle={Typography.heading3} />
          <Card.Content style={{ gap: Spacing.s3 }}>
            {baseKeys.map((key) => (
              <View key={key} style={{ flexDirection: "row", alignItems: "center", gap: Spacing.s3 }}>
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: BorderRadius.md,
                    backgroundColor: Colors[key],
                    borderWidth: key === "white" ? 1 : 0,
                    borderColor: Colors.gray300,
                  }}
                />
                <View style={{ flex: 1 }}>
                  <Text style={[Typography.labelMd, { color: Colors.navy }]}>{key}</Text>
                  <Text style={[Typography.caption, { fontFamily: Typography.metric.fontFamily }]}>{Colors[key]}</Text>
                </View>
              </View>
            ))}
          </Card.Content>
        </Card>

        <Card mode="elevated" style={{ borderRadius: BorderRadius.lg, backgroundColor: Colors.white }}>
          <Card.Title title="Semántica" titleStyle={Typography.heading3} />
          <Card.Content style={{ gap: Spacing.s3 }}>
            {semanticKeys.map((key) => (
              <View key={key} style={{ flexDirection: "row", alignItems: "center", gap: Spacing.s3 }}>
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: BorderRadius.md,
                    backgroundColor: Colors[key],
                  }}
                />
                <View style={{ flex: 1 }}>
                  <Text style={[Typography.labelMd, { color: Colors.navy }]}>{key}</Text>
                  <Text style={[Typography.caption, { fontFamily: Typography.metric.fontFamily }]}>{Colors[key]}</Text>
                </View>
              </View>
            ))}
          </Card.Content>
        </Card>

        <Card mode="elevated" style={{ borderRadius: BorderRadius.lg, backgroundColor: Colors.white }}>
          <Card.Title title="Grises" titleStyle={Typography.heading3} />
          <Card.Content style={{ gap: Spacing.s3 }}>
            {grayKeys.map((key) => (
              <View key={key} style={{ flexDirection: "row", alignItems: "center", gap: Spacing.s3 }}>
                <View
                  style={{
                    width: 48,
                    height: 40,
                    borderRadius: BorderRadius.md,
                    backgroundColor: Colors[key],
                    borderWidth: 1,
                    borderColor: Colors.gray300,
                  }}
                />
                <View style={{ flex: 1 }}>
                  <Text style={[Typography.labelMd, { color: Colors.navy }]}>{key}</Text>
                  <Text style={[Typography.caption, { fontFamily: Typography.metric.fontFamily }]}>{Colors[key]}</Text>
                </View>
              </View>
            ))}
          </Card.Content>
        </Card>

        <Card mode="elevated" style={{ borderRadius: BorderRadius.lg, backgroundColor: Colors.white }}>
          <Card.Title title="Gráficas (CHART_COLORS)" titleStyle={Typography.heading3} />
          <Card.Content style={{ gap: Spacing.s2 }}>
            {Object.entries(chartColors).map(([name, hex]) => (
              <View key={name} style={{ flexDirection: "row", alignItems: "center", gap: Spacing.s3 }}>
                <View
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    backgroundColor: hex,
                    borderWidth: 1,
                    borderColor: Colors.gray300,
                  }}
                />
                <Text style={Typography.bodyMd}>
                  {name}{" "}
                  <Text style={[Typography.caption, { fontFamily: Typography.metric.fontFamily }]}>{hex}</Text>
                </Text>
              </View>
            ))}
          </Card.Content>
        </Card>

        <Card mode="elevated" style={{ borderRadius: BorderRadius.lg, backgroundColor: Colors.white }}>
          <Card.Title title="Tipografía (mobile)" titleStyle={Typography.heading3} />
          <Card.Content style={{ gap: Spacing.s2, borderLeftWidth: 4, borderLeftColor: Colors.teal, paddingLeft: Spacing.s3 }}>
            <Text style={Typography.display}>Display</Text>
            <Text style={Typography.heading1}>Heading 1</Text>
            <Text style={Typography.heading2}>Heading 2</Text>
            <Text style={Typography.heading3}>Heading 3</Text>
            <Text style={Typography.bodyLg}>Body large</Text>
            <Text style={Typography.bodyMd}>Body medium</Text>
            <Text style={[Typography.metric, { color: Colors.teal }]}>12.5</Text>
            <Text style={Typography.caption}>Caption</Text>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
}
