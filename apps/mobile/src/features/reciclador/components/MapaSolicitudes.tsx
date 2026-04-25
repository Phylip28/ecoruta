import { Text, View } from "react-native";
import { Icon } from "react-native-paper";

import { EcoIcons } from "../../../design-system";

import type { MapaSolicitudesProps } from "./mapaSolicitudesProps";

/** Vista web y resolución de tipos TS; en iOS/Android Metro usa `MapaSolicitudes.native.tsx`. */
export function MapaSolicitudes({ solicitudes }: MapaSolicitudesProps) {
  return (
    <View className="h-56 items-center justify-center rounded-eco-lg border border-eco-gray-200 bg-eco-gray-100 px-eco-4">
      <Icon source={EcoIcons.pendingPin} size={40} color="#005C53" />
      <Text className="mt-eco-2 text-center font-sans text-sm text-eco-gray-700">
        Mapa interactivo (pines y ruta) está disponible en la app iOS/Android. En web hay{" "}
        {solicitudes.length} punto(s) en la sesión.
      </Text>
    </View>
  );
}
