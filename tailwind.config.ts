import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        luxury: {
          green: {
            DEFAULT: "#1A5F4A",
            light: "#2A7F6A",
            dark: "#0F2A1E",
            50: "#E8F5F0",
            100: "#C5E5D8",
            200: "#9DD4BF",
            300: "#72C2A5",
            400: "#4DB38E",
            500: "#1A5F4A", // Primaire
            600: "#16523F",
            700: "#124434",
            800: "#0F2A1E", // Foncé
            900: "#0A1F16",
          },
          gold: {
            DEFAULT: "#D4A843",
            light: "#E8D5B7",
            dark: "#B8962E",
            50: "#FBF5E8",
            100: "#F5E8CC",
            200: "#EDD9A3",
            300: "#E5CA7A",
            400: "#DCBB5C",
            500: "#D4A843", // Secondaire
            600: "#C49A35",
            700: "#A8812B",
            800: "#B8962E",
            900: "#8C6A22",
          },
          sand: {
            DEFAULT: "#E8D5B7",
            light: "#F9F6F0",
            dark: "#D4C4A8",
          },
        },
      },
      fontFamily: {
        display: ["Playfair Display", "serif"],
        body: ["Inter", "Lato", "sans-serif"],
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
      },
      boxShadow: {
        'luxury': '0 4px 20px rgba(15, 42, 30, 0.08)',
        'card': '0 2px 15px rgba(0, 0, 0, 0.06)',
        'elevated': '0 10px 40px rgba(15, 42, 30, 0.12)',
      },
    },
  },
  plugins: [],
};

export default config;