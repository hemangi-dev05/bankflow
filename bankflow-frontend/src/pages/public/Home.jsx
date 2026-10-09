import { Link } from "react-router-dom";
import "./Home.css";

const WHY = [
  {
    title: "Built around your habits",
    body: "BankFlow adapts to how you actually spend and save, not the other way around.",
  },
  {
    title: "Every rupee accounted for",
    body: "Real-time balances and a full transaction trail for every account you hold.",
  },
  {
    title: "Saving that happens quietly",
    body: "Smart Piggy Bank rounds up everyday transactions so saving needs no discipline.",
  },
];

const PRODUCTS = [
  {
    eyebrow: "01",
    title: "Savings Account",
    body: "For everyday saving and personal banking, with round-off saving built in.",
  },
  {
    eyebrow: "02",
    title: "Current Account",
    body: "Built for frequent transactions and higher day-to-day banking activity.",
  },
  {
    eyebrow: "03",
    title: "Digital Payments",
    body: "Transfer, pay and withdraw in a few steps, with a clear review before you confirm.",
  },
  {
    eyebrow: "04",
    title: "Smart Piggy Bank",
    body: "Every eligible transaction rounds up, and the difference is saved automatically.",
  },
];

export default function Home() {
  return (
    <div className="home">
      <section className="home-hero">
        <div className="container home-hero-inner">
          <h1>Banking built around you.</h1>
          <p className="home-hero-sub">Simple. Secure. Smarter money management.</p>
          <div className="home-hero-cta">
            <Link to="/signup" className="btn btn-primary">Open an Account</Link>
            <Link to="/services" className="btn btn-secondary">Explore Services</Link>
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="container">
          <span className="home-section-eyebrow">Why BankFlow</span>
          <div className="home-why-grid">
            {WHY.map((item) => (
              <div key={item.title} className="home-why-item">
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section home-section-sunken">
        <div className="container">
          <span className="home-section-eyebrow">Services & Products</span>
          <h2 className="home-section-title">Everything you need, nothing you don't.</h2>
          <div className="home-product-grid">
            {PRODUCTS.map((p) => (
              <div key={p.title} className="home-product-item">
                <span className="home-product-number mono">{p.eyebrow}</span>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="container home-about-teaser">
          <div>
            <span className="home-section-eyebrow">About BankFlow</span>
            <h2 className="home-section-title">Money management, made unremarkable.</h2>
            <p>
              BankFlow is designed to make everyday banking easier while helping you build
              better saving habits — quietly, in the background of your day.
            </p>
            <Link to="/about" className="home-about-link">Read more about us →</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
