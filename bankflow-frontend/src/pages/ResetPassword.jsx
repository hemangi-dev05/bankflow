import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../api/authApi";
import { useToast } from "../context/ToastContext";
import FormField from "../components/FormField";
import PasswordInput from "../components/PasswordInput";
import "./public/Auth.css";

const PHONE_PATTERN = /^[0-9]{10}$/;

export default function ResetPassword() {
  const { notify } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", phone: "", newPassword: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | loading | error
  const [formError, setFormError] = useState("");

  function validate() {
    const next = {};
    if (!form.email.trim()) next.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email address";
    if (!form.phone.trim()) next.phone = "Phone number is required";
    else if (!PHONE_PATTERN.test(form.phone)) next.phone = "Phone number must be 10 digits";
    if (!form.newPassword) next.newPassword = "New password is required";
    else if (form.newPassword.length < 8) next.newPassword = "Password must be at least 8 characters";
    if (!form.confirmPassword) next.confirmPassword = "Confirm your new password";
    else if (form.confirmPassword !== form.newPassword) next.confirmPassword = "Passwords don't match";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");
    if (!validate()) return;

    setStatus("loading");
    try {
      await authApi.resetPassword({
        email: form.email,
        phone: form.phone,
        newPassword: form.newPassword,
      });
      notify("Password reset. Please sign in with your new password.");
      navigate("/login", { replace: true });
    } catch (err) {
      setStatus("error");
      setFormError(err.message);
    }
  }

  return (
    <div className="auth-page container">
      <div className="auth-card">
        <h1>Reset password</h1>
        <p className="auth-sub">
          Confirm the email and phone number on your account, then choose a new password.
        </p>

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

          <FormField label="New password" htmlFor="newPassword" error={errors.newPassword} hint="At least 8 characters">
            <PasswordInput
              id="newPassword"
              className={errors.newPassword ? "has-error" : ""}
              value={form.newPassword}
              onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
              autoComplete="new-password"
            />
          </FormField>

          <FormField label="Confirm new password" htmlFor="confirmPassword" error={errors.confirmPassword}>
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
            {status === "loading" ? "Resetting…" : "Reset Password"}
          </button>
        </form>

        <p className="auth-switch">
          Remembered it? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}