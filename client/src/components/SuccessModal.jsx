import React from "react";

export default function SuccessModal({ open, title, message, buttonLabel, onButtonClick }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-primary/50" onClick={onButtonClick}></div>
      <div className="relative bg-background rounded-sign shadow-lg max-w-sm w-full p-6 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary-light">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-secondary">
            <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6.414 1.793-1.799 4.989 5.084 8.479-12.71a.75.75 0 011.04-.209z" clipRule="evenodd" />
          </svg>
        </div>
        <h2 className="font-display text-xl font-semibold mb-2">{title}</h2>
        <p className="text-sm text-muted mb-6">{message}</p>
        <button
          type="button"
          onClick={onButtonClick}
          className="w-full py-3 rounded-sign bg-primary text-white font-semibold hover:bg-primary-hover transition-colors"
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}
