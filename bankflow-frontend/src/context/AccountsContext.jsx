import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { accountApi } from "../api/accountApi";
import { useAuth } from "./AuthContext";

const AccountsContext = createContext(null);

// status: "idle" | "loading" | "success" | "error"
export function AccountsProvider({ children }) {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [selectedAccountId, setSelectedAccountId] = useState(null);

  const refresh = useCallback(async () => {
    if (!user) return;
    setStatus("loading");
    setError(null);
    try {
      const data = await accountApi.getAccountsForUser(user.id);
      setAccounts(data);
      setStatus("success");
      setSelectedAccountId((prev) =>
        prev && data.some((a) => a.id === prev) ? prev : data[0]?.id ?? null
      );
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      refresh();
    } else {
      setAccounts([]);
      setStatus("idle");
      setSelectedAccountId(null);
    }
  }, [user, refresh]);

  const selectedAccount = useMemo(
    () => accounts.find((a) => a.id === selectedAccountId) ?? null,
    [accounts, selectedAccountId]
  );

  const value = useMemo(
    () => ({
      accounts,
      status,
      error,
      refresh,
      selectedAccountId,
      setSelectedAccountId,
      selectedAccount,
      hasAccounts: accounts.length > 0,
    }),
    [accounts, status, error, refresh, selectedAccountId, selectedAccount]
  );

  return <AccountsContext.Provider value={value}>{children}</AccountsContext.Provider>;
}

export function useAccounts() {
  const ctx = useContext(AccountsContext);
  if (!ctx) throw new Error("useAccounts must be used within AccountsProvider");
  return ctx;
}
