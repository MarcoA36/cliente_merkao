/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        merkao: {
          background: "#F5FBF5",
          surface: "#FFFFFF",
          surfaceAlt: "#EFF5EF",
          surfaceHigh: "#E4EAE4",
          text: "#171D19",
          muted: "#586377",
          border: "#D5DCD6",
          outline: "#BCCAC0",
          primary: "#006948",
          primaryDark: "#005137",
          primarySoft: "#DDF8EA",
          secondary: "#545F73",
          secondarySoft: "#D8E3FB",
          accent: "#677689",
          danger: "#BA1A1A",
          dangerSoft: "#FFDAD6",
          sidebar: "#F5FBF5"
        }
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"]
      },
      borderRadius: {
        merkao: "4px",
        merkaoPanel: "8px"
      }
    }
  },
  plugins: []
};
