import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { transactionApi } from "../../api/transactionApi";
import { useAccounts } from "../../context/AccountsContext";
import AccountSelector from "../../components/AccountSelector";
import TransactionRow from "../../components/TransactionRow";
import TransactionDetailModal from "../../components/TransactionDetailModal";
import { LoadingState, EmptyState, ErrorState } from "../../components/States";
import "./TransactionHistory.css";

const FILTERS = [
  { value: "ALL", label: "All" },
  { value: "DEPOSIT", label: "Deposits" },
  { value: "WITHDRAW", label: "Withdrawals" },
  { value: "TRANSFER", label: "Transfers" },
  { value: "PAY", label: "Payments" },
];

export default function TransactionHistory() {
  const { accounts, status: accountsStatus } = useAccounts();
  const location = useLocation();

  const [accountId, setAccountId] = useState(location.state?.accountId ?? null);
  const [transactions, setTransactions] = useState([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("ALL");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (accountId === null && accounts.length > 0) {
      setAccountId(accounts[0].id);
    }
  }, [accounts, accountId]);

  useEffect(() => {
    if (!accountId) return;
    let cancelled = false;
    setStatus("loading");
    setError(null);
    transactionApi
      .getFullHistory(accountId)
      .then((data) => {
        if (!cancelled) {
          setTransactions(data);
          setStatus("success");
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message);
          setStatus("error");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [accountId]);

  const filtered = useMemo(() => {
    if (filter === "ALL") return transactions;
    return transactions.filter((t) => t.type === filter);
  }, [transactions, filter]);

  function retry() {
    if (accountId) {
      setStatus("loading");
      transactionApi
        .getFullHistory(accountId)
        .then((data) => {
          setTransactions(data);
          setStatus("success");
        })
        .catch((err) => {
          setError(err.message);
          setStatus("error");
        });
    }
  }

  return (
    <div className="transaction-history">
      <header className="dashboard-header">
        <h1>Transaction History</h1>
        <p>Every transaction recorded on your account.</p>
      </header>

      {accountsStatus === "success" && accounts.length > 1 && (
        <div className="transaction-history-controls">
          <AccountSelector accounts={accounts} value={accountId} onChange={setAccountId} label="Account" />
        </div>
      )}

      <div className="transaction-filter-row">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            className={`transaction-filter ${filter === f.value ? "transaction-filter-active" : ""}`}
            onClick={() => setFilter(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="card transaction-list-card">
        {status === "loading" && <LoadingState rows={5} />}

        {status === "error" && <ErrorState description={error} onRetry={retry} />}

        {status === "success" && filtered.length === 0 && (
          <EmptyState
            title="No transactions found"
            description={
              filter === "ALL"
                ? "This account doesn't have any recorded transactions yet."
                : "No transactions match this filter."
            }
          />
        )}

        {status === "success" &&
          filtered.map((t) => (
            <TransactionRow key={t.id} transaction={t} onClick={setSelected} />
          ))}
      </div>

      <TransactionDetailModal transaction={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
