/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        eco: {
          moss: "#1B5E20",
          fern: "#2E7D32",
          dew: "#A7F3D0",
          bark: "#1E293B",
          mist: "#F1F5F9",
          sun: "#F59E0B",
          ember: "#B91C1C"
        }
      },
      boxShadow: {
        soft: "0 10px 30px -15px rgba(17, 24, 39, 0.35)",
      }
    },
  },
  plugins: [],
};
