// Lightweight confetti — no dependencies. Drops colored squares from the top.
const COLORS = [
  "#9333EA", "#EC4899", "#F97316", "#FBBF24",
  "#10B981", "#38BDF8", "#6D28D9", "#F472B6",
];

export function fireConfetti(count = 80, duration = 2400) {
  if (typeof document === "undefined") return;
  const pieces = [];
  for (let i = 0; i < count; i++) {
    const el = document.createElement("div");
    el.className = "confetti-piece";
    el.style.left = Math.random() * 100 + "vw";
    el.style.background = COLORS[Math.floor(Math.random() * COLORS.length)];
    el.style.width = 6 + Math.random() * 8 + "px";
    el.style.height = 10 + Math.random() * 10 + "px";
    el.style.animationDuration = (duration / 1000) * (0.7 + Math.random() * 0.6) + "s";
    el.style.animationDelay = Math.random() * 0.4 + "s";
    el.style.transform = `rotate(${Math.random() * 360}deg)`;
    document.body.appendChild(el);
    pieces.push(el);
  }
  setTimeout(() => {
    pieces.forEach((p) => p.remove());
  }, duration + 800);
}

// Small color palette helper for tinting tiles by index
export const TILE_PALETTE = [
  { bg: "bg-purple-100", text: "text-purple-700", ring: "ring-purple-300" },
  { bg: "bg-pink-100",   text: "text-pink-700",   ring: "ring-pink-300"   },
  { bg: "bg-orange-100", text: "text-orange-700", ring: "ring-orange-300" },
  { bg: "bg-amber-100",  text: "text-amber-700",  ring: "ring-amber-300"  },
  { bg: "bg-emerald-100",text: "text-emerald-700",ring: "ring-emerald-300"},
  { bg: "bg-sky-100",    text: "text-sky-700",    ring: "ring-sky-300"    },
  { bg: "bg-indigo-100", text: "text-indigo-700", ring: "ring-indigo-300" },
  { bg: "bg-rose-100",   text: "text-rose-700",   ring: "ring-rose-300"   },
];

export const tileColor = (i) => TILE_PALETTE[i % TILE_PALETTE.length];
