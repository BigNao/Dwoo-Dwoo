import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

/**
 * Wrap admin-only pages with this component. Redirects to /login if the
 * visitor is not signed in, or if they are signed in but their Firestore
 * users/{uid}.role is not "admin".
 */
export default function PrivateRoute({ children }) {
  const { currentUser, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-asphalt text-white">
        <p className="font-mono text-sm tracking-wide">Checking credentials…</p>
      </div>
    );
  }

  if (!currentUser || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
