import { Link } from "react-router-dom";
import { formatCurrency } from "../utils/format";
import "./PiggyBankCard.css";

export default function PiggyBankCard({ account }) {
  return (
    <div className="piggy-card">
      <div className="piggy-card-head">
        <span className="piggy-card-eyebrow">Smart Piggy Bank</span>
        <span className={`badge ${account.roundOffEnabled ? "badge-positive" : "badge-neutral"}`}>
          {account.roundOffEnabled ? "Active" : "Off"}
        </span>
      </div>
      <div className="piggy-card-balance mono">{formatCurrency(account.piggyBankBalance)}</div>
      <p>Round-ups from your spending, saved automatically.</p>
      <Link to="/app/piggy-bank" className="btn btn-secondary btn-sm">
        Manage Piggy Bank
      </Link>
    </div>
  );
}
