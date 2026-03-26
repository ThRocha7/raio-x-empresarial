/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Paleta baseada na identidade visual do cliente: azul escuro, dourado, preto
      colors: {
        brand: {
          navy: "#0B1220", // fundo escuro principal
          "navy-light": "#131E30", // cards e seções levemente mais claras
          gold: "#C9A84C", // dourado principal (CTAs, destaques)
          "gold-light": "#E2C97E", // dourado mais claro para hover
          "gold-muted": "#8C6F30", // dourado mais escuro para bordas
          white: "#F5F3EF", // off-white elegante
          gray: "#6B7280", // texto secundário
          "gray-light": "#9CA3AF",
          "blue-dark": "#262358",
        },
      },
      fontFamily: {
        // Playfair Display: elegante e editorial (títulos)
        display: ["'Playfair Display'", "Georgia", "serif"],
        // DM Sans: clean e moderno (corpo de texto)
        body: ["'DM Sans'", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "fade-up": "fadeUp 0.6s ease-out forwards",
        "pulse-gold": "pulseGold 2s ease-in-out infinite",
        "slide-in": "slideIn 0.4s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseGold: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(201, 168, 76, 0.4)" },
          "50%": { boxShadow: "0 0 0 12px rgba(201, 168, 76, 0)" },
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
