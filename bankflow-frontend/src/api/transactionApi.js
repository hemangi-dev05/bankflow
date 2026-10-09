import { api } from "./client";

// Maps 1:1 to TransactionController (base path /api/accounts/{accountId}/transactions).
export const transactionApi = {
  // GET /api/accounts/{accountId}/transactions -> TransactionResponse[]
  getFullHistory: (accountId) => api.get(`/accounts/${accountId}/transactions`),

  // GET /api/accounts/{accountId}/transactions/mini-statement -> TransactionResponse[]
  getMiniStatement: (accountId) =>
    api.get(`/accounts/${accountId}/transactions/mini-statement`),
};
