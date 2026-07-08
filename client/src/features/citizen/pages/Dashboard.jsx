import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import CitizenDashboardLayout from '../layouts/CitizenDashboardLayout';
import StatisticCard from '../components/StatisticCard';
import QuickActionCard from '../components/QuickActionCard';
import ReportCard from '../components/ReportCard';
import EmptyState from '../components/EmptyState';
import FloatingReportButton from '../components/FloatingReportButton';
import NearbyIncidentsMap from '../components/NearbyIncidentsMap';
import { useCitizenReports } from '../hooks/useCitizenReports';

export default function Dashboard() {
  const { userProfile } = useAuth();
  const { reports, stats, loading, error } = useCitizenReports();

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
      to: '/report',
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
          <p className="text-muted text-sm mb-4">Please refresh the page or try again later</p>
        </div>
      </CitizenDashboardLayout>
    );
  }

  return (
    <CitizenDashboardLayout title="Dashboard">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-1">
            {getGreeting()}, {userProfile?.display_name?.split(' ')?.[0] || 'Citizen'}
          </h2>
          <p className="text-muted">Stay informed about road safety reports around you</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatisticCard label="Total Reports" value={stats.total} />
          <StatisticCard label="Pending" value={stats.pending} />
          <StatisticCard label="Verified" value={stats.verified} />
          <StatisticCard label="Resolved" value={stats.resolved} />
        </div>

        <div>
          <h3 className="font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action) => (
              <Link key={action.label} to={action.to}>
                <QuickActionCard
                  icon={action.icon}
                  label={action.label}
                  description={action.description}
                />
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-4">Emergency Contacts</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-card rounded-lg border border-border p-4">
              <p className="font-medium text-danger">Police</p>
              <p className="text-2xl font-bold">191</p>
            </div>
            <div className="bg-card rounded-lg border border-border p-4">
              <p className="font-medium text-danger">Ambulance</p>
              <p className="text-2xl font-bold">193</p>
            </div>
            <div className="bg-card rounded-lg border border-border p-4">
              <p className="font-medium text-danger">Fire</p>
              <p className="text-2xl font-bold">192</p>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Recent Reports</h3>
            <Link to="/citizen/reports" className="text-sm text-primary hover:underline">
              View all
            </Link>
          </div>

          {loading && (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-card rounded-lg border border-border p-5 animate-pulse">
                  <div className="h-4 bg-muted rounded w-1/3 mb-2" />
                  <div className="h-6 bg-muted rounded w-1/2 mb-2" />
                  <div className="h-4 bg-muted rounded w-1/4" />
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
                <Link
                  to="/report"
                  className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
                >
                  Create your first report
                </Link>
              }
            />
          )}

          {!loading && reports.length > 0 && (
            <div className="space-y-3">
              {reports.slice(0, 5).map((report) => (
                <ReportCard key={report.id} report={report} />
              ))}
            </div>
          )}
        </div>

        {!loading && reports.length > 0 && (
          <NearbyIncidentsMap incidents={reports} />
        )}
      </div>

      <FloatingReportButton />
    </CitizenDashboardLayout>
  );
}
