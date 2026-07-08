import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SuccessModal from "./SuccessModal.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { currentUser, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  async function handleLogoutClick() {
    setShowLogoutModal(true);
  }

  async function handleLogoutConfirm() {
    setShowLogoutModal(false);
    await logout();
    navigate("/");
  }

  return (
    <>
      <div className="bg-primary text-white/70 text-xs font-mono">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-8 flex items-center gap-2 overflow-hidden">
          <span aria-hidden="true" className="shrink-0">🇬🇭</span>
          <span className="truncate">An official road-safety reporting service for Ghana.</span>
        </div>
      </div>

      <header className="border-b border-border sticky top-0 z-40 relative">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(/assets/images.jpg)' }}></div>
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between text-white">
          <Link to="/" className="flex items-center gap-2 font-display font-semibold text-lg">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-sign bg-accent text-ink font-bold">
              K
            </span>
            KwansoDwoo
          </Link>

          <nav className="flex items-center gap-2 sm:gap-4 text-sm font-medium flex-wrap justify-end">
            <Link to="/track" className="hover:text-accent transition-colors text-xs sm:text-sm whitespace-nowrap">
              Track
            </Link>

            {isAdmin && (
              <Link to="/admin" className="hover:text-accent transition-colors text-xs sm:text-sm">
                Admin
              </Link>
            )}

            {currentUser ? (
              <>
                <Link to="/my-reports" className="hover:text-accent transition-colors text-xs sm:text-sm whitespace-nowrap">
                  My Reports
                </Link>
                <button
                  onClick={handleLogoutClick}
                  className="px-2 sm:px-3 py-1.5 rounded-sign border border-white/30 hover:bg-white/20 transition-colors text-xs sm:text-sm"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-accent transition-colors text-xs sm:text-sm">
                  Log in
                </Link>
                <Link
                  to="/report"
                  className="px-2 sm:px-3 py-1.5 rounded-sign bg-accent text-ink hover:bg-white/90 transition-colors text-xs sm:text-sm whitespace-nowrap"
                >
                  Report
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <SuccessModal
        open={showLogoutModal}
        title="Logged out"
        message="You have been logged out successfully."
        buttonLabel="Return to home"
        onButtonClick={handleLogoutConfirm}
      />
    </>
  );
}
