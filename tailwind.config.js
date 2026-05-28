/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: { DEFAULT: "#0A1628", deep: "#06101E" },
        card: { DEFAULT: "#0F1E36", alt: "#1A2B47" },
        border: { DEFAULT: "#1E3358", alt: "#2A4470" },
        fg: { DEFAULT: "#F5F1E8", muted: "#94A3B8" },
        brand: { DEFAULT: "#C9A961", accent: "#E8C97A" },
        success: "#047857",
        warning: "#D97706",
        danger: "#B91C1C",
      },
      fontFamily: {
        serif: ['"Playfair Display"', "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};
