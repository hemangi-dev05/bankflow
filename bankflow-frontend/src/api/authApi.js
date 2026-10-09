import { api } from "./client";

export const authApi = {
  signup: (payload) => api.post("/users/signup", payload),
  login: (payload) => api.post("/users/login", payload),
  resetPassword: (payload) => api.post("/users/reset-password", payload),
};