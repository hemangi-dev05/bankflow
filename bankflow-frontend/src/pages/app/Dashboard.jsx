import RecentActivity from "../../components/RecentActivity";
import { Link, useLocation } from "react-router-dom";
import { PlusCircle, ArrowLeftRight, Send, ArrowUpFromLine } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useAccounts } from "../../context/AccountsContext";
import AccountCard from "../../components/AccountCard";
import ActionTile from "../../components/ActionTile";
import PiggyBankCard from "../../components/PiggyBankCard";
import { LoadingState, ErrorState } from "../../components/States";
import { formatCurrency } from "../../utils/format";
import { useCountUp } from "../../utils/useCountUp";
import "./Dashboard.css";

export default function Dashboard() {
  const { user } = useAuth();
  const { accounts, status, error, refresh, hasAccounts } = useAccounts();
  const location = useLocation();
  const firstName = (user.name || "").split(" ")[0] || "there";
  const justOpenedAccount = Boolean(location.state?.justOpenedAccount);

  const total = accounts.reduce((sum, a) => sum + (Number(a.balance) || 0), 0);
  const animatedTotal = useCountUp(total);

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

      {status === "error" && <ErrorState description={error} onRetry={refresh} />}

      {status === "success" && !hasAccounts && (
        <div className="dashboard-empty">
          <p>You don't have a BankFlow account yet.</p>
          <Link to="/app/open-account" className="btn btn-primary">Open your first account</Link>
        </div>
      )}

      {status === "success" && hasAccounts && (
        <>
          <section className="dashboard-total" aria-label="Total balance">
            <span className="dashboard-total-label">Total balance</span>
            <span className="dashboard-total-amount mono">{formatCurrency(animatedTotal)}</span>
            <span className="dashboard-total-meta">
              Across {accounts.length} {accounts.length === 1 ? "account" : "accounts"}
            </span>
          </section>

          <div className="dashboard-accounts">
            {accounts.map((account, i) => (
              <AccountCard key={account.id} account={account} featured={i === 0} index={i} />
            ))}
          </div>

          <section className="dashboard-section">
            <h2>Quick actions</h2>
            <div className="dashboard-actions">
              <ActionTile to="/app/open-account" Icon={PlusCircle} label="Open Account" />
              <ActionTile to="/app/transfer" Icon={ArrowLeftRight} label="Transfer" />
              <ActionTile to="/app/pay" Icon={Send} label="Pay" />
              <ActionTile to="/app/withdraw" Icon={ArrowUpFromLine} label="Withdraw" />
            </div>
          </section>

                    <RecentActivity accounts={accounts} />

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