import type { Config } from "tailwindcss";

import { colors } from "./src/design-system/tokens/colors";

const config: Config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        eco: {
          navy: colors.navy,
          teal: colors.teal,
          lime: colors.lime,
          yellow: colors.yellow,
          sage: colors.sage,
          white: colors.white,
          black: colors.black,
          danger: colors.danger,
          success: colors.success,
          warning: colors.warning,
          info: colors.info,
          gray: {
            50: colors.gray50,
            100: colors.gray100,
            200: colors.gray200,
            300: colors.gray300,
            500: colors.gray500,
            700: colors.gray700,
            900: colors.gray900,
          },
        },
      },
      fontFamily: {
        sans: ["DM Sans", "system-ui", "sans-serif"],
        display: ["Sora", "system-ui", "sans-serif"],
        mono: ["DM Mono", "ui-monospace", "monospace"],
      },
      fontSize: {
        /* Web admin — sección 3.3 */
        display: ["2.5rem", { lineHeight: "3rem", fontWeight: "800" }],
        h1: ["2rem", { lineHeight: "2.5rem", fontWeight: "700" }],
        h2: ["1.5rem", { lineHeight: "2rem", fontWeight: "700" }],
        h3: ["1.25rem", { lineHeight: "1.75rem", fontWeight: "600" }],
        h4: ["1.125rem", { lineHeight: "1.5rem", fontWeight: "600" }],
        body: ["1rem", { lineHeight: "1.625rem", fontWeight: "400" }],
        "body-sm": ["0.875rem", { lineHeight: "1.375rem", fontWeight: "400" }],
        label: ["0.875rem", { lineHeight: "1.25rem", fontWeight: "700" }],
        caption: ["0.75rem", { lineHeight: "1.125rem", fontWeight: "500" }],
        "metric-xl": ["3rem", { lineHeight: "3.5rem", fontWeight: "500" }],
        "metric-lg": ["2rem", { lineHeight: "2.5rem", fontWeight: "500" }],
        "metric-md": ["1.5rem", { lineHeight: "2rem", fontWeight: "500" }],
        code: ["0.875rem", { lineHeight: "1.375rem", fontWeight: "500" }],
      },
      spacing: {
        "eco-1": "4px",
        "eco-2": "8px",
        "eco-3": "12px",
        "eco-4": "16px",
        "eco-5": "20px",
        "eco-6": "24px",
        "eco-8": "32px",
        "eco-10": "40px",
        "eco-12": "48px",
        "eco-16": "64px",
        sidebar: "260px",
        "sidebar-lg": "240px",
        header: "64px",
      },
      maxWidth: {
        admin: "1440px",
      },
      borderRadius: {
        "eco-sm": "6px",
        "eco-md": "12px",
        "eco-lg": "16px",
        "eco-xl": "24px",
      },
      boxShadow: {
        "eco-sm": "0 1px 3px rgba(4,41,64,0.08), 0 1px 2px rgba(4,41,64,0.06)",
        "eco-md": "0 4px 6px rgba(4,41,64,0.07), 0 2px 4px rgba(4,41,64,0.06)",
        "eco-lg": "0 10px 15px rgba(4,41,64,0.10), 0 4px 6px rgba(4,41,64,0.05)",
        "eco-xl": "0 20px 25px rgba(4,41,64,0.10), 0 10px 10px rgba(4,41,64,0.04)",
      },
      screens: {
        md: "768px",
        lg: "1024px",
        xl: "1280px",
      },
      transitionDuration: {
        "eco-fast": "100ms",
        "eco-normal": "200ms",
        "eco-slow": "350ms",
        deliberate: "500ms",
      },
    },
  },
  plugins: [],
};

export default config;
