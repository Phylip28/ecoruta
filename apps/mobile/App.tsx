import { StatusBar } from "expo-status-bar";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { HomeScreen } from "./src/features/home/screens/HomeScreen";
import { ecoTheme } from "./src/theme/paperTheme";

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={ecoTheme}>
        <StatusBar style="dark" />
        <HomeScreen />
      </PaperProvider>
    </SafeAreaProvider>
  );
}
