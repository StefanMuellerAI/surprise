import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
        sans: [
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
      colors: {
        ink: {
          DEFAULT: "#111111",
          soft: "#3a3a3a",
          muted: "#6b6b6b",
        },
        paper: {
          DEFAULT: "#fafaf7",
          card: "#ffffff",
          rule: "#e7e5df",
        },
        accent: {
          DEFAULT: "#b45309",
          soft: "#fde68a",
        },
      },
    },
  },
  plugins: [],
};

export default config;
