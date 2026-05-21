/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Fredoka"', '"Poppins"', "system-ui", "sans-serif"],
        sans: ['"Poppins"', '"Inter"', "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          purple: "#9333EA",
          purpleDeep: "#6D28D9",
          orange: "#F97316",
          pink: "#EC4899",
          yellow: "#FBBF24",
          mint: "#10B981",
          sky: "#38BDF8",
          cream: "#FFF7ED",
          ink: "#1F2937",
        },
      },
      backgroundImage: {
        "playful-gradient":
          "linear-gradient(135deg, #FFF7ED 0%, #FEF3C7 40%, #FCE7F3 100%)",
        "brand-gradient":
          "linear-gradient(135deg, #9333EA 0%, #EC4899 60%, #F97316 100%)",
        "mint-gradient":
          "linear-gradient(135deg, #10B981 0%, #38BDF8 100%)",
        "sunshine-gradient":
          "linear-gradient(135deg, #FBBF24 0%, #F97316 100%)",
        "candy-gradient":
          "linear-gradient(135deg, #EC4899 0%, #9333EA 100%)",
        "ocean-gradient":
          "linear-gradient(135deg, #38BDF8 0%, #6D28D9 100%)",
      },
      boxShadow: {
        pop: "0 10px 25px -8px rgba(147, 51, 234, 0.35)",
        popPink: "0 10px 25px -8px rgba(236, 72, 153, 0.45)",
        popOrange: "0 10px 25px -8px rgba(249, 115, 22, 0.45)",
        popMint: "0 10px 25px -8px rgba(16, 185, 129, 0.45)",
        soft: "0 8px 24px -10px rgba(31, 41, 55, 0.15)",
        chunky: "0 6px 0 rgba(0, 0, 0, 0.08)",
      },
      keyframes: {
        wiggle: {
          "0%, 100%": { transform: "rotate(-2deg)" },
          "50%": { transform: "rotate(2deg)" },
        },
        pop: {
          "0%": { transform: "scale(1)" },
          "40%": { transform: "scale(1.18)" },
          "100%": { transform: "scale(1.08)" },
        },
        floaty: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        bounceIn: {
          "0%": { transform: "scale(0.6)", opacity: "0" },
          "60%": { transform: "scale(1.08)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        pulseRing: {
          "0%": { boxShadow: "0 0 0 0 rgba(236, 72, 153, 0.55)" },
          "70%": { boxShadow: "0 0 0 16px rgba(236, 72, 153, 0)" },
          "100%": { boxShadow: "0 0 0 0 rgba(236, 72, 153, 0)" },
        },
      },
      animation: {
        wiggle: "wiggle 0.6s ease-in-out infinite",
        pop: "pop 0.3s ease-out forwards",
        floaty: "floaty 3s ease-in-out infinite",
        bounceIn: "bounceIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        pulseRing: "pulseRing 1.8s ease-out infinite",
      },
    },
  },
  plugins: [],
};
