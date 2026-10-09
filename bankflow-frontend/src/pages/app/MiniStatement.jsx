import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { transactionApi } from "../../api/transactionApi";
import { useAccounts } from "../../context/AccountsContext";
import AccountSelector from "../../components/AccountSelector";
import TransactionRow from "../../components/TransactionRow";
import TransactionDetailModal from "../../components/TransactionDetailModal";
import { LoadingState, EmptyState, ErrorState } from "../../components/States";
import "./TransactionHistory.css";

export default function MiniStatement() {
  const { accounts, status: accountsStatus } = useAccounts();
  const [accountId, setAccountId] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (accountId === null && accounts.length > 0) {
      setAccountId(accounts[0].id);
    }
  }, [accounts, accountId]);

  function load() {
    if (!accountId) return;
    setStatus("loading");
    setError(null);
    transactionApi
      .getMiniStatement(accountId)
      .then((data) => {
        setTransactions(data);
        setStatus("success");
      })
      .catch((err) => {
        setError(err.message);
        setStatus("error");
      });
  }

  useEffect(load, [accountId]);

  return (
    <div className="transaction-history">
      <header className="dashboard-header">
        <h1>Mini Statement</h1>
        <p>Your most recent activity, at a glance.</p>
      </header>

      {accountsStatus === "success" && accounts.length > 1 && (
        <div className="transaction-history-controls">
          <AccountSelector accounts={accounts} value={accountId} onChange={setAccountId} label="Account" />
        </div>
      )}

      <div className="card transaction-list-card">
        {status === "loading" && <LoadingState rows={5} />}

        {status === "error" && <ErrorState description={error} onRetry={load} />}

        {status === "success" && transactions.length === 0 && (
          <EmptyState title="No recent activity" description="Nothing to show here yet." />
        )}

        {status === "success" &&
          transactions.map((t) => (
            <TransactionRow key={t.id} transaction={t} onClick={setSelected} />
          ))}
      </div>

      {status === "success" && transactions.length > 0 && (
        <Link to="/app/transactions" state={{ accountId }} className="mini-statement-link">
          View Full Transaction History →
        </Link>
      )}

      <TransactionDetailModal transaction={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
