const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

// Always render backend-provided numbers through this — never compute
// balances client-side.
export function formatCurrency(amount) {
  const value = typeof amount === "number" ? amount : Number(amount) || 0;
  return inr.format(value);
}

export function formatSignedCurrency(amount, isDebit) {
  const formatted = formatCurrency(Math.abs(amount));
  return isDebit ? `-${formatted}` : `+${formatted}`;
}

export function maskAccountNumber(accountNumber) {
  if (!accountNumber) return "";
  const last4 = accountNumber.slice(-4);
  return `•••• ${last4}`;
}

export function formatDate(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// TransactionType: DEPOSIT, WITHDRAW, TRANSFER, PAY, PIGGY_CONTRIBUTION
// A transaction is a debit from this account's point of view for
// WITHDRAW, TRANSFER, PAY, and PIGGY_CONTRIBUTION (money leaving the
// available balance into the Piggy Bank). DEPOSIT (including a received
// transfer, which the backend also logs as DEPOSIT) is a credit.
export function isDebit(type) {
  return type === "WITHDRAW" || type === "TRANSFER" || type === "PAY" || type === "PIGGY_CONTRIBUTION";
}

export const TRANSACTION_LABELS = {
  DEPOSIT: "Deposit",
  WITHDRAW: "Withdrawal",
  TRANSFER: "Transfer",
  PAY: "Payment",
  PIGGY_CONTRIBUTION: "Piggy Bank savings",
};

export const ACCOUNT_TYPE_LABELS = {
  SAVINGS: "Savings Account",
  CURRENT: "Current Account",
};