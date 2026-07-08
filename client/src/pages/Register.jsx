import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import SuccessModal from "../components/SuccessModal.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  function validate() {
    const errs = {};
    if (!name.trim()) errs.name = "Name is required.";
    if (!/^\S+@\S+\.\S+$/.test(email)) errs.email = "Enter a valid email address.";
    if (password.length < 6) errs.password = "Password must be at least 6 characters.";
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    try {
      await register({ name: name.trim(), email: email.trim(), password });
      setShowSuccessModal(true);
    } catch (err) {
      setFormError(mapFirebaseError(err.code));
    } finally {
      setSubmitting(false);
    }
  }

  function handleModalClose() {
    setShowSuccessModal(false);
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-md mx-auto px-4 sm:px-6 py-14">
        <h1 className="font-display text-3xl font-semibold mb-2">Create an account</h1>
        <p className="text-sm text-muted mb-8">
          Registering lets you track every report you submit in one place.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Field label="Full name" error={errors.name}>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-sign border border-border px-4 py-3 bg-card focus:border-primary"
            />
          </Field>

          <Field label="Email address" error={errors.email}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-sign border border-border px-4 py-3 bg-card focus:border-primary"
            />
          </Field>

          <Field label="Password" error={errors.password}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-sign border border-border px-4 py-3 bg-card focus:border-primary"
            />
          </Field>

          {formError && <p className="text-sm text-danger font-medium">{formError}</p>}
          <SuccessModal
            open={showSuccessModal}
            title="Account created"
            message="Your citizen account has been created successfully."
            buttonLabel="Go to login"
            onButtonClick={handleModalClose}
          />

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-sign bg-primary text-white font-semibold hover:bg-primary-hover transition-colors disabled:opacity-50"
          >
            {submitting ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-sm text-muted">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-medium">
            Log in
          </Link>
        </p>
      </main>
      <Footer />
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      {children}
      {error && <p className="mt-1.5 text-sm text-danger font-medium">{error}</p>}
    </div>
  );
}

function mapFirebaseError(code) {
  switch (code) {
    case "auth/email-already-in-use":
      return "An account with this email already exists.";
    case "auth/invalid-email":
      return "Enter a valid email address.";
    case "auth/weak-password":
      return "Choose a stronger password (at least 6 characters).";
    default:
      return "Something went wrong creating your account. Please try again.";
  }
}
