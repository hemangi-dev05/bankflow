import { motion, useReducedMotion } from "framer-motion";

function Coin({ x, y, delay, size = 22 }) {
  const reduce = useReducedMotion();
  return (
    <motion.g
      animate={reduce ? undefined : { y: [0, -10, 0] }}
      transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut", delay }}
    >
      <circle cx={x} cy={y} r={size} style={{ fill: "#e9b949" }} />
      <circle cx={x} cy={y} r={size - 5} style={{ fill: "none", stroke: "#c8962a", strokeWidth: 2 }} />
      <text
        x={x}
        y={y + 6}
        textAnchor="middle"
        fontSize={size * 0.8}
        fontWeight="600"
        style={{ fill: "#7a5a12", fontFamily: "var(--font-mono)" }}
      >
        ₹
      </text>
    </motion.g>
  );
}

export default function HeroIllustration() {
  return (
    <svg viewBox="0 0 480 400" role="img" aria-label="A phone showing a BankFlow balance and recent transactions" className="hero-illustration">
      <circle cx="240" cy="205" r="178" style={{ fill: "var(--color-accent-soft)" }} />
      <circle cx="240" cy="205" r="128" style={{ fill: "var(--color-surface)", opacity: 0.55 }} />

      <rect x="158" y="38" width="164" height="326" rx="30" style={{ fill: "var(--color-ink)" }} />
      <rect x="168" y="54" width="144" height="294" rx="22" style={{ fill: "var(--color-surface)" }} />
      <rect x="222" y="60" width="36" height="6" rx="3" style={{ fill: "var(--color-border-strong)" }} />

      <rect x="180" y="84" width="120" height="76" rx="14" style={{ fill: "var(--color-accent)" }} />
      <rect x="192" y="98" width="42" height="6" rx="3" style={{ fill: "#fff", opacity: 0.6 }} />
      <text x="192" y="132" fontSize="19" fontWeight="600" style={{ fill: "#fff", fontFamily: "var(--font-mono)" }}>
        ₹12,450
      </text>
      <rect x="192" y="142" width="64" height="5" rx="2.5" style={{ fill: "#fff", opacity: 0.45 }} />

      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(0 ${i * 50})`}>
          <circle cx="198" cy="196" r="14" style={{ fill: i === 1 ? "var(--color-negative-soft)" : "var(--color-positive-soft)" }} />
          <rect x="220" y="187" width={i === 0 ? 52 : 44} height="6" rx="3" style={{ fill: "var(--color-ink)", opacity: 0.75 }} />
          <rect x="220" y="200" width="30" height="5" rx="2.5" style={{ fill: "var(--color-text-faint)", opacity: 0.6 }} />
          <rect x="268" y="192" width="26" height="6" rx="3" style={{ fill: i === 1 ? "var(--color-negative)" : "var(--color-positive)" }} />
        </g>
      ))}

      <Coin x={92} y={118} delay={0} size={24} />
      <Coin x={394} y={86} delay={0.8} size={18} />
      <Coin x={410} y={286} delay={1.6} size={26} />
      <Coin x={78} y={290} delay={2.2} size={16} />
    </svg>
  );
}