import "./InfoPage.css";

const SERVICES = [
  {
    title: "Savings Account",
    body:
      "A straightforward account for everyday saving and personal banking. Track your balance, review every transaction, and opt into Piggy Bank round-ups to save without extra effort.",
    points: ["No minimum balance friction", "Full transaction history", "Piggy Bank eligible"],
  },
  {
    title: "Current Account",
    body:
      "Built for account holders who move money frequently. The same clarity as Savings, sized for a higher volume of transfers, payments and withdrawals.",
    points: ["Suited to frequent transactions", "Instant transfer confirmation", "Piggy Bank eligible"],
  },
  {
    title: "Digital Payments",
    body:
      "Transfer between accounts, pay out, or withdraw — each through a short, deliberate flow: enter details, review, confirm. No accidental taps on money movements.",
    points: ["Review before every confirmation", "Clear success and failure states", "Readable transaction remarks"],
  },
  {
    title: "Smart Piggy Bank",
    body:
      "When enabled on an account, every eligible transaction rounds up to the nearest ten rupees, and the difference is set aside automatically as savings.",
    points: ["Enable or disable per account", "Withdraw your Piggy Bank savings anytime", "No manual transfers required"],
  },
];

export default function Services() {
  return (
    <div className="info-page container">
      <header className="info-hero">
        <span className="home-section-eyebrow">Services & Products</span>
        <h1>What BankFlow offers.</h1>
        <p>A small set of well-built products, not a menu of upsells.</p>
      </header>

      <div className="service-list">
        {SERVICES.map((s) => (
          <div key={s.title} className="service-item">
            <h2>{s.title}</h2>
            <p>{s.body}</p>
            <ul>
              {s.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
