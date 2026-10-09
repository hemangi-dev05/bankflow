import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  HeartHandshake,
  ReceiptText,
  PiggyBank,
  Wallet,
  Landmark,
  Send,
  UserPlus,
  ArrowLeftRight,
  Sprout,
  ArrowRight,
} from "lucide-react";
import HeroIllustration from "../../components/HeroIllustration";
import "./Home.css";

const WHY = [
  {
    Icon: HeartHandshake,
    title: "Built around your habits",
    body: "BankFlow adapts to how you actually spend and save, not the other way around.",
  },
  {
    Icon: ReceiptText,
    title: "Every rupee accounted for",
    body: "Real-time balances and a full transaction trail for every account you hold.",
  },
  {
    Icon: PiggyBank,
    title: "Saving that happens quietly",
    body: "Smart Piggy Bank sets aside a little from every payment, so saving needs no discipline.",
  },
];

const PRODUCTS = [
  {
    Icon: Wallet,
    title: "Savings Account",
    body: "For everyday saving and personal banking, with Piggy Bank saving built in.",
  },
  {
    Icon: Landmark,
    title: "Current Account",
    body: "Built for frequent transactions and higher day-to-day banking activity.",
  },
  {
    Icon: Send,
    title: "Digital Payments",
    body: "Transfer, pay and withdraw in a few steps, with a clear review before you confirm.",
  },
  {
    Icon: PiggyBank,
    title: "Smart Piggy Bank",
    body: "5% of each payment, withdrawal or transfer is set aside for you, up to ₹100 each time.",
  },
];

const STEPS = [
  { Icon: UserPlus, title: "Open an account", body: "Sign up and open a savings or current account in a few minutes." },
  { Icon: ArrowLeftRight, title: "Pay, transfer, withdraw", body: "Review every amount before you confirm, and see it in your history right away." },
  { Icon: Sprout, title: "Watch savings grow", body: "With Piggy Bank on, small amounts are set aside from each transaction." },
];

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5 },
};

export default function Home() {
  return (
    <div className="home">
      <section className="home-hero">
        <div className="container home-hero-inner">
          <motion.div
            className="home-hero-copy"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="home-hero-pill">Smarter everyday banking</span>
            <h1>Banking built around you.</h1>
            <p className="home-hero-sub">Simple. Secure. Smarter money management.</p>
            <div className="home-hero-cta">
              <Link to="/signup" className="btn btn-primary">Open an Account</Link>
              <Link to="/services" className="btn btn-secondary">Explore Services</Link>
            </div>
          </motion.div>
          <motion.div
            className="home-hero-art"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <HeroIllustration />
          </motion.div>
        </div>
      </section>

      <section className="home-section">
        <div className="container">
          <span className="home-section-eyebrow">Why BankFlow</span>
          <div className="home-why-grid">
            {WHY.map(({ Icon, title, body }, i) => (
              <motion.div key={title} className="home-why-item" {...fadeUp} transition={{ duration: 0.5, delay: i * 0.08 }}>
                <span className="home-icon-badge" aria-hidden="true">
                  <Icon size={22} strokeWidth={1.75} />
                </span>
                <h3>{title}</h3>
                <p>{body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section home-section-sunken">
        <div className="container">
          <span className="home-section-eyebrow">Services & Products</span>
          <h2 className="home-section-title">Everything you need, nothing you don't.</h2>
          <div className="home-product-grid">
            {PRODUCTS.map(({ Icon, title, body }, i) => (
              <motion.div
                key={title}
                className="home-product-item"
                {...fadeUp}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -4 }}
              >
                <span className="home-icon-badge" aria-hidden="true">
                  <Icon size={22} strokeWidth={1.75} />
                </span>
                <h3>{title}</h3>
                <p>{body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="container">
          <span className="home-section-eyebrow">How it works</span>
          <h2 className="home-section-title">Three steps to get going.</h2>
          <div className="home-steps">
            {STEPS.map(({ Icon, title, body }, i) => (
              <motion.div key={title} className="home-step" {...fadeUp} transition={{ duration: 0.5, delay: i * 0.1 }}>
                <span className="home-step-number mono">{i + 1}</span>
                <span className="home-icon-badge" aria-hidden="true">
                  <Icon size={22} strokeWidth={1.75} />
                </span>
                <h3>{title}</h3>
                <p>{body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section home-section-sunken">
        <div className="container home-about-teaser">
          <div>
            <span className="home-section-eyebrow">About BankFlow</span>
            <h2 className="home-section-title">Money management, made unremarkable.</h2>
            <p>
              BankFlow is designed to make everyday banking easier while helping you build
              better saving habits — quietly, in the background of your day.
            </p>
            <Link to="/about" className="home-about-link">
              Read more about us <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="home-cta-band">
        <div className="container home-cta-inner">
          <h2>Ready to bank the BankFlow way?</h2>
          <Link to="/signup" className="btn home-cta-btn">Open an Account</Link>
        </div>
      </section>
    </div>
  );
}