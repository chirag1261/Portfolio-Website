import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Warm gold — the highlight/interactive color (links, icons, CTAs).
        primary: {
          50: "#fdf6e3",
          100: "#f9e8bf",
          200: "#f0d38a",
          300: "#e4ba52",
          400: "#d4a017",
          500: "#b8860b",
          600: "#96690a",
          700: "#744f08",
          800: "#543a06",
          900: "#362604",
          950: "#1f1502",
        },
        // Deep navy — the structural/heading color, paired with gold.
        accent: {
          50: "#eef2f6",
          100: "#d7e0e8",
          200: "#b0c1d1",
          300: "#89a2ba",
          400: "#5c7a9a",
          500: "#3d5a7a",
          600: "#2f4762",
          700: "#243b53",
          800: "#1e2a3a",
          900: "#141d29",
          950: "#0a1219",
        },
        dark: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
          950: "#020617",
        },
        // Shades used for page/card backgrounds that fall outside the
        // `stone` scale — kept in sync with the CSS vars in globals.css.
        surface: {
          DEFAULT: "#f5f5f4", // warm off-white page background
          hover: "#fafaf9", // card hover background
          input: "#fafaf9", // form input background
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
        mono: ["var(--font-fira-code)", "monospace"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "fade-up": "fadeUp 0.5s ease-out",
        "slide-in-left": "slideInLeft 0.5s ease-out",
        "slide-in-right": "slideInRight 0.5s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
        float: "float 6s ease-in-out infinite",
        pulse: "pulse 2s ease-in-out infinite",
        "spin-slow": "spin 8s linear infinite",
        "spin-reverse-slow": "spinReverse 11s linear infinite",
        gradient: "gradient 8s ease infinite",
        "text-shimmer": "textShimmer 3s ease-in-out infinite",
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
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        gradient: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        spinReverse: {
          from: { transform: "rotate(360deg)" },
          to: { transform: "rotate(0deg)" },
        },
        textShimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "hero-gradient":
          "linear-gradient(135deg, #1e2a3a 0%, #243b53 50%, #1e2a3a 100%)",
      },
      boxShadow: {
        glow: "0 0 20px rgba(184, 134, 11, 0.3)",
        "glow-lg": "0 0 40px rgba(184, 134, 11, 0.4)",
        "glow-accent": "0 0 20px rgba(30, 42, 58, 0.3)",
      },
    },
  },
  plugins: [],
};

export default config;
