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
    <div className="min-h-screen bg-asphalt text-canvas flex">
      <aside className="w-60 shrink-0 border-r border-canvas/10 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-canvas/10">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-sign bg-gold text-ink font-bold mr-2">
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
                  isActive ? "bg-gold text-ink" : "text-canvas/70 hover:bg-asphalt-light hover:text-canvas"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-canvas/10 text-xs">
          <p className="text-canvas/50 mb-1">Signed in as</p>
          <p className="font-medium mb-3 truncate">{userProfile?.display_name || "Administrator"}</p>
          <button
            type="button"
            onClick={logout}
            className="w-full py-2 rounded-sign border border-canvas/20 hover:bg-canvas/10 transition-colors"
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
