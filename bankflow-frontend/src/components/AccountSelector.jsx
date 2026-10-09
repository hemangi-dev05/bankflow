import { ACCOUNT_TYPE_LABELS, formatCurrency, maskAccountNumber } from "../utils/format";
import FormField from "./FormField";

export default function AccountSelector({ accounts, value, onChange, label = "From account", excludeId }) {
  const options = excludeId ? accounts.filter((a) => a.id !== excludeId) : accounts;

  return (
    <FormField label={label} htmlFor="account-selector">
      <select
        id="account-selector"
        className="input"
        value={value ?? ""}
        onChange={(e) => onChange(Number(e.target.value))}
      >
        {options.map((a) => (
          <option key={a.id} value={a.id}>
            {ACCOUNT_TYPE_LABELS[a.accountType] || a.accountType} · {maskAccountNumber(a.accountNumber)} ·{" "}
            {formatCurrency(a.balance)}
          </option>
        ))}
      </select>
    </FormField>
  );
}
