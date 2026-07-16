import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import CitizenDashboardLayout from '../layouts/CitizenDashboardLayout';
import StatisticCard from '../components/StatisticCard';
import QuickActionCard from '../components/QuickActionCard';
import ReportCard from '../components/ReportCard';
import EmptyState from '../components/EmptyState';
import FloatingReportButton from '../components/FloatingReportButton';
import NearbyIncidentsMap from '../components/NearbyIncidentsMap';
import { useCitizenReports } from '../hooks/useCitizenReports';
import DashboardReportForm from './DashboardReportForm';

export default function Dashboard() {
  const { userProfile } = useAuth();
  const { reports, stats, loading, error } = useCitizenReports();
  const navigate = useNavigate();
  const [showReportForm, setShowReportForm] = useState(false);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const quickActions = [
    {
      icon: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
      label: 'Report New Incident',
      description: 'Submit a new crime report',
      onClick: () => setShowReportForm(true),
    },
    {
      icon: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      label: 'Track Existing Report',
      description: 'Check report status',
      to: '/track',
    },
    {
      icon: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      label: 'View My Reports',
      description: 'See all your submissions',
      to: '/citizen/reports',
    },
  ];

  if (error) {
    return (
      <CitizenDashboardLayout title="Dashboard">
        <div className="text-center py-12">
          <p className="text-danger mb-4">Failed to load your reports</p>
          <p className="text-muted dark:text-white/60 text-sm mb-4">Please refresh the page or try again later</p>
        </div>
      </CitizenDashboardLayout>
    );
  }

  return (
    <CitizenDashboardLayout title="Dashboard">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-1 text-ink dark:text-white">
            {getGreeting()}, {userProfile?.display_name?.split(' ')?.[0] || 'Citizen'}
          </h2>
          <p className="text-muted dark:text-white/60">Stay informed about road safety reports around you</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatisticCard label="Total Reports" value={stats.total} />
          <StatisticCard label="Pending" value={stats.pending} />
          <StatisticCard label="Verified" value={stats.verified} />
          <StatisticCard label="Resolved" value={stats.resolved} />
        </div>

        <div>
          <h3 className="font-semibold mb-4 text-ink dark:text-white">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <div key={action.label}>
                {action.to ? (
                  <Link to={action.to}>
                    <QuickActionCard
                      icon={action.icon}
                      label={action.label}
                      description={action.description}
                      accent={index === 0}
                    />
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={action.onClick}
                    className="w-full text-left"
                  >
                    <QuickActionCard
                      icon={action.icon}
                      label={action.label}
                      description={action.description}
                      accent={index === 0}
                    />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-4 text-ink dark:text-white">Emergency Contacts</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              type="button"
              onClick={() => window.location.href = 'tel:191'}
              className="bg-card dark:bg-asphalt-light rounded-lg border border-border dark:border-white/10 p-4 text-left hover:border-danger hover:shadow-md transition-all"
            >
              <p className="font-medium text-danger dark:text-red-400">Police</p>
              <p className="text-2xl font-bold text-ink dark:text-white">191</p>
            </button>
            <button
              type="button"
              onClick={() => window.location.href = 'tel:193'}
              className="bg-card dark:bg-asphalt-light rounded-lg border border-border dark:border-white/10 p-4 text-left hover:border-danger hover:shadow-md transition-all"
            >
              <p className="font-medium text-danger dark:text-red-400">Ambulance</p>
              <p className="text-2xl font-bold text-ink dark:text-white">193</p>
            </button>
            <button
              type="button"
              onClick={() => window.location.href = 'tel:192'}
              className="bg-card dark:bg-asphalt-light rounded-lg border border-border dark:border-white/10 p-4 text-left hover:border-danger hover:shadow-md transition-all"
            >
              <p className="font-medium text-danger dark:text-red-400">Fire</p>
              <p className="text-2xl font-bold text-ink dark:text-white">192</p>
            </button>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-ink dark:text-white">Recent Reports</h3>
            <Link to="/citizen/reports" className="text-sm text-primary dark:text-accent hover:underline">
              View all
            </Link>
          </div>

          {loading && (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-card dark:bg-asphalt-light rounded-lg border border-border dark:border-white/10 p-5 animate-pulse">
                  <div className="h-4 bg-muted dark:bg-white/10 rounded w-1/3 mb-2" />
                  <div className="h-6 bg-muted dark:bg-white/10 rounded w-1/2 mb-2" />
                  <div className="h-4 bg-muted dark:bg-white/10 rounded w-1/4" />
                </div>
              ))}
            </div>
          )}

          {!loading && reports.length === 0 && (
            <EmptyState
              icon={({ className }) => (
                <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              )}
              title="No reports yet"
              description="You haven't submitted any reports. Start by reporting an incident."
              action={
                <button
                  type="button"
                  onClick={() => setShowReportForm(true)}
                  className="inline-flex items-center px-4 py-2 bg-primary dark:bg-accent text-white dark:text-ink rounded-lg hover:bg-primary-hover dark:hover:bg-accent-dark transition-colors"
                >
                  Create your first report
                </button>
              }
            />
          )}

          {!loading && reports.length > 0 && (
            <div className="space-y-3">
              {reports.slice(0, 5).map((report) => (
                <ReportCard
                  key={report.id}
                  report={report}
                  onClick={() => navigate(`/citizen/reports/${report.id}`)}
                />
              ))}
            </div>
          )}
        </div>

        {!loading && reports.length > 0 && (
          <NearbyIncidentsMap incidents={reports} />
        )}
      </div>

      {showReportForm && (
        <div className="fixed inset-0 bg-background/80 dark:bg-black/60 backdrop-blur-sm z-50 overflow-y-auto">
          <div className="min-h-screen px-4 py-8">
            <div className="max-w-2xl mx-auto bg-card dark:bg-asphalt-light rounded-lg border border-border dark:border-white/10 p-6 sm:p-8">
              <button
                type="button"
                onClick={() => setShowReportForm(false)}
                className="flex items-center gap-1 text-sm text-muted dark:text-white/60 hover:text-ink dark:hover:text-white transition-colors mb-6"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancel
              </button>
              <DashboardReportForm />
            </div>
          </div>
        </div>
      )}

      <FloatingReportButton onClick={() => setShowReportForm(true)} />
    </CitizenDashboardLayout>
  );
}
