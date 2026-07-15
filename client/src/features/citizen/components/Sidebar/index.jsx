import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../../../context/AuthContext';
import { SIDEBAR_ITEMS } from '../../constants/sidebar';
import { useLogoutConfirm } from '../../layouts/CitizenDashboardLayout';

export default function Sidebar() {
  const { userProfile } = useAuth();
  const requestLogout = useLogoutConfirm();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`hidden lg:flex flex-col bg-card dark:bg-asphalt-light border-r border-border dark:border-white/10 transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="h-16 flex items-center px-6 border-b border-border dark:border-white/10">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary dark:bg-accent text-white dark:text-ink font-bold mr-2 shrink-0">
          K
        </span>
        {!collapsed && <span className="font-display font-semibold">KwansoDwoo</span>}
      </div>

      <nav className="flex-1 px-3 py-6 space-y-1">
        {SIDEBAR_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/citizen'}
            className={({ isActive }) =>
              `flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary dark:bg-accent text-white dark:text-ink'
                  : 'text-muted dark:text-white/60 hover:bg-muted dark:hover:bg-white/10 hover:text-ink dark:hover:text-white'
              }`
            }
          >
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {item.icon === 'Home' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />}
              {item.icon === 'FileText' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />}
              {item.icon === 'Bell' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />}
              {item.icon === 'User' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />}
              {item.icon === 'Settings' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />}
            </svg>
            {!collapsed && <span className="ml-3">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-border dark:border-white/10">
        {!collapsed && (
          <>
            <p className="text-xs text-muted dark:text-white/50 mb-1">Signed in as</p>
            <p className="font-medium text-sm mb-3 truncate">{userProfile?.display_name || 'Citizen'}</p>
          </>
        )}
        <button
          type="button"
          onClick={requestLogout}
          className="w-full py-2 rounded-lg border border-border dark:border-white/20 hover:bg-muted dark:hover:bg-white/10 transition-colors text-sm font-medium"
        >
          {collapsed ? (
            <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          ) : (
            'Log out'
          )}
        </button>
      </div>
    </aside>
  );
}
