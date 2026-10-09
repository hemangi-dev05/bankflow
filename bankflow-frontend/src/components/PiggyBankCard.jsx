import { Link } from "react-router-dom";
import { formatCurrency } from "../utils/format";
import PiggyIllustration from "./PiggyIllustration";
import "./PiggyBankCard.css";

export default function PiggyBankCard({ account }) {
  const hasSavings = Number(account.piggyBankBalance) > 0;
  return (
    <div className="piggy-card">
      <div className="piggy-card-body">
        <div className="piggy-card-head">
          <span className="piggy-card-eyebrow">Smart Piggy Bank</span>
          <span className={`badge ${account.roundOffEnabled ? "badge-positive" : "badge-neutral"}`}>
            {account.roundOffEnabled ? "Active" : "Off"}
          </span>
        </div>
        <div className="piggy-card-balance mono">{formatCurrency(account.piggyBankBalance)}</div>
        <p>
          {hasSavings
            ? "Set aside automatically from your payments, withdrawals and transfers."
            : "Nothing saved yet. Your next payment, withdrawal or transfer will start filling it."}
        </p>
        <Link to="/app/piggy-bank" className="btn btn-secondary btn-sm">
          Manage Piggy Bank
        </Link>
      </div>
      <div className="piggy-card-art" aria-hidden="true">
        <PiggyIllustration size={128} />
      </div>
    </div>
  );
}