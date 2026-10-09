import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <span className="footer-logo">BANKFLOW</span>
        <p>Banking built around you. Simple. Secure. Smarter money management.</p>
        <span className="footer-copy">© {new Date().getFullYear()} BankFlow</span>
      </div>
    </footer>
  );
}
