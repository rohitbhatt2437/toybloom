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
        toy: {
          yellow: "#FBBF24",
          amber: "#F59E0B",
          coral: "#F43F5E",
          rose: "#E11D48",
          blue: "#0EA5E9",
          sky: "#38BDF8",
          mint: "#10B981",
          purple: "#8B5CF6",
          lavender: "#C4B5FD",
          birch: "#FFFDF8",
          sand: "#FEF9EE",
          dark: "#0F172A",
          muted: "#64748B",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      borderRadius: {
        "4xl": "2rem",
      },
      boxShadow: {
        "toy": "0 8px 30px -4px rgba(245, 158, 11, 0.12), 0 4px 10px -2px rgba(0, 0, 0, 0.04)",
        "toy-hover": "0 20px 40px -8px rgba(244, 63, 94, 0.2), 0 8px 16px -4px rgba(0, 0, 0, 0.06)",
        "card": "0 2px 12px -2px rgba(15, 23, 42, 0.06)",
      },
    },
  },
  plugins: [],
};
export default config;
