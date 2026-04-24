export const env = {
  apiUrl: process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:8000",
  tokens: {
    ciudadano:
      process.env.EXPO_PUBLIC_CIUDADANO_TOKEN ?? "ciudadano-dev-token",
    reciclador:
      process.env.EXPO_PUBLIC_RECICLADOR_TOKEN ?? "reciclador-dev-token",
    admin: process.env.EXPO_PUBLIC_ADMIN_TOKEN ?? "admin-dev-token",
  },
  mobile: {
    recicladorId: Number(process.env.EXPO_PUBLIC_RECICLADOR_ID ?? "1"),
    latitudInicial: Number(process.env.EXPO_PUBLIC_RECICLADOR_LAT ?? "6.2442"),
    longitudInicial: Number(
      process.env.EXPO_PUBLIC_RECICLADOR_LON ?? "-75.5812"
    ),
    demoTelegramId: Number(process.env.EXPO_PUBLIC_DEMO_TELEGRAM_ID ?? "123456789"),
  },
};
