import Modal from "./Modal";
import {
  TRANSACTION_LABELS,
  formatCurrency,
  formatDateTime,
  isDebit,
} from "../utils/format";

export default function TransactionDetailModal({ transaction, onClose }) {
  if (!transaction) return null;
  const debit = isDebit(transaction.type);

  return (
    <Modal open={Boolean(transaction)} onClose={onClose} title="Transaction details" width={380}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <div className={`mono ${debit ? "amount-negative" : "amount-positive"}`} style={{ fontSize: 26, fontWeight: 500 }}>
            {debit ? "-" : "+"}{formatCurrency(transaction.amount)}
          </div>
          <span className="badge badge-neutral" style={{ marginTop: 8 }}>
            {TRANSACTION_LABELS[transaction.type] || transaction.type}
          </span>
        </div>

        <div className="hr" style={{ margin: "4px 0" }} />

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5 }}>
          <span style={{ color: "var(--color-text-muted)" }}>Date & time</span>
          <span>{formatDateTime(transaction.date)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5 }}>
          <span style={{ color: "var(--color-text-muted)" }}>Balance after</span>
          <span className="mono">{formatCurrency(transaction.balanceAfter)}</span>
        </div>
        {transaction.remarks && (
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5, gap: 16 }}>
            <span style={{ color: "var(--color-text-muted)" }}>Remarks</span>
            <span style={{ textAlign: "right" }}>{transaction.remarks}</span>
          </div>
        )}
      </div>
    </Modal>
  );
}
