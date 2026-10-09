import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useAccounts } from "../../context/AccountsContext";
import { ACCOUNT_TYPE_LABELS, formatCurrency, formatDate } from "../../utils/format";
import { LoadingState } from "../../components/States";
import "./Profile.css";

export default function Profile() {
  const { user } = useAuth();
  const { accounts, status } = useAccounts();
  const [copiedId, setCopiedId] = useState(null);

  async function handleCopy(accountId, accountNumber) {
    try {
      await navigator.clipboard.writeText(accountNumber);
      setCopiedId(accountId);
      setTimeout(() => setCopiedId((prev) => (prev === accountId ? null : prev)), 1500);
    } catch {
      // Clipboard API can fail (no permission, insecure context, etc.) — the
      // number is still visible on screen for manual copy, so just no-op.
    }
  }

  return (
    <div className="profile">
      <header className="dashboard-header">
        <h1>Your Profile</h1>
        <p>Your account details, as held by BankFlow.</p>
      </header>

      <div className="card profile-card">
        <div className="profile-row">
          <span>Full name</span>
          <span>{user.name}</span>
        </div>
        <div className="profile-row">
          <span>Email</span>
          <span>{user.email}</span>
        </div>
        <div className="profile-row">
          <span>Phone</span>
          <span>{user.phone}</span>
        </div>
      </div>

      <h2 className="profile-subhead">Accounts</h2>

      {status === "loading" && <LoadingState rows={2} />}

      {status === "success" && (
        <div className="profile-account-list">
          {accounts.map((a) => (
            <div key={a.id} className="card profile-account">
              <div>
                <span className="profile-account-type">{ACCOUNT_TYPE_LABELS[a.accountType]}</span>
                <span className="profile-account-number mono">{a.accountNumber}</span>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm profile-account-copy"
                  onClick={() => handleCopy(a.id, a.accountNumber)}
                >
                  {copiedId === a.id ? "Copied!" : "Copy"}
                </button>
              </div>
              <div className="profile-account-meta">
                <span className="mono">{formatCurrency(a.balance)}</span>
                <span>Opened {formatDate(a.openedDate)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}