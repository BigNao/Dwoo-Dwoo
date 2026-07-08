import React from "react";
import { Link } from "react-router-dom";

const COLUMNS = [
  {
    title: "Report",
    links: [
      { label: "Submit a Report", to: "/report" },
      { label: "Track My Report", to: "/track" },
      { label: "Crime & Tip Portals", to: "/#crime-tips" },
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
];

export default function Footer() {
  return (
    <footer className="bg-primary text-white/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="text-xs font-mono uppercase tracking-widest text-accent mb-4">
                {col.title}
              </p>
              <ul className="space-y-2.5 text-sm">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-sign bg-accent text-ink font-bold text-sm">
              K
            </span>
            <span className="font-display font-semibold text-white">KwansoDwoo</span>
          </div>
          <p className="text-xs font-mono text-white/40">
            A road safety incident reporting &amp; monitoring system for Ghana.
          </p>
        </div>
      </div>
    </footer>
  );
}
