import { useState } from "react";
import { Link } from "react-router-dom";
import { accountApi } from "../../api/accountApi";
import { useAccounts } from "../../context/AccountsContext";
import { ACCOUNT_TYPE_LABELS, formatCurrency, maskAccountNumber } from "../../utils/format";
import AccountSelector from "../../components/AccountSelector";
import FormField from "../../components/FormField";
import "./OperationFlow.css";

export default function Transfer() {
  const { accounts, selectedAccountId, setSelectedAccountId, refresh } = useAccounts();
  const [step, setStep] = useState("form"); // form | review | processing | success | failure
  const [accountNumberInput, setAccountNumberInput] = useState("");
  const [recipient, setRecipient] = useState(null); // { id, accountNumber, accountType, ownerName }
  const [lookupStatus, setLookupStatus] = useState("idle"); // idle | loading | found | error
  const [lookupError, setLookupError] = useState("");
  const [amount, setAmount] = useState("");
  const [remarks, setRemarks] = useState("");
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  const fromAccount = accounts.find((a) => a.id === selectedAccountId) || accounts[0];

  function handleAccountNumberChange(value) {
    setAccountNumberInput(value);
    // Any edit invalidates a previously-resolved recipient — force re-verification
    // so we never submit a transfer against a stale lookup.
    if (recipient) setRecipient(null);
    if (lookupStatus !== "idle") setLookupStatus("idle");
    setLookupError("");
    setErrors((prev) => ({ ...prev, toAccountId: undefined }));
  }

  async function verifyRecipient() {
    const trimmed = accountNumberInput.trim();
    if (!trimmed) {
      setErrors((prev) => ({ ...prev, toAccountId: "Enter the recipient's account number" }));
      return;
    }
    setLookupStatus("loading");
    setLookupError("");
    try {
      const found = await accountApi.lookupByAccountNumber(trimmed);
      if (found.id === fromAccount?.id) {
        setLookupStatus("error");
        setLookupError("You can't transfer to your own account.");
        return;
      }
      setRecipient(found);
      setLookupStatus("found");
    } catch (err) {
      setLookupStatus("error");
      setLookupError(err.message);
    }
  }

  function validate() {
    const next = {};
    if (!recipient) next.toAccountId = "Verify the recipient's account number first";
    const numAmount = Number(amount);
    if (!amount || Number.isNaN(numAmount) || numAmount <= 0) next.amount = "Enter an amount greater than zero";
    else if (fromAccount && numAmount > fromAccount.balance) next.amount = "Amount exceeds available balance";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function goToReview(e) {
    e.preventDefault();
    if (validate()) setStep("review");
  }

  async function confirmTransfer() {
    setStep("processing");
    setErrorMessage("");
    try {
      await accountApi.transfer(fromAccount.id, {
        toAccountId: recipient.id,
        amount: Number(amount),
        remarks: remarks || undefined,
      });
      await refresh();
      setStep("success");
    } catch (err) {
      setErrorMessage(err.message);
      setStep("failure");
    }
  }

  function resetFlow() {
    setAccountNumberInput("");
    setRecipient(null);
    setLookupStatus("idle");
    setLookupError("");
    setAmount("");
    setRemarks("");
    setErrors({});
    setErrorMessage("");
    setStep("form");
  }

  if (!fromAccount) {
    return (
      <div className="operation-flow">
        <p>You need an open account before you can transfer money.</p>
        <Link to="/app/open-account" className="btn btn-primary">Open an account</Link>
      </div>
    );
  }

  return (
    <div className="operation-flow">
      <header className="dashboard-header">
        <h1>Transfer</h1>
        <p>Move money to another BankFlow account.</p>
      </header>

      {step === "form" && (
        <form className="operation-card" onSubmit={goToReview} noValidate>
          {accounts.length > 1 && (
            <AccountSelector
              accounts={accounts}
              value={fromAccount.id}
              onChange={(id) => {
                setSelectedAccountId(id);
                // Sender changed — a resolved recipient could now equal the new
                // sender, so make them re-verify to be safe.
                if (recipient) setRecipient(null);
                if (lookupStatus !== "idle") setLookupStatus("idle");
              }}
              label="From account"
            />
          )}
          <p className="operation-balance-hint">
            Available balance: <span className="mono">{formatCurrency(fromAccount.balance)}</span>
          </p>

          <FormField
            label="Recipient account number"
            htmlFor="accountNumber"
            error={errors.toAccountId || (lookupStatus === "error" ? lookupError : undefined)}
            hint={lookupStatus === "idle" ? "Ask the recipient for their BankFlow account number" : undefined}
          >
            <div className="recipient-lookup-row">
              <input
                id="accountNumber"
                className={`input ${errors.toAccountId || lookupStatus === "error" ? "has-error" : ""}`}
                placeholder="e.g. BF1732000000001"
                value={accountNumberInput}
                onChange={(e) => handleAccountNumberChange(e.target.value)}
                autoComplete="off"
              />
              <button
                type="button"
                className="btn btn-secondary"
                onClick={verifyRecipient}
                disabled={lookupStatus === "loading" || !accountNumberInput.trim()}
              >
                {lookupStatus === "loading" ? "Checking…" : "Verify"}
              </button>
            </div>
          </FormField>

          {lookupStatus === "found" && recipient && (
            <div className="recipient-found-card" role="status">
              <div className="recipient-found-icon">✓</div>
              <div>
                <p className="recipient-found-name">{recipient.ownerName}</p>
                <p className="recipient-found-meta">
                  {ACCOUNT_TYPE_LABELS[recipient.accountType] || recipient.accountType} ·{" "}
                  {maskAccountNumber(recipient.accountNumber)}
                </p>
              </div>
            </div>
          )}

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

          <FormField label="Remarks" htmlFor="remarks" hint="Optional">
            <input
              id="remarks"
              className="input"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="What's this for?"
            />
          </FormField>

          <button type="submit" className="btn btn-primary btn-block">Review Transfer</button>
        </form>
      )}

      {step === "review" && (
        <div className="operation-card">
          <h2 className="operation-review-title">Review transfer</h2>
          <div className="operation-review-row">
            <span>From</span>
            <span>{ACCOUNT_TYPE_LABELS[fromAccount.accountType]} · {maskAccountNumber(fromAccount.accountNumber)}</span>
          </div>
          <div className="operation-review-row">
            <span>To</span>
            <span>
              {recipient.ownerName} · {maskAccountNumber(recipient.accountNumber)}
            </span>
          </div>
          <div className="operation-review-row">
            <span>Amount</span>
            <span className="mono operation-review-amount">{formatCurrency(Number(amount))}</span>
          </div>
          {remarks && (
            <div className="operation-review-row">
              <span>Remarks</span>
              <span>{remarks}</span>
            </div>
          )}
          <div className="operation-review-actions">
            <button className="btn btn-secondary btn-block" onClick={() => setStep("form")}>Back</button>
            <button className="btn btn-primary btn-block" onClick={confirmTransfer}>Confirm Transfer</button>
          </div>
        </div>
      )}

      {step === "processing" && (
        <div className="operation-card operation-processing">
          <div className="operation-spinner" aria-hidden="true" />
          <p>Processing your transfer…</p>
        </div>
      )}

      {step === "success" && (
        <div className="operation-card operation-result">
          <div className="operation-result-icon operation-result-icon-success">✓</div>
          <h2>Transfer successful</h2>
          <p>{formatCurrency(Number(amount))} sent to {recipient.ownerName}.</p>
          <div className="operation-result-actions">
            <button className="btn btn-secondary" onClick={resetFlow}>Make another transfer</button>
            <Link to="/app" className="btn btn-primary">Back to Home</Link>
          </div>
        </div>
      )}

      {step === "failure" && (
        <div className="operation-card operation-result">
          <div className="operation-result-icon operation-result-icon-failure">!</div>
          <h2>Transfer failed</h2>
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