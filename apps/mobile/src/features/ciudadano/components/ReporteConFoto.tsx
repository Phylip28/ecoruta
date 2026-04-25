import { useCallback, useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { ActivityIndicator, Button, Card, Text, TextInput } from "react-native-paper";

import { crearReporte } from "../../../core/api/client";
import { env } from "../../../config/env";
import {
  BorderRadius,
  Colors,
  EcoIcons,
  FontFamily,
  Shadows,
  Spacing,
  Typography,
  touchTarget,
} from "../../../design-system";

type FeedbackTipo = "exito" | "error" | "info" | "advertencia";
type TipoReporte = "emergencia" | "solicitud";

type ReporteConFotoProps = {
  onFeedback: (mensaje: string, tipo?: FeedbackTipo) => void;
};

/** FE-02 — Foto + GPS + tipo IA + descripción + envío real */
export function ReporteConFoto({ onFeedback }: ReporteConFotoProps) {
  const [fotoUri, setFotoUri] = useState<string | null>(null);
  const [lat, setLat] = useState(env.mobile.latitudInicial);
  const [lon, setLon] = useState(env.mobile.longitudInicial);
  const [gpsLabel, setGpsLabel] = useState("Obteniendo ubicación…");
  const [gpsLoading, setGpsLoading] = useState(false);
  const [tipo, setTipo] = useState<TipoReporte>("emergencia");
  const [descripcion, setDescripcion] = useState("");
  const [iaLoading, setIaLoading] = useState(false);
  const [iaSugerencia, setIaSugerencia] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const refrescarGPS = useCallback(async () => {
    setGpsLoading(true);
    setGpsLabel("Obteniendo ubicación…");
    try {
      const perm = await Location.requestForegroundPermissionsAsync();
      if (perm.status !== "granted") {
        setGpsLabel("Permiso denegado — coordenadas demo");
        return;
      }
      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setLat(pos.coords.latitude);
      setLon(pos.coords.longitude);
      setGpsLabel(`${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`);
    } catch {
      setGpsLabel("Sin señal — coordenadas demo");
    } finally {
      setGpsLoading(false);
    }
  }, []);

  useEffect(() => { void refrescarGPS(); }, [refrescarGPS]);

  async function elegirFoto(origen: "camara" | "galeria") {
    const perm = origen === "camara"
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      onFeedback(
        origen === "camara"
          ? "Necesitamos permiso para usar la cámara."
          : "Necesitamos permiso para acceder a la galería.",
        "advertencia",
      );
      return;
    }
    const result = origen === "camara"
      ? await ImagePicker.launchCameraAsync({ quality: 0.7, allowsEditing: true })
      : await ImagePicker.launchImageLibraryAsync({ quality: 0.7, allowsEditing: true });
    if (result.canceled || !result.assets[0]) return;
    setFotoUri(result.assets[0].uri);
    setIaSugerencia(null);
    // Simular IA (FE-02 + BE-06)
    setIaLoading(true);
    setTimeout(() => {
      const esEmergencia = descripcion.toLowerCase().includes("urgente") || descripcion.toLowerCase().includes("emergencia");
      const sugerencia: TipoReporte = esEmergencia ? "emergencia" : "solicitud";
      setTipo(sugerencia);
      setIaSugerencia(sugerencia === "emergencia"
        ? "IA detectó posible EMERGENCIA — confirma si es correcto."
        : "IA detectó posible SOLICITUD de recolección.");
      setIaLoading(false);
    }, 800);
  }

  async function enviar() {
    setEnviando(true);
    try {
      const data = await crearReporte({
        tipo,
        latitud: lat,
        longitud: lon,
        descripcion: descripcion || undefined,
        foto_url: fotoUri ?? undefined,
      });
      onFeedback(`Reporte #${data.id} enviado correctamente.`, "exito");
      setDescripcion("");
      setFotoUri(null);
      setIaSugerencia(null);
    } catch (err) {
      onFeedback(
        err instanceof Error ? err.message : "No pudimos enviar el reporte.",
        "error",
      );
    } finally {
      setEnviando(false);
    }
  }

  const tipoConfig = {
    emergencia: { color: Colors.danger, icon: EcoIcons.emergency, label: "Emergencia" },
    solicitud: { color: Colors.teal, icon: EcoIcons.collection, label: "Solicitud" },
  };

  return (
    <Card mode="elevated" style={[styles.card, Shadows.md]}>
      {/* ── Header ── */}
      <View style={styles.cardHeader}>
        <View style={[styles.headerIcon, { backgroundColor: `${Colors.danger}15` }]}>
          <MaterialCommunityIcons name="camera-outline" size={20} color={Colors.danger} />
        </View>
        <View>
          <Text style={[Typography.heading3, { color: Colors.navy }]}>Reportar con evidencia</Text>
        </View>
      </View>

      <View style={styles.body}>
        {/* ── Paso 1: Foto ── */}
        <View style={styles.step}>
          <View style={styles.stepNumRow}>
            <View style={styles.stepNum}><Text style={styles.stepNumText}>1</Text></View>
            <Text style={styles.stepLabel}>Evidencia fotográfica</Text>
          </View>

          {fotoUri ? (
            <View style={styles.photoPreviewWrap}>
              <Image
                source={{ uri: fotoUri }}
                style={styles.photoPreview}
                resizeMode="cover"
                accessibilityLabel="Vista previa del reporte"
              />
              <Pressable
                style={styles.photoRemove}
                onPress={() => { setFotoUri(null); setIaSugerencia(null); }}
                accessibilityLabel="Quitar foto"
              >
                <MaterialCommunityIcons name="close-circle" size={22} color={Colors.white} />
              </Pressable>
            </View>
          ) : (
            <View style={styles.photoButtons}>
              <Button
                mode="outlined"
                icon={EcoIcons.camera}
                onPress={() => void elegirFoto("camara")}
                textColor={Colors.teal}
                buttonColor={Colors.white}
                style={styles.photoBtn}
                contentStyle={styles.photoBtnContent}
                labelStyle={styles.photoBtnLabel}
                accessibilityLabel="Tomar foto con la cámara"
              >
                Cámara
              </Button>
              <Button
                mode="outlined"
                icon="image"
                onPress={() => void elegirFoto("galeria")}
                textColor={Colors.teal}
                buttonColor={Colors.white}
                style={styles.photoBtn}
                contentStyle={styles.photoBtnContent}
                labelStyle={styles.photoBtnLabel}
                accessibilityLabel="Elegir foto de la galería"
              >
                Galería
              </Button>
            </View>
          )}

          {iaLoading && (
            <View style={styles.iaRow}>
              <ActivityIndicator size="small" color={Colors.teal} />
              <Text style={[Typography.bodySm, { color: Colors.gray700 }]}>Clasificando imagen…</Text>
            </View>
          )}
          {iaSugerencia && !iaLoading && (
            <View style={[styles.iaBanner, { borderColor: `${Colors.teal}40`, backgroundColor: `${Colors.teal}0A` }]}>
              <MaterialCommunityIcons name="robot-outline" size={16} color={Colors.teal} />
              <Text style={[Typography.bodySm, { color: Colors.teal, flex: 1 }]}>{iaSugerencia}</Text>
            </View>
          )}
        </View>

        {/* ── Paso 2: GPS ── */}
        <View style={styles.step}>
          <View style={styles.stepNumRow}>
            <View style={styles.stepNum}><Text style={styles.stepNumText}>2</Text></View>
            <Text style={styles.stepLabel}>Ubicación GPS</Text>
          </View>
          <Pressable
            style={styles.gpsRow}
            onPress={() => void refrescarGPS()}
            accessibilityLabel="Actualizar ubicación GPS"
          >
            <View style={styles.gpsIconWrap}>
              {gpsLoading
                ? <ActivityIndicator size="small" color={Colors.teal} />
                : <MaterialCommunityIcons name="crosshairs-gps" size={18} color={Colors.teal} />
              }
            </View>
            <Text style={styles.gpsLabel} numberOfLines={2}>{gpsLabel}</Text>
            <MaterialCommunityIcons name="refresh" size={18} color={Colors.gray500} />
          </Pressable>
        </View>

        {/* ── Paso 3: Tipo ── */}
        <View style={styles.step}>
          <View style={styles.stepNumRow}>
            <View style={styles.stepNum}><Text style={styles.stepNumText}>3</Text></View>
            <Text style={styles.stepLabel}>Tipo de reporte</Text>
          </View>
          <View style={styles.tipoRow}>
            {(["emergencia", "solicitud"] as TipoReporte[]).map((t) => {
              const cfg = tipoConfig[t];
              const active = tipo === t;
              return (
                <Pressable
                  key={t}
                  onPress={() => setTipo(t)}
                  style={[
                    styles.tipoBtn,
                    { borderColor: active ? cfg.color : Colors.gray200 },
                    active && { backgroundColor: `${cfg.color}12` },
                  ]}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: active }}
                  accessibilityLabel={`Tipo ${cfg.label}`}
                >
                  <MaterialCommunityIcons
                    name={cfg.icon as any}
                    size={20}
                    color={active ? cfg.color : Colors.gray500}
                  />
                  <Text style={[styles.tipoBtnLabel, { color: active ? cfg.color : Colors.gray500 }]}>
                    {cfg.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* ── Paso 4: Descripción ── */}
        <View style={styles.step}>
          <View style={styles.stepNumRow}>
            <View style={styles.stepNum}><Text style={styles.stepNumText}>4</Text></View>
            <Text style={styles.stepLabel}>Descripción</Text>
            <Text style={styles.opcional}>(opcional)</Text>
          </View>
          <TextInput
            mode="outlined"
            label="¿Qué observas en el lugar?"
            value={descripcion}
            onChangeText={setDescripcion}
            multiline
            numberOfLines={3}
            style={styles.input}
            outlineStyle={{ borderRadius: BorderRadius.md }}
          />
        </View>

        {/* ── CTA ── */}
        <Button
          mode="contained"
          icon={tipoConfig[tipo].icon}
          buttonColor={tipoConfig[tipo].color}
          textColor={Colors.white}
          contentStyle={styles.ctaContent}
          style={styles.ctaButton}
          loading={enviando}
          disabled={enviando}
          onPress={() => void enviar()}
          accessibilityLabel="Enviar reporte"
        >
          Enviar reporte
        </Button>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.white,
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.s3,
    backgroundColor: `${Colors.danger}08`,
    borderBottomWidth: 1,
    borderBottomColor: `${Colors.danger}18`,
    paddingHorizontal: Spacing.s4,
    paddingVertical: Spacing.s3,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  body: {
    padding: Spacing.s4,
    gap: Spacing.s4,
  },

  // ── Steps ──
  step: {
    gap: Spacing.s2,
  },
  stepNumRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.s2,
  },
  stepNum: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.navy,
    alignItems: "center",
    justifyContent: "center",
  },
  stepNumText: {
    fontFamily: FontFamily.dmSans700,
    fontSize: 11,
    color: Colors.white,
  },
  stepLabel: {
    fontFamily: FontFamily.dmSans700,
    fontSize: 13,
    color: Colors.navy,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  opcional: {
    fontFamily: FontFamily.dmSans400,
    fontSize: 12,
    color: Colors.gray500,
  },

  // ── Photo ──
  photoButtons: {
    flexDirection: "row",
    gap: Spacing.s2,
  },
  photoBtn: {
    flex: 1,
    borderRadius: BorderRadius.lg,
    borderColor: Colors.teal,
  },
  photoBtnContent: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  photoBtnLabel: {
    fontFamily: FontFamily.dmSans700,
    fontSize: 15,
  },
  photoPreviewWrap: {
    position: "relative",
  },
  photoPreview: {
    width: "100%",
    height: 160,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.gray100,
  },
  photoRemove: {
    position: "absolute",
    top: Spacing.s2,
    right: Spacing.s2,
    backgroundColor: "rgba(0,0,0,0.45)",
    borderRadius: BorderRadius.full,
    padding: 2,
  },
  iaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.s2,
    paddingVertical: Spacing.s1,
  },
  iaBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.s2,
    padding: Spacing.s3,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },

  // ── GPS ──
  gpsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.s2,
    padding: Spacing.s3,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.gray50,
    borderWidth: 1,
    borderColor: Colors.gray200,
    minHeight: 48,
  },
  gpsIconWrap: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.md,
    backgroundColor: `${Colors.teal}15`,
    alignItems: "center",
    justifyContent: "center",
  },
  gpsLabel: {
    flex: 1,
    fontFamily: FontFamily.dmSans400,
    fontSize: 13,
    color: Colors.gray700,
  },

  // ── Tipo ──
  tipoRow: {
    flexDirection: "row",
    gap: Spacing.s2,
  },
  tipoBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.s2,
    paddingVertical: Spacing.s3,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    minHeight: 48,
  },
  tipoBtnLabel: {
    fontFamily: FontFamily.dmSans700,
    fontSize: 14,
  },

  // ── Input ──
  input: {
    backgroundColor: Colors.white,
  },

  // ── CTA ──
  ctaContent: {
    minHeight: touchTarget.ctaCiudadano,
  },
  ctaButton: {
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.s1,
  },
});
