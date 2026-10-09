import { Link } from "react-router-dom";
import { ACCOUNT_TYPE_LABELS, formatCurrency, maskAccountNumber } from "../utils/format";
import "./AccountCard.css";

export default function AccountCard({ account, featured = false }) {
  return (
    <div className={`account-card ${featured ? "account-card-featured" : ""}`}>
      <div className="account-card-top">
        <span className="account-card-type">
          {ACCOUNT_TYPE_LABELS[account.accountType] || account.accountType}
        </span>
        {account.roundOffEnabled && (
          <span className="badge badge-accent">Piggy Bank on</span>
        )}
      </div>

      <div className="account-card-number mono">{maskAccountNumber(account.accountNumber)}</div>

      <div className="account-card-balance">
        <span className="mono">{formatCurrency(account.balance)}</span>
        <span className="account-card-balance-label">Available balance</span>
      </div>

      {account.piggyBankBalance > 0 && (
        <div className="account-card-piggy">
          <span>Piggy Bank</span>
          <span className="mono">{formatCurrency(account.piggyBankBalance)}</span>
        </div>
      )}

      <Link to="/app/transactions" state={{ accountId: account.id }} className="account-card-link">
        View transactions →
      </Link>
    </div>
  );
}
