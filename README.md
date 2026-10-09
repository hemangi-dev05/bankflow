# BankFlow

A full-stack banking web application with a Spring Boot REST API and a React frontend.

## Tech Stack
- Backend: Java, Spring Boot, Spring Security, JWT, Spring Data JPA
- Database: MySQL
- Frontend: React, Vite

## Features
- User signup and login with JWT authentication, plus password reset
- Create and look up bank accounts
- Deposit, withdraw, pay and transfer between accounts
- Round-off savings and a piggy bank with withdrawals
- Full transaction history and a mini statement for each account
- Global exception handling with clear error responses

## API Endpoints

### Users (`/api/users`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /signup | Register a new user |
| POST | /login | Log in and receive a JWT |
| POST | /reset-password | Reset a user's password |

### Accounts (`/api/accounts`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | / | Create an account |
| GET | /user/{userId} | Get a user's accounts |
| GET | /lookup | Look up an account |
| PUT | /{id}/deposit | Deposit money |
| PUT | /{id}/withdraw | Withdraw money |
| PUT | /{id}/pay | Make a payment |
| POST | /{id}/transfer | Transfer to another account |
| PUT | /{id}/round-off | Round-off savings |
| PUT | /{id}/piggy-bank/withdraw | Withdraw from the piggy bank |

### Transactions (`/api/accounts/{accountId}/transactions`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | / | List all transactions |
| GET | /mini-statement | Get the recent transactions |

## Getting Started

### Prerequisites
Java, Maven, Node.js and MySQL installed.

### Backend
1. Create a MySQL database (the name is in `spring.datasource.url` in `application.properties`).
2. Set these environment variables:
   - `DB_USERNAME`: your MySQL username
   - `DB_PASSWORD`: your MySQL password
   - `JWT_SECRET`: a long random string (32+ characters)
3. Start the API:

       cd backend/bankflow
       mvn spring-boot:run

   The API runs on http://localhost:8080.

### Frontend

    cd bankflow-frontend
    npm install
    npm run dev

Copy `.env.example` to `.env` and fill in the values.