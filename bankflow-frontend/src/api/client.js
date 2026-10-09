// Thin fetch wrapper around the BankFlow Spring Boot API.
// Every request/response shape here mirrors the actual backend DTOs —
// nothing here is invented.

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

// Fallback copy used only when the backend genuinely returns nothing
// meaningful (e.g. a network failure) — matches the pattern the app
// spec asked for, keyed by HTTP status.
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
  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      signal,
    });
  } catch (networkErr) {
    throw new ApiError(
      "Can't reach BankFlow right now. Check your connection and try again.",
      0
    );
  }

  // 204 / empty body
  const text = await response.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text; // e.g. the plain-string transfer success response
    }
  }

  if (!response.ok) {
    // Backend's GlobalExceptionHandler returns { message, status, timestamp }
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
