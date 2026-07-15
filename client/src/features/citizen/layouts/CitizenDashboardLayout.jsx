import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMediaQuery } from '../hooks/useMediaQuery';
import CitizenDesktopLayout from './CitizenDesktopLayout';
import CitizenMobileLayout from './CitizenMobileLayout';
import { BREAKPOINTS } from '../constants/breakpoints';
import ConfirmModal from '../../../components/ConfirmModal.jsx';
import { useAuth } from '../../../context/AuthContext.jsx';

const LogoutContext = createContext(null);

export function useLogoutConfirm() {
  const ctx = useContext(LogoutContext);
  if (!ctx) throw new Error('useLogoutConfirm must be used within CitizenDashboardLayout');
  return ctx;
}

export default function CitizenDashboardLayout({ children, title, breadcrumb }) {
  const isDesktop = useMediaQuery(`(min-width: ${BREAKPOINTS.DESKTOP}px)`);
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
    if (!location.pathname.startsWith('/citizen')) return;

    window.history.pushState(null, document.title, window.location.href);

    const handlePopState = () => {
      if (ignorePopRef.current) {
        ignorePopRef.current = false;
        return;
      }

      if (backModalOpenRef.current) return;

      setShowBackLogoutModal(true);
      ignorePopRef.current = true;
      window.history.pushState(null, document.title, window.location.href);
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [currentUser, location.pathname]);

  async function handleBackLogoutConfirm() {
    setShowBackLogoutModal(false);
    await logout();
    navigate('/');
  }

  function handleBackLogoutCancel() {
    setShowBackLogoutModal(false);
  }

  const requestLogout = useCallback(() => {
    setShowBackLogoutModal(true);
  }, []);

  return (
    <LogoutContext.Provider value={requestLogout}>
      {isDesktop ? (
        <CitizenDesktopLayout title={title} breadcrumb={breadcrumb}>
          <div className="fade-in">{children}</div>
        </CitizenDesktopLayout>
      ) : (
        <CitizenMobileLayout title={title} breadcrumb={breadcrumb}>
          <div className="fade-in">{children}</div>
        </CitizenMobileLayout>
      )}

      <ConfirmModal
        open={showBackLogoutModal}
        title="Log out?"
        message="You will be logged out and returned to the public website."
        confirmLabel="Log out"
        cancelLabel="Cancel"
        onConfirm={handleBackLogoutConfirm}
        onCancel={handleBackLogoutCancel}
      />
    </LogoutContext.Provider>
  );
}
