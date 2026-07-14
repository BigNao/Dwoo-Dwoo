import React from 'react';

export default function FloatingReportButton({ className = '', onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`hidden lg:flex fixed bottom-8 right-8 bg-primary text-white p-4 rounded-full shadow-lg hover:bg-primary-hover hover:shadow-xl transition-all z-40 ${className}`}
      aria-label="Create new report"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    </button>
  );
}
