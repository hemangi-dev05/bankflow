import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Copy, Check, Eye, EyeOff, Wallet, Landmark, ArrowRight } from "lucide-react";
import { ACCOUNT_TYPE_LABELS, formatCurrency, maskAccountNumber } from "../utils/format";
import { useCountUp } from "../utils/useCountUp";
import "./AccountCard.css";

export default function AccountCard({ account, featured = false, index = 0 }) {
  const [hidden, setHidden] = useState(false);
  const [copied, setCopied] = useState(false);
  const shown = useCountUp(Number(account.balance) || 0);
  const TypeIcon = account.accountType === "SAVINGS" ? Wallet : Landmark;

  async function copyNumber() {
    try {
      await navigator.clipboard.writeText(String(account.accountNumber));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <motion.div
      className={`account-card ${featured ? "account-card-featured" : ""}`}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <div className="account-card-top">
        <span className="account-card-type account-card-type-row">
          <TypeIcon size={16} strokeWidth={1.75} aria-hidden="true" />
          {ACCOUNT_TYPE_LABELS[account.accountType] || account.accountType}
        </span>
        {account.roundOffEnabled && <span className="badge badge-accent">Piggy Bank on</span>}
      </div>

      <div className="account-card-number-row">
        <span className="account-card-number mono">{maskAccountNumber(account.accountNumber)}</span>
        <button
          type="button"
          className="icon-btn"
          onClick={copyNumber}
          aria-label={copied ? "Account number copied" : "Copy account number"}
        >
          {copied ? <Check size={15} /> : <Copy size={15} />}
        </button>
      </div>

      <div className="account-card-balance">
        <span className="account-card-balance-row">
          <span className="mono">{hidden ? "₹ ••••••" : formatCurrency(shown)}</span>
          <button
            type="button"
            className="icon-btn"
            onClick={() => setHidden((h) => !h)}
            aria-label={hidden ? "Show balance" : "Hide balance"}
          >
            {hidden ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
        </span>
        <span className="account-card-balance-label">Available balance</span>
      </div>

      {account.piggyBankBalance > 0 && (
        <div className="account-card-piggy">
          <span>Piggy Bank</span>
          <span className="mono">{hidden ? "₹ ••••" : formatCurrency(account.piggyBankBalance)}</span>
        </div>
      )}

      <Link to="/app/transactions" state={{ accountId: account.id }} className="account-card-link">
        View transactions <ArrowRight size={14} aria-hidden="true" />
      </Link>
    </motion.div>
  );
}