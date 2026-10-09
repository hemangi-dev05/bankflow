import { useState } from "react";
import { Link } from "react-router-dom";
import { accountApi } from "../../api/accountApi";
import { useAccounts } from "../../context/AccountsContext";
import { ACCOUNT_TYPE_LABELS, formatCurrency, maskAccountNumber } from "../../utils/format";
import AccountSelector from "../../components/AccountSelector";
import FormField from "../../components/FormField";
import "./OperationFlow.css";

export default function Pay() {
  const { accounts, selectedAccountId, setSelectedAccountId, refresh } = useAccounts();
  const [step, setStep] = useState("form");
  const [amount, setAmount] = useState("");
  const [remarks, setRemarks] = useState("");
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  const account = accounts.find((a) => a.id === selectedAccountId) || accounts[0];

  function validate() {
    const next = {};
    const numAmount = Number(amount);
    if (!amount || Number.isNaN(numAmount) || numAmount <= 0) next.amount = "Enter an amount greater than zero";
    else if (account && numAmount > account.balance) next.amount = "Amount exceeds available balance";
    if (!remarks.trim()) next.remarks = "Add a short note for this payment";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function goToReview(e) {
    e.preventDefault();
    if (validate()) setStep("review");
  }

  async function confirmPay() {
    setStep("processing");
    setErrorMessage("");
    try {
      await accountApi.pay(account.id, { amount: Number(amount), remarks });
      await refresh();
      setStep("success");
    } catch (err) {
      setErrorMessage(err.message);
      setStep("failure");
    }
  }

  function resetFlow() {
    setAmount("");
    setRemarks("");
    setErrors({});
    setErrorMessage("");
    setStep("form");
  }

  if (!account) {
    return (
      <div className="operation-flow">
        <p>You need an open account before you can make a payment.</p>
        <Link to="/app/open-account" className="btn btn-primary">Open an account</Link>
      </div>
    );
  }

  return (
    <div className="operation-flow">
      <header className="dashboard-header">
        <h1>Pay</h1>
        <p>Make a payment from your account.</p>
      </header>

      {step === "form" && (
        <form className="operation-card" onSubmit={goToReview} noValidate>
          {accounts.length > 1 && (
            <AccountSelector
              accounts={accounts}
              value={account.id}
              onChange={setSelectedAccountId}
              label="Pay from"
            />
          )}
          <p className="operation-balance-hint">
            Available balance: <span className="mono">{formatCurrency(account.balance)}</span>
          </p>

          <FormField label="Amount" htmlFor="amount" error={errors.amount} prefix="₹">
            <input
              id="amount"
              className={`input ${errors.amount ? "has-error" : ""}`}
              inputMode="decimal"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </FormField>

          <FormField label="Paying for" htmlFor="remarks" error={errors.remarks}>
            <input
              id="remarks"
              className={`input ${errors.remarks ? "has-error" : ""}`}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="e.g. Electricity bill"
            />
          </FormField>

          <button type="submit" className="btn btn-primary btn-block">Review Payment</button>
        </form>
      )}

      {step === "review" && (
        <div className="operation-card">
          <h2 className="operation-review-title">Review payment</h2>
          <div className="operation-review-row">
            <span>From</span>
            <span>{ACCOUNT_TYPE_LABELS[account.accountType]} · {maskAccountNumber(account.accountNumber)}</span>
          </div>
          <div className="operation-review-row">
            <span>Paying for</span>
            <span>{remarks}</span>
          </div>
          <div className="operation-review-row">
            <span>Amount</span>
            <span className="mono operation-review-amount">{formatCurrency(Number(amount))}</span>
          </div>
          <div className="operation-review-actions">
            <button className="btn btn-secondary btn-block" onClick={() => setStep("form")}>Back</button>
            <button className="btn btn-primary btn-block" onClick={confirmPay}>Confirm Payment</button>
          </div>
        </div>
      )}

      {step === "processing" && (
        <div className="operation-card operation-processing">
          <div className="operation-spinner" aria-hidden="true" />
          <p>Processing your payment…</p>
        </div>
      )}

      {step === "success" && (
        <div className="operation-card operation-result">
          <div className="operation-result-icon operation-result-icon-success">✓</div>
          <h2>Payment successful</h2>
          <p>{formatCurrency(Number(amount))} paid for {remarks}.</p>
          <div className="operation-result-actions">
            <button className="btn btn-secondary" onClick={resetFlow}>Make another payment</button>
            <Link to="/app" className="btn btn-primary">Back to Home</Link>
          </div>
        </div>
      )}

      {step === "failure" && (
        <div className="operation-card operation-result">
          <div className="operation-result-icon operation-result-icon-failure">!</div>
          <h2>Payment failed</h2>
          <p>{errorMessage}</p>
          <div className="operation-result-actions">
            <button className="btn btn-secondary" onClick={() => setStep("form")}>Try again</button>
            <Link to="/app" className="btn btn-ghost">Back to Home</Link>
          </div>
        </div>
      )}
    </div>
  );
}
