import React from "react";
import { NavLink, Route, Routes } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import LiveMap from "./LiveMap.jsx";
import ReportsList from "./ReportsList.jsx";
import Analytics from "./Analytics.jsx";

const NAV_ITEMS = [
  { to: "/admin", label: "Live Map", end: true },
  { to: "/admin/reports", label: "Reports List" },
  { to: "/admin/analytics", label: "Analytics" },
];

export default function AdminDashboard() {
  const { userProfile, logout } = useAuth();

  return (
    <div className="min-h-screen bg-asphalt text-white flex flex-col lg:flex-row">
      {/* Mobile top bar */}
      <div className="lg:hidden flex items-center justify-between px-4 h-14 border-b border-white/10 bg-asphalt-dark">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-sign bg-accent text-ink font-bold text-sm">
            K
          </span>
          <span className="font-display font-semibold text-sm">KwansoDwoo</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/50 truncate max-w-[100px]">{userProfile?.display_name || "Admin"}</span>
          <button
            type="button"
            onClick={logout}
            className="px-2 py-1 text-xs rounded-sign border border-white/20 hover:bg-white/10 transition-colors"
          >
            Log out
          </button>
        </div>
      </div>

      {/* Mobile tab nav */}
      <nav className="lg:hidden flex border-b border-white/10 bg-asphalt-dark overflow-x-auto">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
                isActive ? "bg-accent text-ink" : "text-white/70 hover:text-white"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-60 shrink-0 border-r border-white/10 flex-col">
        <div className="h-16 flex items-center px-6 border-b border-white/10">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-sign bg-accent text-ink font-bold mr-2">
            K
          </span>
          <span className="font-display font-semibold">KwansoDwoo</span>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `block px-4 py-2.5 rounded-sign text-sm font-medium transition-colors ${
                  isActive ? "bg-accent text-ink" : "text-white/70 hover:bg-asphalt-light hover:text-white"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-white/10 text-xs">
          <p className="text-white/50 mb-1">Signed in as</p>
          <p className="font-medium mb-3 truncate">{userProfile?.display_name || "Administrator"}</p>
          <button
            type="button"
            onClick={logout}
            className="w-full py-2 rounded-sign border border-white/20 hover:bg-background/10 transition-colors"
          >
            Log out
          </button>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <Routes>
          <Route index element={<LiveMap />} />
          <Route path="reports" element={<ReportsList />} />
          <Route path="analytics" element={<Analytics />} />
        </Routes>
      </div>
    </div>
  );
}
