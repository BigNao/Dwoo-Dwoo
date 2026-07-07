/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#FAF7F2", // warm off-white — citizen portal background
        ink: "#1B1B1F", // near-black text
        gold: {
          DEFAULT: "#D4A017", // adinkra gold — primary accent
          dark: "#A67B12",
          light: "#F0CD5C",
        },
        kente: {
          DEFAULT: "#B7332A", // hazard / danger red
          dark: "#8C2620",
        },
        forest: {
          DEFAULT: "#1F5C4B", // resolved / verified green
          dark: "#153F34",
          light: "#2E8069",
        },
        asphalt: {
          DEFAULT: "#2B2D31", // admin dashboard base
          light: "#3A3D42",
          dark: "#1C1E21",
        },
        navy: {
          DEFAULT: "#0F2A3D", // official banner / footer background
          light: "#173C56",
          dark: "#081B28",
        },
      },
      fontFamily: {
        display: ["Fraunces", "ui-serif", "Georgia", "serif"],
        body: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["IBM Plex Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      borderRadius: {
        sign: "6px",
      },
    },
  },
  plugins: [],
};
