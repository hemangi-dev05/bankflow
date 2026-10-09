import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Receipt } from "lucide-react";
import { transactionApi } from "../api/transactionApi";
import TransactionRow from "./TransactionRow";
import "./RecentActivity.css";

export default function RecentActivity({ accounts, limit = 5 }) {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");

    Promise.allSettled(
      accounts.map((a) =>
        transactionApi
          .getMiniStatement(a.id)
          .then((list) => (Array.isArray(list) ? list : []).map((t) => ({ ...t, accountId: a.id })))
      )
    ).then((results) => {
      if (cancelled) return;
      const ok = results.filter((r) => r.status === "fulfilled");
      if (accounts.length > 0 && ok.length === 0) {
        setStatus("error");
        return;
      }
      const merged = ok
        .flatMap((r) => r.value)
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, limit);
      setItems(merged);
      setStatus("success");
    });

    return () => {
      cancelled = true;
    };
  }, [accounts, limit]);

  function openHistory(t) {
    navigate("/app/transactions", { state: { accountId: t.accountId } });
  }

  return (
    <section className="recent-activity" aria-label="Recent activity">
      <div className="recent-activity-head">
        <h2>Recent activity</h2>
        <Link to="/app/transactions" className="recent-activity-all">
          View all <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </div>

      <div className="recent-activity-card">
        {status === "loading" && (
          <div className="recent-activity-skeletons" aria-hidden="true">
            <span /><span /><span />
          </div>
        )}

        {status === "error" && (
          <p className="recent-activity-empty">Couldn't load your recent activity right now.</p>
        )}

        {status === "success" && items.length === 0 && (
          <div className="recent-activity-empty">
            <Receipt size={28} strokeWidth={1.5} aria-hidden="true" />
            <p>No transactions yet. Your activity will appear here after your first deposit, payment or transfer.</p>
          </div>
        )}

        {status === "success" &&
          items.map((t, i) => (
            <TransactionRow key={t.id ?? `${t.accountId}-${t.date}-${i}`} transaction={t} onClick={openHistory} />
          ))}
      </div>
    </section>
  );
}