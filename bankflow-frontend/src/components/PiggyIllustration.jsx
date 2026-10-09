import { motion, useReducedMotion } from "framer-motion";

export default function PiggyIllustration({ size = 120 }) {
  const reduce = useReducedMotion();
  return (
    <svg viewBox="0 0 120 100" width={size} height={(size * 100) / 120} role="img" aria-label="Piggy bank">
      <path d="M20 58 q-12 -4 -8 -16" fill="none" strokeWidth="3.5" strokeLinecap="round" style={{ stroke: "var(--color-accent-strong)" }} />
      <rect x="34" y="76" width="11" height="16" rx="4" style={{ fill: "var(--color-accent-strong)" }} />
      <rect x="68" y="76" width="11" height="16" rx="4" style={{ fill: "var(--color-accent-strong)" }} />
      <ellipse cx="56" cy="58" rx="38" ry="27" style={{ fill: "var(--color-accent)" }} />
      <polygon points="70,36 83,24 86,43" style={{ fill: "var(--color-accent-strong)" }} />
      <ellipse cx="95" cy="60" rx="10" ry="8.5" style={{ fill: "var(--color-accent-strong)" }} />
      <circle cx="92" cy="60" r="1.6" style={{ fill: "var(--color-accent-ink)" }} />
      <circle cx="98" cy="60" r="1.6" style={{ fill: "var(--color-accent-ink)" }} />
      <circle cx="80" cy="50" r="2.6" style={{ fill: "#fff" }} />
      <rect x="44" y="33" width="24" height="4.5" rx="2.25" style={{ fill: "var(--color-accent-ink)" }} />
      {!reduce && (
        <motion.circle
          cx="56"
          r="8"
          style={{ fill: "#e9b949" }}
          initial={{ cy: 4, opacity: 0 }}
          animate={{ cy: [4, 31], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 0.8, ease: "easeIn" }}
        />
      )}
      {reduce && <circle cx="56" cy="14" r="8" style={{ fill: "#e9b949" }} />}
    </svg>
  );
}