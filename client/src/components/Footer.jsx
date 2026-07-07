import React from "react";
import { Link } from "react-router-dom";

const COLUMNS = [
  {
    title: "Report",
    links: [
      { label: "Submit a Report", to: "/report" },
      { label: "Track My Report", to: "/track" },
      { label: "Incident Categories", to: "/#categories" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Register", to: "/register" },
      { label: "Log In", to: "/login" },
      { label: "My Reports", to: "/my-reports" },
    ],
  },
  {
    title: "About KwansoDwoo",
    links: [
      { label: "How Reports Are Reviewed", to: "/#how-it-works" },
      { label: "Confidence Scoring", to: "/#how-it-works" },
      { label: "Data & Privacy", to: "#" },
    ],
  },
  {
    title: "Officials",
    links: [
      { label: "Admin Login", to: "/login" },
      { label: "Dashboard Access", to: "/admin" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-navy text-canvas/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="text-xs font-mono uppercase tracking-widest text-gold mb-4">
                {col.title}
              </p>
              <ul className="space-y-2.5 text-sm">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="hover:text-canvas transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-canvas/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-sign bg-gold text-ink font-bold text-sm">
              K
            </span>
            <span className="font-display font-semibold text-canvas">KwansoDwoo</span>
          </div>
          <p className="text-xs font-mono text-canvas/40">
            A road safety incident reporting &amp; monitoring system for Ghana.
          </p>
        </div>
      </div>
    </footer>
  );
}
