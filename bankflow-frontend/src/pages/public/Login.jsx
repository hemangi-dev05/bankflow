import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { authApi } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import FormField from "../../components/FormField";
import PasswordInput from "../../components/PasswordInput";
import "./Auth.css";

export default function Login() {
  const { login } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [formError, setFormError] = useState("");

  function validate() {
    const next = {};
    if (!form.email.trim()) next.email = "Email is required";
    if (!form.password) next.password = "Password is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");
    if (!validate()) return;

    setStatus("loading");
    try {
      const user = await authApi.login(form);
      login(user);
      notify(`Welcome back, ${(user.name || "").split(" ")[0] || "there"}.`);
      const redirectTo = location.state?.from?.pathname || "/app";
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setStatus("error");
      setFormError(err.message);
    }
  }

  return (
    <div className="auth-page container">
      <div className="auth-card">
        <h1>Sign in</h1>
        <p className="auth-sub">Welcome back to BankFlow.</p>

        <form onSubmit={handleSubmit} noValidate>
          <FormField label="Email" htmlFor="email" error={errors.email}>
            <input
              id="email"
              type="email"
              className={`input ${errors.email ? "has-error" : ""}`}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              autoComplete="email"
            />
          </FormField>

          <FormField label="Password" htmlFor="password" error={errors.password}>
            <PasswordInput
              id="password"
              className={errors.password ? "has-error" : ""}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              autoComplete="current-password"
            />
          </FormField>

          <p className="auth-forgot-link">
            <Link to="/reset-password">Forgot password?</Link>
          </p>

          {formError && (
            <div className="auth-form-error" role="alert">
              {formError}
            </div>
          )}

          <button type="submit" className="btn btn-primary btn-block" disabled={status === "loading"}>
            {status === "loading" ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="auth-switch">
          New to BankFlow? <Link to="/signup">Open an account</Link>
        </p>
      </div>
    </div>
  );
}