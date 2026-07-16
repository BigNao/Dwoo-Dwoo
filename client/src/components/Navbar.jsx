import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ConfirmModal from "./ConfirmModal.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showBackLogoutModal, setShowBackLogoutModal] = useState(false);
  const backModalOpenRef = useRef(false);
  const ignorePopRef = useRef(false);

  useEffect(() => {
    backModalOpenRef.current = showBackLogoutModal;
  }, [showBackLogoutModal]);

  useEffect(() => {
    if (!currentUser) return;
    if (!location.pathname.startsWith("/citizen") && !location.pathname.startsWith("/admin")) return;

    window.history.pushState(null, document.title, window.location.href);

    const handlePopState = () => {
      if (ignorePopRef.current) {
        ignorePopRef.current = false;
        return;
      }

      if (backModalOpenRef.current) return;

      setShowBackLogoutModal(true);
      ignorePopRef.current = true;
      window.history.go(1);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [currentUser, location.pathname]);

  async function handleBackLogoutConfirm() {
    setShowBackLogoutModal(false);
    await logout();
    navigate("/");
  }

  function handleBackLogoutCancel() {
    setShowBackLogoutModal(false);
  }

  return (
    <>
      <div className="bg-primary text-white/70 text-xs font-mono">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-8 flex items-center gap-2 overflow-hidden">
          <span aria-hidden="true" className="shrink-0">
            <svg className="h-4 w-5 inline-block" viewBox="0 0 20 14" xmlns="http://www.w3.org/2000/svg">
              <rect width="20" height="4.67" fill="#CE1126" />
              <rect y="4.67" width="20" height="4.66" fill="#FCD116" />
              <rect y="9.33" width="20" height="4.67" fill="#006B3F" />
              <polygon points="10,4.5 11.2,7 14,7 11.8,8.8 12.5,11.5 10,9.8 7.5,11.5 8.2,8.8 6,7 8.8,7" fill="#000" />
            </svg>
          </span>
          <span className="truncate">An official road-safety reporting service for Ghana.</span>
        </div>
      </div>

      <header className="border-b border-border sticky top-0 z-40 relative">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(/assets/images.jpg)' }}></div>
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between text-white">
          <Link to="/" className="flex items-center gap-2 font-display font-semibold text-lg">
            <img src="/assets/k-logo.png" alt="KwansoDwoo" className="h-8 w-8 object-contain" />
            KwansoDwoo
          </Link>

          <nav className="flex items-center gap-2 sm:gap-4 text-sm font-medium flex-wrap justify-end">
            <Link to="/track" className="hover:text-accent transition-colors text-xs sm:text-sm whitespace-nowrap">
              Track
            </Link>
            <Link to="/login" className="hover:text-accent transition-colors text-xs sm:text-sm">
              Log in
            </Link>
            <Link
              to="/report"
              className="px-2 sm:px-3 py-1.5 rounded-sign bg-accent text-ink hover:bg-white/90 transition-colors text-xs sm:text-sm whitespace-nowrap"
            >
              Report
            </Link>
          </nav>
        </div>
      </header>

      <ConfirmModal
        open={showBackLogoutModal}
        title="Leave the dashboard?"
        message="Pressing the browser back button will log you out and return you to the public website."
        confirmLabel="Log out and leave"
        cancelLabel="Stay logged in"
        onConfirm={handleBackLogoutConfirm}
        onCancel={handleBackLogoutCancel}
      />
    </>
  );
}
