import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

/**
 * AdminRoute - Protects admin-only pages.
 * Redirects to /admin/login if not authenticated or not an admin.
 * Redirects citizens to /citizen if they accidentally access admin routes.
 */
export default function AdminRoute({ children }) {
  const { currentUser, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-asphalt text-white">
        <p className="font-mono text-sm tracking-wide">Verifying administrator access…</p>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!isAdmin) {
    // If authenticated but not admin, redirect to citizen dashboard
    return <Navigate to="/citizen" replace />;
  }

  return children;
}
