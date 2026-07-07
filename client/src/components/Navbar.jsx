import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { currentUser, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  return (
    <>
      <div className="bg-navy text-canvas/70 text-xs font-mono">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-8 flex items-center gap-2">
          <span aria-hidden="true">🇬🇭</span>
          <span>An official road-safety reporting service for Ghana.</span>
        </div>
      </div>

      <header className="border-b border-ink/10 bg-canvas/95 backdrop-blur sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-display font-semibold text-lg">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-sign bg-gold text-ink font-bold">
              K
            </span>
            KwansoDwoo
          </Link>

          <nav className="flex items-center gap-4 text-sm font-medium">
            <Link to="/track" className="hover:text-gold-dark transition-colors">
              Track Report
            </Link>

            {isAdmin && (
              <Link to="/admin" className="hover:text-gold-dark transition-colors">
                Admin
              </Link>
            )}

            {currentUser ? (
              <>
                <Link to="/my-reports" className="hover:text-gold-dark transition-colors">
                  My Reports
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-sign border border-ink/20 hover:bg-ink hover:text-canvas transition-colors"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-gold-dark transition-colors">
                  Log in
                </Link>
                <Link
                  to="/report"
                  className="px-3 py-1.5 rounded-sign bg-kente text-canvas hover:bg-kente-dark transition-colors"
                >
                  Report Incident
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>
    </>
  );
}
