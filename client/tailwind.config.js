/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1E40AF",
          hover: "#1D4ED8",
          light: "#DBEAFE",
        },
        secondary: {
          DEFAULT: "#059669",
          dark: "#047857",
          light: "#D1FAE5",
        },
        accent: {
          DEFAULT: "#F59E0B",
          dark: "#D97706",
          light: "#FEF3C7",
        },
        danger: {
          DEFAULT: "#DC2626",
          dark: "#B91C1C",
          light: "#FEE2E2",
        },
        background: "#F8FAFC",
        offwhite: {
          DEFAULT: "#FAFAF8",
          surface: "#F3F3F0",
          recessed: "#ECECE8",
        },
        card: "#FFFFFF",
        border: "#E2E8F0",
        ink: "#0F172A",
        muted: "#475569",
        asphalt: {
          DEFAULT: "#0F172A",
          light: "#1E293B",
          dark: "#020617",
        },
      },
      fontFamily: {
        display: ["Poppins", "ui-sans-serif", "system-ui", "sans-serif"],
        body: ["Poppins", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["Poppins", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: {
        sign: "6px",
      },
    },
  },
  plugins: [],
};
