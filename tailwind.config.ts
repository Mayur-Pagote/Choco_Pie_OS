import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./store/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pixel: {
          panel: "#d3d4d5",
          frame: "#c8cccf",
          accent: "#d5406b",
          accentDark: "#8a2343",
          shadow: "#5e6168",
          highlight: "#eef1f4",
          blue: "#3a7dc6",
        },
      },
      boxShadow: {
        panel: "0 -1px 0 rgba(255,255,255,0.9), 0 -2px 10px rgba(20,22,28,0.25)",
        window:
          "0 0 0 1px rgba(69,74,81,0.9), 0 18px 40px rgba(12,15,24,0.35)",
      },
      backgroundImage: {
        scanlines:
          "linear-gradient(to bottom, rgba(255,255,255,0.04), rgba(255,255,255,0.01) 50%, rgba(0,0,0,0.08))",
      },
      animation: {
        "panel-rise": "panel-rise 280ms ease-out",
        "window-in": "window-in 220ms ease-out",
        "boot-fade": "boot-fade 420ms ease forwards",
      },
      keyframes: {
        "panel-rise": {
          "0%": { transform: "translateY(18px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "window-in": {
          "0%": { transform: "scale(0.97)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "boot-fade": {
          "0%": { opacity: "1" },
          "100%": { opacity: "0", visibility: "hidden" },
        },
      },
    },
  },
  plugins: [],
};

export default config;

