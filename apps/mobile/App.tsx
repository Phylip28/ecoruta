import { StatusBar } from "expo-status-bar";
import { HomeScreen } from "./src/features/home/screens/HomeScreen";

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <HomeScreen />
    </>
  );
}
