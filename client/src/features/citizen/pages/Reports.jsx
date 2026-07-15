import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CitizenDashboardLayout from '../layouts/CitizenDashboardLayout';
import ReportCard from '../components/ReportCard';
import EmptyState from '../components/EmptyState';
import { useCitizenReports } from '../hooks/useCitizenReports';

export default function Reports() {
  const navigate = useNavigate();
  const { reports, loading, error } = useCitizenReports();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filteredReports = reports.filter((report) => {
    const matchesFilter = filter === 'all' || report.status === filter;
    const matchesSearch =
      search === '' ||
      report.reference_number?.toLowerCase().includes(search.toLowerCase()) ||
      report.incident_type?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const statusCounts = {
    all: reports.length,
    pending: reports.filter((r) => r.status === 'pending').length,
    verified: reports.filter((r) => r.status === 'verified').length,
    resolved: reports.filter((r) => r.status === 'resolved').length,
  };

  if (error) {
    return (
      <CitizenDashboardLayout title="My Reports">
        <div className="text-center py-12">
          <p className="text-danger mb-4">Failed to load your reports</p>
          <p className="text-muted dark:text-white/60 text-sm">Please refresh the page or try again later</p>
        </div>
      </CitizenDashboardLayout>
    );
  }

  return (
    <CitizenDashboardLayout title="My Reports">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search reports..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border dark:border-white/10 rounded-lg bg-card dark:bg-asphalt-light focus:border-primary dark:focus:border-accent focus:outline-none text-ink dark:text-white"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted dark:text-white/50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div className="flex gap-2 flex-wrap">
            {['all', 'pending', 'verified', 'resolved'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                  filter === status
                    ? 'bg-primary dark:bg-accent text-white dark:text-ink'
                    : 'bg-card dark:bg-asphalt-light border border-border dark:border-white/10 hover:border-primary dark:hover:border-white/40'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)} ({statusCounts[status]})
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-card dark:bg-asphalt-light rounded-lg border border-border dark:border-white/10 p-5 animate-pulse">
                <div className="h-4 bg-muted dark:bg-white/10 rounded w-1/3 mb-2" />
                <div className="h-6 bg-muted dark:bg-white/10 rounded w-1/2 mb-2" />
                <div className="h-4 bg-muted dark:bg-white/10 rounded w-1/4" />
              </div>
            ))}
          </div>
        )}

        {!loading && filteredReports.length === 0 && (
          <EmptyState
            icon={({ className }) => (
              <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            )}
            title="No reports found"
            description={search ? 'No reports match your search.' : 'You haven\'t submitted any reports yet.'}
          />
        )}

        {!loading && filteredReports.length > 0 && (
          <div className="space-y-3">
            {filteredReports.map((report) => (
              <ReportCard
                key={report.id}
                report={report}
                onClick={() => navigate(`/citizen/reports/${report.report_id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </CitizenDashboardLayout>
  );
}
