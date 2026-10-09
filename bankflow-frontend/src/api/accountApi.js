import { api } from "./client";

// Maps 1:1 to AccountController (base path /api/accounts).
export const accountApi = {
  // POST /api/accounts  body: OpenAccountRequest { userId, accountType, initialDeposit }
  openAccount: (payload) => api.post("/accounts", payload),

  // GET /api/accounts/user/{userId} -> AccountResponse[]
  getAccountsForUser: (userId) => api.get(`/accounts/user/${userId}`),

  // GET /api/accounts/lookup?accountNumber=... -> AccountLookupResponse { id, accountNumber, accountType, ownerName }
  // Used to resolve a transfer recipient by account number (no name/ID guessing required).
  lookupByAccountNumber: (accountNumber) =>
    api.get(`/accounts/lookup?accountNumber=${encodeURIComponent(accountNumber)}`),

  // PUT /api/accounts/{id}/deposit  body: AmountRequest { amount, remarks }
  deposit: (accountId, payload) => api.put(`/accounts/${accountId}/deposit`, payload),

  // PUT /api/accounts/{id}/withdraw  body: AmountRequest { amount, remarks }
  withdraw: (accountId, payload) => api.put(`/accounts/${accountId}/withdraw`, payload),

  // PUT /api/accounts/{id}/pay  body: AmountRequest { amount, remarks }
  pay: (accountId, payload) => api.put(`/accounts/${accountId}/pay`, payload),

  // POST /api/accounts/{id}/transfer  body: TransferRequest { toAccountId, amount, remarks }
  // returns the plain string "Transfer successful!" (not an object)
  transfer: (accountId, payload) => api.post(`/accounts/${accountId}/transfer`, payload),

  // PUT /api/accounts/{id}/round-off  body: ToggleRoundOffRequest { enabled }
  toggleRoundOff: (accountId, enabled) =>
    api.put(`/accounts/${accountId}/round-off`, { enabled }),

  // PUT /api/accounts/{id}/piggy-bank/withdraw  body: AmountRequest { amount }
  withdrawFromPiggyBank: (accountId, amount) =>
    api.put(`/accounts/${accountId}/piggy-bank/withdraw`, { amount }),
};