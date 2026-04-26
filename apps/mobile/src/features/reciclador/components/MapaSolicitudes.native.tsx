import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import WebView from "react-native-webview";

import type { MapaSolicitudesProps } from "./mapaSolicitudesProps";

function buildLeafletHtml(
  solicitudes: MapaSolicitudesProps["solicitudes"],
  rutaIds: number[],
  recicladorLat: number,
  recicladorLng: number,
): string {
  const markers = solicitudes.map((s) => {
    const color =
      s.tipo === "emergencia" ? "#EF4444" : s.estado === "en_camino" ? "#3B82F6" : "#22C55E";
    const label = `#${s.id} · ${s.material ?? "mixto"}`;
    return `addPin(${s.latitud}, ${s.longitud}, "${color}", "${label}");`;
  });

  // Route polyline ordered by rutaIds
  let polylineJs = "";
  if (rutaIds.length > 1) {
    const porId = new Map(solicitudes.map((s) => [s.id, s]));
    const coords = rutaIds
      .map((id) => porId.get(id))
      .filter(Boolean)
      .map((s) => `[${s!.latitud}, ${s!.longitud}]`);
    polylineJs = `L.polyline([${coords.join(",")}], {color:"#005C53",weight:3,dashArray:"8,6"}).addTo(map);`;
  }

  return `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1"/>
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<style>html,body,#map{margin:0;padding:0;width:100%;height:100%;}</style>
</head>
<body>
<div id="map"></div>
<script>
var map = L.map("map", {zoomControl:true, attributionControl:false});
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

function addPin(lat, lon, color, label) {
  var icon = L.divIcon({
    html: '<div style="background:'+color+';width:14px;height:14px;border-radius:50%;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.4)"></div>',
    className: "",
    iconSize: [14,14],
    iconAnchor: [7,7],
  });
  L.marker([lat,lon],{icon:icon}).bindPopup(label).addTo(map);
}

// Reciclador marker (gray)
addPin(${recicladorLat}, ${recicladorLng}, "#6B7280", "Tu posición");

${markers.join("\n")}
${polylineJs}

// Fit bounds
var allLat = [${[recicladorLat, ...solicitudes.map((s) => s.latitud)].join(",")}];
var allLon = [${[recicladorLng, ...solicitudes.map((s) => s.longitud)].join(",")}];
if (allLat.length > 0) {
  map.fitBounds([
    [Math.min(...allLat)-0.005, Math.min(...allLon)-0.005],
    [Math.max(...allLat)+0.005, Math.max(...allLon)+0.005]
  ]);
}
</script>
</body>
</html>`;
}

export function MapaSolicitudes({
  solicitudes,
  rutaIds,
  recicladorLat,
  recicladorLng,
}: MapaSolicitudesProps) {
  const html = useMemo(
    () => buildLeafletHtml(solicitudes, rutaIds, recicladorLat, recicladorLng),
    [solicitudes, rutaIds, recicladorLat, recicladorLng],
  );

  return (
    <View style={styles.container}>
      <WebView
        source={{ html, baseUrl: "https://tile.openstreetmap.org" }}
        style={styles.webview}
        scrollEnabled={false}
        javaScriptEnabled
        originWhitelist={["*"]}
        mixedContentMode="always"
        accessibilityLabel="Mapa de solicitudes"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, width: "100%" },
  webview: { flex: 1 },
});
