/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          // Azul da logo Rafael Lopes
          navy: "#0E2140",
          "navy-mid": "#162D55",
          "navy-light": "#1E3D6E",
          // Dourado
          gold: "#C9A84C",
          "gold-light": "#E2C97E",
          "gold-muted": "#8C6F30",
          // Fundo claro
          white: "#F7F5F2",
          off: "#EEECEA",
        },
      },
      fontFamily: {
        display: ["'Playfair Display'", "Georgia", "serif"],
        body: ["'DM Sans'", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "fade-up": "fadeUp 0.6s ease-out forwards",
        "pulse-gold": "pulseGold 2s ease-in-out infinite",
        "slide-in": "slideIn 0.4s ease-out forwards",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseGold: {
          "0%,100%": { boxShadow: "0 0 0 0 rgba(201,168,76,0.4)" },
          "50%": { boxShadow: "0 0 0 12px rgba(201,168,76,0)" },
        },
        slideIn: {
          "0%": { opacity: "0", transform: "translateX(-10px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [],
};
