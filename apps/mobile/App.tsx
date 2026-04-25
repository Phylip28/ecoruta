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

import { EcoLogo } from "./src/components/EcoLogo";
import { Colors } from "./src/design-system";
import { AuthProvider, useAuth } from "./src/features/auth/context/AuthContext";
import { LoginScreen } from "./src/features/auth/screens/LoginScreen";
import { HomeScreen } from "./src/features/home/screens/HomeScreen";
import { ecoTheme } from "./src/theme/paperTheme";

function RootNavigator() {
  const { role, login, logout } = useAuth();

  if (!role) {
    return (
      <>
        <StatusBar style="light" />
        <LoginScreen onLogin={login} />
      </>
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      <HomeScreen role={role} onLogout={logout} />
    </>
  );
}

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
        {!fontsLoaded ? (
          <>
            <StatusBar style="light" />
            <View className="flex-1 items-center justify-center bg-black">
              <EcoLogo height={200} width={240} />
              <ActivityIndicator className="mt-6" size="large" color={Colors.lime} />
              <Text className="mt-3 text-base text-eco-gray-200">Cargando EcoRuta…</Text>
            </View>
          </>
        ) : (
          <AuthProvider>
            <RootNavigator />
          </AuthProvider>
        )}
      </PaperProvider>
    </SafeAreaProvider>
  );
}
