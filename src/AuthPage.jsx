import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "./api/api.js";

export default function AuthPage({ mode = "login" }) {
  const isSignup = mode === "signup";
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (isSubmitting) return;
    setError("");

    if (isSignup && !username.trim()) {
      setError("Enter a username.");
      return;
    }

    if (isSignup && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (isSignup) {
        await api.post("/api/auth/register", {
          username: username.trim(),
          email: email.trim(),
          password,
        });
        navigate("/login", {
          replace: true,
          state: { notice: "Account created. Sign in to continue." },
        });
      } else {
        const { data } = await api.post("/api/auth/login", {
          email: email.trim(),
          password,
        });

        if (typeof data.token !== "string" || !data.token.trim() ||
          typeof data.refreshToken !== "string" || !data.refreshToken.trim()) {
          setError("The server did not return login tokens. Please try again.");
          return;
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem("refreshToken", data.refreshToken);
        navigate("/home", { replace: true });
      }
    } catch (requestError) {
      const message = requestError.response?.data?.message;
      setError(
        typeof message === "string" && message.trim()
          ? message
          : "Unable to connect or complete your request. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="auth-page" aria-labelledby="auth-title">
      <h1 id="auth-title" tabIndex={-1}>
        {isSignup ? "Create account" : "Sign in"}
      </h1>

      {!isSignup && location.state?.notice && (
        <p className="auth-notice" role="status">{location.state.notice}</p>
      )}

      <form className="auth-form" onSubmit={handleSubmit} aria-busy={isSubmitting}>
        <fieldset disabled={isSubmitting}>
          {isSignup && (
            <div className="field">
              <label htmlFor="auth-username">Username</label>
              <input id="auth-username" name="username" autoComplete="username"
                value={username} onChange={(event) => setUsername(event.target.value)}
                required />
            </div>
          )}

          <div className="field">
            <label htmlFor="auth-email">Email</label>
            <input id="auth-email" name="email" type="email" autoComplete="email"
              value={email} onChange={(event) => setEmail(event.target.value)}
              required />
          </div>

          <div className="field">
            <label htmlFor="auth-password">Password</label>
            <input id="auth-password" name="password"
              type={showPassword ? "text" : "password"}
              autoComplete={isSignup ? "new-password" : "current-password"}
              value={password} onChange={(event) => setPassword(event.target.value)}
              required />
          </div>

          {isSignup && (
            <div className="field">
              <label htmlFor="auth-confirm-password">Confirm password</label>
              <input id="auth-confirm-password" name="confirmPassword"
                type={showPassword ? "text" : "password"} autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)} required />
            </div>
          )}

          <label className="auth-password-toggle">
            <input type="checkbox" checked={showPassword}
              onChange={(event) => setShowPassword(event.target.checked)} />
            Show password
          </label>

          {error && <p className="error" role="alert">{error}</p>}

          <button type="submit">
            {isSubmitting
              ? (isSignup ? "Creating account..." : "Signing in...")
              : (isSignup ? "Create account" : "Sign in")}
          </button>
        </fieldset>
      </form>

      <p className="auth-switch">
        {isSignup ? "Already have an account? " : "Don't have an account? "}
        <Link to={isSignup ? "/login" : "/signup"}>
          {isSignup ? "Sign in" : "Sign up"}
        </Link>
      </p>
    </section>
  );
}