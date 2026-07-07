import React from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

/**
 * CitizenRoute - Protects citizen-only pages.
 * Redirects to /login if not authenticated.
 * Redirects admins to /admin if they accidentally access citizen routes.
 */
export default function CitizenRoute() {
  const { currentUser, isAdmin, isCitizen, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-sm text-muted animate-pulse">Loading your dashboard…</p>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (isAdmin) {
    // If authenticated as admin, redirect to admin dashboard
    return <Navigate to="/admin" replace />;
  }

  if (!isCitizen) {
    // If authenticated but role is neither citizen nor admin, redirect to login
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
