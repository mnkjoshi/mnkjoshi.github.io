/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        obsidian: "#0B0F19",
        slate_card: "#1A202C",
        cyber: "#5EEAD4",
        neon: "#B000FF",
        text_primary: "#F8FAFC",
        text_muted: "#94A3B8",
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        fira: ["Fira Code", "monospace"],
      },
    },
  },
  plugins: [],
}

