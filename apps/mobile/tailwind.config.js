/** @type {import('tailwindcss').Config} */
/* Tokens alineados con `src/design-system/tokens/colors.ts` y EcoRuta_Design_System.md */
module.exports = {
  content: ["./App.tsx", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        eco: {
          navy: "#042940",
          teal: "#005C53",
          lime: "#9FC131",
          yellow: "#DBF227",
          sage: "#D6D58E",
          white: "#FFFFFF",
          black: "#0A0A0A",
          danger: "#D94F3D",
          success: "#9FC131",
          warning: "#DBF227",
          info: "#005C53",
          gray: {
            50: "#F9FAFB",
            100: "#F3F4F6",
            200: "#E5E7EB",
            300: "#D1D5DB",
            500: "#6B7280",
            700: "#374151",
            900: "#111827",
          },
        },
      },
      fontFamily: {
        sans: ["DMSans_400Regular"],
        display: ["Sora_700Bold"],
        mono: ["DMMono_500Medium"],
      },
      spacing: {
        "eco-1": 4,
        "eco-2": 8,
        "eco-3": 12,
        "eco-4": 16,
        "eco-5": 20,
        "eco-6": 24,
        "eco-8": 32,
        "eco-10": 40,
        "eco-12": 48,
        "eco-16": 64,
      },
      borderRadius: {
        "eco-sm": 6,
        "eco-md": 12,
        "eco-lg": 16,
        "eco-xl": 24,
      },
    },
  },
  plugins: [],
};
