# BankFlow — Frontend

React (Vite) frontend for the BankFlow Spring Boot backend. Every API call in
`src/api/` maps 1:1 to the real controllers — nothing here is invented.

## Run it

```bash
npm install
cp .env.example .env   # points at http://localhost:8080/api by default
npm run dev
```

Start the Spring Boot backend first (`localhost:8080`), then run the frontend
(`localhost:5173`) — that origin is already allowed in the backend's `WebConfig`.

## A backend note worth knowing

`POST /api/users/login` and `/signup` don't return a session token or JWT —
just the `UserResponse`. There's no server-side session to check, so "who's
logged in" is tracked client-side: `AuthContext` holds the login response and
persists it to `localStorage`, and every account/transaction call after that
uses `user.id` as the identifying param. This matches the backend exactly as
it stands — no endpoints were added or guessed at.

## Structure

```
src/
  api/          authApi, accountApi, transactionApi — one file per controller
  context/      AuthContext, AccountsContext, ToastContext
  components/   shared UI: Navbar, Sidebar, AccountCard, TransactionRow, etc.
  layouts/      PublicLayout (marketing + auth), AppLayout (sidebar + nav)
  pages/
    public/     Home, Services, About, Login, Signup
    account/    OpenAccount (account-type → deposit → success)
    app/        Dashboard, Profile, TransactionHistory, MiniStatement,
                Transfer, Pay, Withdraw, PiggyBank
  styles/       tokens.css (design system) + base.css (buttons/inputs/cards)
  utils/        currency + date formatting, transaction/account-type labels
```

## Piggy Bank rule

Pulled directly from `AccountServiceImpl.calculateRoundOff`: when
`roundOffEnabled` is true, every deposit, withdrawal, payment or transfer
rounds the amount up to the nearest ₹10, and the difference is added to
`piggyBankBalance`. The Piggy Bank page explains and displays exactly this.
