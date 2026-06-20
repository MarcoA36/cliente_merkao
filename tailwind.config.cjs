/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        merkao: {
          background: "#F6F7F9",
          surface: "#FFFFFF",
          surfaceAlt: "#F1F4F7",
          surfaceHigh: "#E8EDF3",
          text: "#111827",
          muted: "#6B7280",
          border: "#E5E7EB",
          outline: "#D1D5DB",
          primary: "#007A4D",
          primaryDark: "#005C3A",
          primarySoft: "#E6F7EF",
          secondary: "#4F46E5",
          secondarySoft: "#EEF2FF",
          accent: "#F28C18",
          danger: "#DC2626",
          dangerSoft: "#FEE2E2",
          sidebar: "#FFFFFF"
        }
      },
      borderRadius: {
        merkao: "8px"
      }
    }
  },
  plugins: []
};
