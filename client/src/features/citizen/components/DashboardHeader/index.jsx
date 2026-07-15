import React, { useState } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { useTheme } from '../../../../context/ThemeContext';
import { useLogoutConfirm } from '../../layouts/CitizenDashboardLayout';

export default function DashboardHeader({ title, breadcrumb }) {
  const { userProfile } = useAuth();
  const requestLogout = useLogoutConfirm();
  const { theme, toggleTheme } = useTheme();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header className="bg-card dark:bg-asphalt-light border-b border-border dark:border-white/10 sticky top-0 z-30">
      <div className="px-4 lg:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="font-display font-semibold text-lg">{title}</h1>
          {breadcrumb && (
            <nav className="hidden sm:flex items-center text-sm text-muted dark:text-white/60">
              {breadcrumb.map((item, index) => (
                <React.Fragment key={item.label}>
                  {index > 0 && <span className="mx-2">/</span>}
                  {item.href ? (
                    <a href={item.href} className="hover:text-ink dark:hover:text-white">
                      {item.label}
                    </a>
                  ) : (
                    <span className="text-ink dark:text-white">{item.label}</span>
                  )}
                </React.Fragment>
              ))}
            </nav>
          )}
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-muted dark:hover:bg-white/10 rounded-lg transition-colors lg:hidden">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          <button className="p-2 hover:bg-muted dark:hover:bg-white/10 rounded-lg transition-colors relative">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          <button
            onClick={toggleTheme}
            className="p-2 hover:bg-muted dark:hover:bg-white/10 rounded-lg transition-colors"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            )}
          </button>

          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-2 p-1 hover:bg-muted dark:hover:bg-white/10 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-primary/10 dark:bg-white/10 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-primary dark:text-white">
                  {userProfile?.display_name?.charAt(0) || 'U'}
                </span>
              </div>
              <svg className="w-4 h-4 text-muted dark:text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-card dark:bg-asphalt-light border border-border dark:border-white/10 rounded-lg shadow-lg py-2">
                <div className="px-4 py-2 border-b border-border dark:border-white/10">
                  <p className="font-medium text-sm text-ink dark:text-white">{userProfile?.display_name || 'Citizen'}</p>
                  <p className="text-xs text-muted dark:text-white/60">{userProfile?.email_address}</p>
                </div>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    requestLogout();
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-muted dark:hover:bg-white/10 transition-colors"
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
