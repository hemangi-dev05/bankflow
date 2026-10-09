const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

const TOKEN_KEY = "bankflow.token";
const USER_KEY = "bankflow.user";

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

const STATUS_FALLBACK = {
  400: "Please check the information you entered.",
  401: "Your credentials are incorrect.",
  404: "The requested resource could not be found.",
  409: "This action conflicts with an existing record.",
  500: "Something went wrong on our side. Please try again.",
};

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

async function request(path, { method = "GET", body, signal } = {}) {
  const isAuthPath = path.startsWith("/users/");
  const token = tokenStore.get();

  const headers = {};
  if (body) headers["Content-Type"] = "application/json";
  if (token && !isAuthPath) headers.Authorization = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal,
    });
  } catch (networkErr) {
    throw new ApiError(
      "Can't reach BankFlow right now. Check your connection and try again.",
      0
    );
  }

  const text = await response.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (response.status === 401 && !isAuthPath) {
    tokenStore.clear();
    localStorage.removeItem(USER_KEY);
    window.location.assign("/login");
  }

  if (!response.ok) {
    const message =
      (data && typeof data === "object" && data.message) ||
      STATUS_FALLBACK[response.status] ||
      "Something went wrong. Please try again.";
    throw new ApiError(message, response.status);
  }

  return data;
}

export const api = {
  get: (path, opts) => request(path, { ...opts, method: "GET" }),
  post: (path, body, opts) => request(path, { ...opts, method: "POST", body }),
  put: (path, body, opts) => request(path, { ...opts, method: "PUT", body }),
};