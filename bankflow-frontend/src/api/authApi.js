import { api } from "./client";

// Maps 1:1 to UserController.
// signup -> POST /api/users/signup, body: SignupRequest { name, email, password, phone }
// login  -> POST /api/users/login,  body: LoginRequest  { email, password }
// resetPassword -> POST /api/users/reset-password, body: ResetPasswordRequest { email, phone, newPassword }
//   Verifies identity by matching email + phone on file (no email/token flow yet).
// All three return UserResponse { id, name, email, phone }.
// NOTE: the backend does not issue a session token or JWT — UserResponse
// is the only thing identifying who's signed in. The frontend keeps that
// response in AuthContext (persisted to localStorage) and uses its `id`
// as the userId for every subsequent account/transaction call.

export const authApi = {
  signup: (payload) => api.post("/users/signup", payload),
  login: (payload) => api.post("/users/login", payload),
  resetPassword: (payload) => api.post("/users/reset-password", payload),
};