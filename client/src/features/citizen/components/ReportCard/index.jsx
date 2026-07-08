import React from 'react';
import StatusBadge from '../../../../components/StatusBadge';

export default function ReportCard({ report, onClick, className = '' }) {
  const formatDate = (ts) => {
    if (!ts) return '—';
    const date = ts.toDate ? ts.toDate() : new Date(ts.seconds * 1000);
    return date.toLocaleDateString('en-GH', { dateStyle: 'medium' });
  };

  return (
    <button
      onClick={onClick}
      className={`bg-card rounded-lg border border-border p-4 sm:p-5 shadow-sm hover:border-primary hover:shadow-md transition-all text-left w-full ${className}`}
    >
      <div className="flex items-start justify-between gap-3 sm:gap-4 mb-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-mono text-muted/80 mb-1 truncate">{report.reference_number}</p>
          <p className="font-semibold truncate">{report.incident_type}</p>
        </div>
        <StatusBadge status={report.status} />
      </div>
      <div className="flex items-center justify-between text-sm text-muted flex-wrap gap-2">
        <span className="truncate">{formatDate(report.timestamp)}</span>
        <span className="font-mono shrink-0">Confidence: {report.confidence_score}/100</span>
      </div>
    </button>
  );
}
