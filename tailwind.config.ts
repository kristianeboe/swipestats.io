import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  darkMode: ["class"],
  content: ["./src/**/*.tsx"],
  safelist: [
    // Main profile gradients
    "from-rose-500",
    "to-rose-300",
    "from-blue-500",
    "to-blue-300",
    "from-pink-500",
    "to-pink-300",
    // Fallback gradients
    "from-teal-400",
    "to-teal-200",
    "from-purple-600",
    "to-purple-300",
    "from-fuchsia-500",
    "to-fuchsia-300",
    "from-cyan-500",
    "to-cyan-300",
    "from-orange-500",
    "to-orange-300",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", ...fontFamily.sans],
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
        },
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "background-shine": {
          from: {
            backgroundPosition: "0 0",
          },
          to: {
            backgroundPosition: "-200% 0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "background-shine": "background-shine 2s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
