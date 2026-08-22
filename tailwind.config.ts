import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#101815",
        paper: "#F6F7F1",
        court: {
          DEFAULT: "#1B4332",
          light: "#2D6A4F",
          dark: "#0D211A",
        },
        volt: "#D6FF4A",
        whistle: "#FF5A36",
        line: "#E4E2D8",
        muted: "#697268",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        card: "18px",
      },
      boxShadow: {
        card: "0 1px 0 rgba(16,24,21,0.04), 0 12px 24px -16px rgba(16,24,21,0.25)",
        pop: "0 20px 40px -20px rgba(16,24,21,0.35)",
      },
      keyframes: {
        rise: {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseRing: {
          "0%": { boxShadow: "0 0 0 0 rgba(214,255,74,0.55)" },
          "100%": { boxShadow: "0 0 0 14px rgba(214,255,74,0)" },
        },
        tick: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-2px)" },
        },
      },
      animation: {
        rise: "rise 0.6s cubic-bezier(0.16,1,0.3,1) both",
        pulseRing: "pulseRing 1.6s ease-out infinite",
        tick: "tick 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
