import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { accountApi } from "../../api/accountApi";
import { useAuth } from "../../context/AuthContext";
import { useAccounts } from "../../context/AccountsContext";
import { formatCurrency } from "../../utils/format";
import FormField from "../../components/FormField";
import "./OpenAccount.css";

const ACCOUNT_TYPES = [
  {
    value: "SAVINGS",
    title: "Savings Account",
    body: "For everyday saving and personal banking.",
  },
  {
    value: "CURRENT",
    title: "Current Account",
    body: "For frequent transactions.",
  },
];

export default function OpenAccount() {
  const { user } = useAuth();
  const { refresh } = useAccounts();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: type, 2: deposit, 3: success
  const [accountType, setAccountType] = useState(null);
  const [initialDeposit, setInitialDeposit] = useState("");
  const [depositError, setDepositError] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | error
  const [formError, setFormError] = useState("");
  const [createdAccount, setCreatedAccount] = useState(null);

  function handleSelectType(value) {
    setAccountType(value);
    setStep(2);
  }

  async function handleCreate(e) {
    e.preventDefault();
    setDepositError("");
    setFormError("");

    const amount = initialDeposit === "" ? 0 : Number(initialDeposit);
    if (Number.isNaN(amount) || amount < 0) {
      setDepositError("Enter a valid amount, or leave blank to start at ₹0.00");
      return;
    }

    setStatus("loading");
    try {
      const account = await accountApi.openAccount({
        userId: user.id,
        accountType,
        initialDeposit: amount,
      });
      setCreatedAccount(account);
      await refresh();
      setStep(3);
      setStatus("idle");
    } catch (err) {
      setStatus("error");
      setFormError(err.message);
    }
  }

  return (
    <div className="open-account">
      <div className="open-account-progress">
        <span className={step >= 1 ? "active" : ""}>Account type</span>
        <span className={step >= 2 ? "active" : ""}>Initial setup</span>
        <span className={step >= 3 ? "active" : ""}>Done</span>
      </div>

      {step === 1 && (
        <div>
          <h1>Choose your account type</h1>
          <p className="open-account-sub">Pick the account that fits how you bank.</p>

          <div className="account-type-grid">
            {ACCOUNT_TYPES.map((type) => (
              <button
                key={type.value}
                className="account-type-option"
                onClick={() => handleSelectType(type.value)}
              >
                <span className="account-type-name">{type.title.toUpperCase()}</span>
                <span className="account-type-body">{type.body}</span>
                <span className="account-type-cta">Select →</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="open-account-form-wrap">
          <button className="open-account-back" onClick={() => setStep(1)}>← Back</button>
          <h1>Set up your {accountType === "SAVINGS" ? "Savings" : "Current"} account</h1>
          <p className="open-account-sub">
            Add an initial deposit now, or start at ₹0.00 and fund it later.
          </p>

          <form onSubmit={handleCreate} noValidate>
            <FormField
              label="Initial deposit"
              htmlFor="initialDeposit"
              error={depositError}
              hint="Optional — leave blank to start at ₹0.00"
              prefix="₹"
            >
              <input
                id="initialDeposit"
                className={`input ${depositError ? "has-error" : ""}`}
                inputMode="decimal"
                placeholder="0.00"
                value={initialDeposit}
                onChange={(e) => setInitialDeposit(e.target.value)}
              />
            </FormField>

            {formError && (
              <div className="auth-form-error" role="alert">{formError}</div>
            )}

            <button type="submit" className="btn btn-primary btn-block" disabled={status === "loading"}>
              {status === "loading" ? "Opening account…" : "Open Account"}
            </button>
          </form>
        </div>
      )}

      {step === 3 && createdAccount && (
        <div className="open-account-success">
          <div className="open-account-success-icon">✓</div>
          <h1>Account created</h1>
          <p className="open-account-sub">
            Your {accountType === "SAVINGS" ? "Savings" : "Current"} account is ready with a
            balance of {formatCurrency(createdAccount.balance)}.
          </p>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/app", { state: { justOpenedAccount: true } })}
          >
            Go to BankFlow Home
          </button>
        </div>
      )}
    </div>
  );
}
