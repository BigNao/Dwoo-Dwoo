import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");

    if (!email || !password) {
      setFormError("Enter your email and password.");
      return;
    }

    setSubmitting(true);
    try {
      await login({ email: email.trim(), password });
      const redirectTo = location.state?.from || "/my-reports";
      navigate(redirectTo);
    } catch (err) {
      setFormError(mapFirebaseError(err.code));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />
      <main className="max-w-md mx-auto px-4 sm:px-6 py-14">
        <h1 className="font-display text-3xl font-semibold mb-2">Log in</h1>
        <p className="text-sm text-ink/60 mb-8">
          Welcome back. Log in to view your reports or access the admin dashboard.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2">Email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-sign border border-ink/20 px-4 py-3 bg-white focus:border-kente"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-sign border border-ink/20 px-4 py-3 bg-white focus:border-kente"
            />
          </div>

          {formError && <p className="text-sm text-kente font-medium">{formError}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-sign bg-ink text-canvas font-semibold hover:bg-ink/80 transition-colors disabled:opacity-50"
          >
            {submitting ? "Logging in…" : "Log in"}
          </button>
        </form>

        <p className="mt-6 text-sm text-ink/60">
          Don't have an account?{" "}
          <Link to="/register" className="text-kente font-medium">
            Register
          </Link>
        </p>
      </main>
      <Footer />
    </div>
  );
}

function mapFirebaseError(code) {
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Incorrect email or password.";
    case "auth/invalid-email":
      return "Enter a valid email address.";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait a moment and try again.";
    default:
      return "Something went wrong logging in. Please try again.";
  }
}
