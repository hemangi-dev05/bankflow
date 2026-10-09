import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import FormField from "../../components/FormField";
import PasswordInput from "../../components/PasswordInput";
import "./Auth.css";

const PHONE_PATTERN = /^[0-9]{10}$/;

export default function Signup() {
  const { login } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "", phone: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [formError, setFormError] = useState("");

  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = "Name is required";
    if (!form.email.trim()) next.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email address";
    if (!form.password) next.password = "Password is required";
    else if (form.password.length < 8) next.password = "Password must be at least 8 characters";
    if (!form.confirmPassword) next.confirmPassword = "Confirm your password";
    else if (form.confirmPassword !== form.password) next.confirmPassword = "Passwords don't match";
    if (!form.phone.trim()) next.phone = "Phone number is required";
    else if (!PHONE_PATTERN.test(form.phone)) next.phone = "Phone number must be 10 digits";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");
    if (!validate()) return;

    setStatus("loading");
    try {
      const { confirmPassword, ...signupPayload } = form;
      const user = await authApi.signup(signupPayload);
      login(user);
      notify(`Welcome to BankFlow, ${user.name.split(" ")[0]}.`);
      navigate("/app/open-account", { replace: true });
    } catch (err) {
      setStatus("error");
      setFormError(err.message);
    }
  }

  return (
    <div className="auth-page container">
      <div className="auth-card">
        <h1>Open an account</h1>
        <p className="auth-sub">A few details to get you started.</p>

        <form onSubmit={handleSubmit} noValidate>
          <FormField label="Full name" htmlFor="name" error={errors.name}>
            <input
              id="name"
              className={`input ${errors.name ? "has-error" : ""}`}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              autoComplete="name"
            />
          </FormField>

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

          <FormField label="Phone number" htmlFor="phone" error={errors.phone} hint="10 digits, no country code">
            <input
              id="phone"
              className={`input ${errors.phone ? "has-error" : ""}`}
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              autoComplete="tel"
              inputMode="numeric"
            />
          </FormField>

          <FormField label="Password" htmlFor="password" error={errors.password} hint="At least 8 characters">
            <PasswordInput
              id="password"
              className={errors.password ? "has-error" : ""}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              autoComplete="new-password"
            />
          </FormField>

          <FormField label="Confirm password" htmlFor="confirmPassword" error={errors.confirmPassword}>
            <PasswordInput
              id="confirmPassword"
              className={errors.confirmPassword ? "has-error" : ""}
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              autoComplete="new-password"
            />
          </FormField>

          {formError && (
            <div className="auth-form-error" role="alert">
              {formError}
            </div>
          )}

          <button type="submit" className="btn btn-primary btn-block" disabled={status === "loading"}>
            {status === "loading" ? "Creating account…" : "Create Account"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}