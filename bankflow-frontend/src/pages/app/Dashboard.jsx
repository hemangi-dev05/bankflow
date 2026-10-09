import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useAccounts } from "../../context/AccountsContext";
import AccountCard from "../../components/AccountCard";
import ActionTile from "../../components/ActionTile";
import PiggyBankCard from "../../components/PiggyBankCard";
import { LoadingState, ErrorState } from "../../components/States";
import "./Dashboard.css";

export default function Dashboard() {
  const { user } = useAuth();
  const { accounts, status, error, refresh, hasAccounts } = useAccounts();
  const location = useLocation();
  const firstName = user.name.split(" ")[0];
  const justOpenedAccount = Boolean(location.state?.justOpenedAccount);

  const greeting = !hasAccounts
    ? { title: `Hello, ${firstName}.`, sub: "Open your first account to start your banking journey." }
    : justOpenedAccount
    ? { title: `Hello, ${firstName}. Welcome to BankFlow.`, sub: "Here's your financial overview for today." }
    : { title: `Hello, ${firstName}. Welcome back.`, sub: "Here's your financial overview for today." };

  const piggyAccount = accounts.find((a) => a.roundOffEnabled);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>{greeting.title}</h1>
        <p>{greeting.sub}</p>
      </header>

      {status === "loading" && <LoadingState rows={2} />}

      {status === "error" && (
        <ErrorState description={error} onRetry={refresh} />
      )}

      {status === "success" && !hasAccounts && (
        <div className="dashboard-empty">
          <p>You don't have a BankFlow account yet.</p>
          <Link to="/app/open-account" className="btn btn-primary">Open your first account</Link>
        </div>
      )}

      {status === "success" && hasAccounts && (
        <>
          <div className="dashboard-accounts">
            {accounts.map((account, i) => (
              <AccountCard key={account.id} account={account} featured={i === 0} />
            ))}
          </div>

          <section className="dashboard-section">
            <h2>Banking</h2>
            <div className="dashboard-actions">
              <ActionTile to="/app/open-account" icon="+" label="Open Account" />
              <ActionTile to="/app/transfer" icon="⇄" label="Transfer" />
              <ActionTile to="/app/pay" icon="◈" label="Pay" />
              <ActionTile to="/app/withdraw" icon="↑" label="Withdraw" />
            </div>
          </section>

          {piggyAccount && (
            <section className="dashboard-section">
              <h2>Piggy Bank</h2>
              <PiggyBankCard account={piggyAccount} />
            </section>
          )}
        </>
      )}
    </div>
  );
}
