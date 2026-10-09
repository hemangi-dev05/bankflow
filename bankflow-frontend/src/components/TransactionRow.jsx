import { ArrowDownLeft, ArrowUpRight, ArrowLeftRight, Send, PiggyBank } from "lucide-react";
import {
  TRANSACTION_LABELS,
  formatDateTime,
  formatSignedCurrency,
  isDebit,
} from "../utils/format";
import "./TransactionRow.css";

const ICONS = {
  DEPOSIT: ArrowDownLeft,
  WITHDRAW: ArrowUpRight,
  TRANSFER: ArrowLeftRight,
  PAY: Send,
  PIGGY_CONTRIBUTION: PiggyBank,
};

export default function TransactionRow({ transaction, onClick }) {
  const debit = isDebit(transaction.type);
  const Icon = ICONS[transaction.type] || ArrowLeftRight;
  return (
    <button className="txn-row" onClick={() => onClick?.(transaction)}>
      <span className={`txn-row-icon ${debit ? "txn-row-icon-debit" : "txn-row-icon-credit"}`}>
        <Icon size={18} strokeWidth={1.75} aria-hidden="true" />
      </span>
      <span className="txn-row-main">
        <span className="txn-row-type">{TRANSACTION_LABELS[transaction.type] || transaction.type}</span>
        <span className="txn-row-remarks">{transaction.remarks || formatDateTime(transaction.date)}</span>
      </span>
      <span className={`txn-row-amount mono ${debit ? "amount-negative" : "amount-positive"}`}>
        {formatSignedCurrency(transaction.amount, debit)}
      </span>
    </button>
  );
}