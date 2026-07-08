import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { citizenService } from '../services/citizenService';
import CitizenDashboardLayout from '../layouts/CitizenDashboardLayout';
import StatusBadge from '../../../components/StatusBadge';

export default function ReportDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchReport() {
      try {
        const data = await citizenService.getReportDetails(id);
        setReport(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchReport();
  }, [id]);

  const formatDate = (ts) => {
    if (!ts) return '—';
    const date = ts.toDate ? ts.toDate() : new Date(ts.seconds * 1000);
    return date.toLocaleDateString('en-GH', { dateStyle: 'full' });
  };

  if (loading) {
    return (
      <CitizenDashboardLayout title="Report Details">
        <div className="space-y-4">
          <div className="bg-card rounded-lg border border-border p-6 animate-pulse">
            <div className="h-4 bg-muted rounded w-1/3 mb-4" />
            <div className="h-8 bg-muted rounded w-1/2 mb-4" />
            <div className="h-48 bg-muted rounded mb-4" />
            <div className="h-4 bg-muted rounded w-full mb-2" />
            <div className="h-4 bg-muted rounded w-3/4" />
          </div>
        </div>
      </CitizenDashboardLayout>
    );
  }

  if (error || !report) {
    return (
      <CitizenDashboardLayout title="Report Details">
        <div className="text-center py-12">
          <p className="text-danger mb-4">Report not found</p>
          <p className="text-muted text-sm mb-4">The report you're looking for doesn't exist or you don't have permission to view it.</p>
          <button
            onClick={() => navigate('/citizen/reports')}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
          >
            Back to Reports
          </button>
        </div>
      </CitizenDashboardLayout>
    );
  }

  return (
    <CitizenDashboardLayout
      title="Report Details"
      breadcrumb={[
        { label: 'Reports', href: '/citizen/reports' },
        { label: report.reference_number },
      ]}
    >
      <div className="max-w-3xl space-y-6">
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs font-mono text-muted mb-1">{report.reference_number}</p>
              <h2 className="text-2xl font-semibold">{report.incident_type}</h2>
            </div>
            <StatusBadge status={report.status} />
          </div>

          {report.photo_url && (
            <img
              src={report.photo_url}
              alt="Reported incident"
              className="w-full h-48 sm:h-64 object-cover rounded-lg mb-4"
            />
          )}

          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Description</h3>
              <p className="text-muted leading-relaxed">{report.description}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border">
              <div>
                <p className="text-xs text-muted uppercase tracking-wide mb-1">Submitted</p>
                <p className="font-medium">{formatDate(report.timestamp)}</p>
              </div>
              <div>
                <p className="text-xs text-muted uppercase tracking-wide mb-1">Confidence Score</p>
                <p className="font-medium">{report.confidence_score}/100</p>
              </div>
              <div>
                <p className="text-xs text-muted uppercase tracking-wide mb-1">Location</p>
                <p className="font-medium">
                  {report.location?.latitude && report.location?.longitude
                    ? `${report.location.latitude.toFixed(4)}, ${report.location.longitude.toFixed(4)}`
                    : 'Not specified'}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted uppercase tracking-wide mb-1">Status</p>
                <StatusBadge status={report.status} />
              </div>
            </div>

            {report.admin_notes && (
              <div className="pt-4 border-t border-border">
                <h3 className="font-medium mb-2">Note from Officials</h3>
                <p className="text-muted bg-muted/20 p-4 rounded-lg">{report.admin_notes}</p>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => navigate('/citizen/reports')}
          className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
        >
          Back to Reports
        </button>
      </div>
    </CitizenDashboardLayout>
  );
}
