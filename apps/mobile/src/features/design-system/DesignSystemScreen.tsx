import { ScrollView, Text, View } from "react-native";
import { Appbar, Card } from "react-native-paper";

import {
  BorderRadius,
  Colors,
  Spacing,
  Typography,
  chartColors,
} from "../../design-system";

type DesignSystemScreenProps = {
  onClose: () => void;
};

const baseKeys = ["navy", "teal", "lime", "yellow", "sage", "white", "black"] as const;
const semanticKeys = ["success", "warning", "danger", "info"] as const;
const grayKeys = ["gray900", "gray700", "gray500", "gray300", "gray200", "gray100", "gray50"] as const;

export function DesignSystemScreen({ onClose }: DesignSystemScreenProps) {
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
          Misma referencia que el admin en <Text style={Typography.labelMd}>/design-system</Text>: tokens en{" "}
          <Text style={Typography.labelMd}>src/design-system/</Text> y utilidades{" "}
          <Text style={Typography.labelMd}>eco.*</Text> (NativeWind).
        </Text>

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
                  <Text style={[Typography.caption, { fontFamily: Typography.metric.fontFamily }]}>
                    {Colors[key]}
                  </Text>
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
                  <Text style={[Typography.caption, { fontFamily: Typography.metric.fontFamily }]}>
                    {Colors[key]}
                  </Text>
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
                  <Text style={[Typography.caption, { fontFamily: Typography.metric.fontFamily }]}>
                    {Colors[key]}
                  </Text>
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
