import "./InfoPage.css";

const PRINCIPLES = [
  {
    title: "Security",
    body: "Your credentials and account data are handled with care, and every financial action requires a deliberate confirmation.",
  },
  {
    title: "Simplicity",
    body: "Banking shouldn't require a manual. Every flow is short, clear, and tells you exactly what happened.",
  },
  {
    title: "Transparency",
    body: "Balances and Piggy Bank savings come straight from your account — no estimates, no hidden math.",
  },
];

export default function About() {
  return (
    <div className="info-page container">
      <header className="info-hero">
        <span className="home-section-eyebrow">About BankFlow</span>
        <h1>Banking should be simple.</h1>
        <p>
          BankFlow is designed to make everyday money management easier while helping
          people build better saving habits, without asking for more attention than
          banking deserves.
        </p>
      </header>

      <div className="principle-grid">
        {PRINCIPLES.map((p) => (
          <div key={p.title} className="principle-item">
            <h3>{p.title}</h3>
            <p>{p.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
