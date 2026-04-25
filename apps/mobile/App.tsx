import "./global.css";

import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import { DMMono_500Medium } from "@expo-google-fonts/dm-mono";
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
} from "@expo-google-fonts/dm-sans";
import {
  Sora_600SemiBold,
  Sora_700Bold,
  Sora_800ExtraBold,
} from "@expo-google-fonts/sora";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ActivityIndicator, Text, View } from "react-native";

import { Colors } from "./src/design-system";
import { HomeScreen } from "./src/features/home/screens/HomeScreen";
import { ecoTheme } from "./src/theme/paperTheme";

export default function App() {
  const [fontsLoaded] = useFonts({
    Sora_600SemiBold,
    Sora_700Bold,
    Sora_800ExtraBold,
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
    DMMono_500Medium,
  });

  return (
    <SafeAreaProvider>
      <PaperProvider theme={ecoTheme}>
        <StatusBar style="dark" />
        {!fontsLoaded ? (
          <View className="flex-1 items-center justify-center bg-eco-white">
            <ActivityIndicator size="large" color={Colors.teal} />
            <Text className="mt-3 font-sans text-base text-eco-gray-700">Cargando EcoRuta…</Text>
          </View>
        ) : (
          <HomeScreen />
        )}
      </PaperProvider>
    </SafeAreaProvider>
  );
}
