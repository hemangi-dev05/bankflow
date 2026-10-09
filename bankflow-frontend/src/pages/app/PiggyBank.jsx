import { useState } from "react";
import { Link } from "react-router-dom";
import { accountApi } from "../../api/accountApi";
import { useAccounts } from "../../context/AccountsContext";
import { useToast } from "../../context/ToastContext";
import { ACCOUNT_TYPE_LABELS, formatCurrency, maskAccountNumber } from "../../utils/format";
import AccountSelector from "../../components/AccountSelector";
import ConfirmDialog from "../../components/ConfirmDialog";
import FormField from "../../components/FormField";
import "./PiggyBank.css";

export default function PiggyBank() {
  const { accounts, selectedAccountId, setSelectedAccountId, refresh } = useAccounts();
  const { notify } = useToast();
  const account = accounts.find((a) => a.id === selectedAccountId) || accounts[0];

  const [toggling, setToggling] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawError, setWithdrawError] = useState("");
  const [withdrawing, setWithdrawing] = useState(false);

  async function handleToggle() {
    setToggling(true);
    try {
      await accountApi.toggleRoundOff(account.id, !account.roundOffEnabled);
      await refresh();
      notify(account.roundOffEnabled ? "Piggy Bank turned off" : "Piggy Bank turned on");
    } catch (err) {
      notify(err.message, "error");
    } finally {
      setToggling(false);
    }
  }

  function openWithdraw() {
    setWithdrawAmount("");
    setWithdrawError("");
    setWithdrawOpen(true);
  }

  async function handleWithdraw() {
    const amount = Number(withdrawAmount);
    if (!withdrawAmount || Number.isNaN(amount) || amount <= 0) {
      setWithdrawError("Enter an amount greater than zero");
      return;
    }
    if (amount > account.piggyBankBalance) {
      setWithdrawError("Amount exceeds your Piggy Bank savings");
      return;
    }
    setWithdrawing(true);
    try {
      await accountApi.withdrawFromPiggyBank(account.id, amount);
      await refresh();
      notify(`${formatCurrency(amount)} moved to your available balance`);
      setWithdrawOpen(false);
    } catch (err) {
      setWithdrawError(err.message);
    } finally {
      setWithdrawing(false);
    }
  }

  if (!account) {
    return (
      <div className="operation-flow">
        <p>You need an open account before you can use Piggy Bank.</p>
        <Link to="/app/open-account" className="btn btn-primary">Open an account</Link>
      </div>
    );
  }

  return (
    <div className="piggy-page">
      <header className="dashboard-header">
        <h1>Smart Piggy Bank</h1>
        <p>Save without thinking about it.</p>
      </header>

      {accounts.length > 1 && (
        <div className="transaction-history-controls">
          <AccountSelector accounts={accounts} value={account.id} onChange={setSelectedAccountId} label="Account" />
        </div>
      )}

      <div className="piggy-balance-card">
        <div>
          <span className="piggy-balance-label">Piggy Bank balance</span>
          <span className="piggy-balance-value mono">{formatCurrency(account.piggyBankBalance)}</span>
          <span className="piggy-balance-sub">
            {ACCOUNT_TYPE_LABELS[account.accountType]} · {maskAccountNumber(account.accountNumber)}
          </span>
        </div>
        <div className="piggy-balance-actions">
          <span className={`badge ${account.roundOffEnabled ? "badge-positive" : "badge-neutral"}`}>
            {account.roundOffEnabled ? "Active" : "Off"}
          </span>
          <button className="btn btn-secondary btn-sm" onClick={handleToggle} disabled={toggling}>
            {toggling ? "Updating…" : account.roundOffEnabled ? "Turn off" : "Turn on"}
          </button>
          {account.piggyBankBalance > 0 && (
            <button className="btn btn-primary btn-sm" onClick={openWithdraw}>
              Withdraw savings
            </button>
          )}
        </div>
      </div>

      <section className="piggy-explainer">
        <h2>How it works</h2>
        <p>
          When Piggy Bank is on, every withdrawal, payment or transfer from this account
          sets aside 5% of the amount into your Piggy Bank balance, capped at ₹100 per
          transaction — no transfers to remember, no extra steps. Deposits aren't affected.
        </p>

        <div className="piggy-example">
          <span className="piggy-example-label">Example</span>
          <div className="piggy-example-row">
            <span>You pay</span>
            <span className="mono">{formatCurrency(500)}</span>
          </div>
          <div className="piggy-example-row">
            <span>Saved to Piggy Bank (5%)</span>
            <span className="mono">{formatCurrency(25)}</span>
          </div>
          <div className="piggy-example-row piggy-example-highlight">
            <span>Debited from your balance</span>
            <span className="mono">{formatCurrency(525)}</span>
          </div>
        </div>

        <h2>Terms</h2>
        <ul className="piggy-terms">
          <li>5% of each withdrawal, payment or transfer is set aside, up to ₹100 per transaction.</li>
          <li>You can turn Piggy Bank on or off for this account at any time.</li>
          <li>Withdraw your Piggy Bank savings to your available balance whenever you like.</li>
        </ul>
      </section>

      <ConfirmDialog
        open={withdrawOpen}
        onClose={() => setWithdrawOpen(false)}
        onConfirm={handleWithdraw}
        title="Withdraw from Piggy Bank"
        confirmLabel={withdrawing ? "Withdrawing…" : "Withdraw"}
        loading={withdrawing}
        description={
          <FormField
            label="Amount"
            htmlFor="piggyAmount"
            error={withdrawError}
            prefix="₹"
            hint={`Available: ${formatCurrency(account.piggyBankBalance)}`}
          >
            <input
              id="piggyAmount"
              className={`input ${withdrawError ? "has-error" : ""}`}
              inputMode="decimal"
              placeholder="0.00"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              autoFocus
            />
          </FormField>
        }
      />
    </div>
  );
}
