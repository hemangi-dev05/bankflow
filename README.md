# BankFlow

A full-stack digital banking application. A Spring Boot REST API secured with JWT sits behind a React single-page app, with safe money handling, per-user authorization and a "Piggy Bank" feature that sets aside savings automatically.

<!-- Replace with a screenshot or GIF: dashboard + piggy bank animation -->
![BankFlow dashboard](docs/screenshots/dashboard.png)

## Highlights

- **JWT authentication and authorization.** Stateless sessions, BCrypt password hashing and a custom auth filter. Every account operation checks that the logged-in user owns the account, so one user can never act on another's money (403 on violation, clean JSON 401 on a missing or invalid token).
- **Correct money handling.** All amounts use `BigDecimal`, never floating point. Debits, credits and transfers run inside transactions.
- **Concurrency safety.** Optimistic locking (`@Version`) on accounts prevents lost updates when two requests change the same balance; conflicts return `409 Conflict`.
- **Smart Piggy Bank.** An opt-in feature that sets aside 5% of each withdrawal, payment or transfer (capped at ₹100 per transaction) into a separate savings balance that can be withdrawn at any time.
- **Validation and error handling.** Bean Validation on request DTOs and a global exception handler that maps each failure to a proper HTTP status and a clear message.
- **Polished UI.** Responsive layout, animated page transitions and a looping piggy bank animation built with framer-motion, with `prefers-reduced-motion` respected.

## Tech Stack

| Layer | Technologies |
|-------|--------------|
| Backend | Java 17, Spring Boot, Spring Security, JWT, Spring Data JPA, Bean Validation |
| Database | MySQL |
| Frontend | React, Vite, React Router, framer-motion, lucide-react |
| Testing | JUnit |
| Build | Maven (backend), npm (frontend) |

## Architecture

```
React (Vite)
   │  Authorization: Bearer <JWT>
   ▼
JWT Auth Filter ──► SecurityContext (authenticated user)
   ▼
Controllers  ──►  Services (ownership checks, business rules, @Transactional)
   ▼
Spring Data JPA  ──►  MySQL
```

**Key design decisions**

| Decision | Why |
|----------|-----|
| `BigDecimal` for all amounts | Avoids floating-point rounding errors in financial calculations |
| Optimistic locking on `Account` | Prevents lost updates from concurrent balance changes without holding database locks |
| Ownership check in the service layer | Authentication alone is not enough; the service verifies the caller owns the account being acted on |
| Response DTOs instead of entities | Keeps password hashes and internal fields out of API responses |
| Separate `piggyBankBalance` field | Savings are tracked independently of the spendable balance |
| Secrets via environment variables | No credentials or JWT secret in source control |

## Features

- User signup and login with JWT authentication, plus password reset
- Open and look up bank accounts (savings and current)
- Deposit, withdraw, pay and transfer between accounts
- Piggy Bank savings with an on/off toggle and withdrawals back to the main balance
- Full transaction history and a mini statement for each account
- Per-user data isolation and consistent error responses

## API Reference

Signup, login and password reset are public. All other endpoints require an `Authorization: Bearer <token>` header.

### Users (`/api/users`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/signup` | Register a new user |
| POST | `/login` | Log in and receive a JWT |
| POST | `/reset-password` | Reset a user's password |

### Accounts (`/api/accounts`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Create an account |
| GET | `/user/{userId}` | Get a user's accounts |
| GET | `/lookup` | Look up an account |
| PUT | `/{id}/deposit` | Deposit money |
| PUT | `/{id}/withdraw` | Withdraw money |
| PUT | `/{id}/pay` | Make a payment |
| POST | `/{id}/transfer` | Transfer to another account |
| PUT | `/{id}/round-off` | Turn Piggy Bank on or off |
| PUT | `/{id}/piggy-bank/withdraw` | Withdraw from the Piggy Bank |

### Transactions (`/api/accounts/{accountId}/transactions`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | List all transactions |
| GET | `/mini-statement` | Get the most recent transactions |

### Error responses

| Status | Meaning |
|--------|---------|
| 400 | Validation failed or invalid amount |
| 401 | Missing or invalid token |
| 403 | Account belongs to another user |
| 404 | Account or user not found |
| 409 | Concurrent update conflict |

## Getting Started

### Prerequisites

- Java 17
- Maven
- Node.js 18+
- MySQL

### Backend

1. Create a MySQL database (the name is set in `spring.datasource.url` in `application.properties`).
2. Set these environment variables:

   | Variable | Description |
   |----------|-------------|
   | `DB_USERNAME` | Your MySQL username |
   | `DB_PASSWORD` | Your MySQL password |
   | `JWT_SECRET` | A long random string (32+ characters) |

3. Start the API:

   ```bash
   cd backend/bankflow
   mvn spring-boot:run
   ```

   The API runs on `http://localhost:8080`.

### Frontend

```bash
cd bankflow-frontend
cp .env.example .env   # then fill in the values
npm install
npm run dev
```

The app runs on `http://localhost:5173`.

### Running the tests

```bash
cd backend/bankflow
mvn test
```

## Project Structure

```
bankflow-app/
├── backend/bankflow/          # Spring Boot API
│   └── src/main/java/com/bankflow/banking/
│       ├── config/            # Security configuration
│       ├── controller/        # REST endpoints
│       ├── service/           # Business logic
│       ├── repository/        # JPA repositories
│       ├── entity/            # User, Account, Transaction
│       ├── dto/               # Request and response objects
│       └── exception/         # Custom exceptions and global handler
└── bankflow-frontend/         # React app
    └── src/
        ├── api/               # API client
        ├── components/        # Reusable UI components
        ├── context/           # Auth, accounts and toast state
        ├── layouts/           # App shell
        └── pages/             # Public and authenticated pages
```

## Roadmap

- Recipient lookup by phone number for transfers
- Refresh tokens and token revocation
- Docker Compose setup for one-command local start
- Deployed demo

## Author

**Hemangi Pandey**
[LinkedIn](https://linkedin.com/in/hemangi-pandey) · [GitHub](https://github.com/hemangi-dev05)
