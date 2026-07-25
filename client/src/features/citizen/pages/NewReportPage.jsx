import React from 'react';
import { useNavigate } from 'react-router-dom';
import CitizenDashboardLayout from '../layouts/CitizenDashboardLayout';
import DashboardReportForm from './DashboardReportForm';

export default function NewReportPage() {
  const navigate = useNavigate();
  return (
    <CitizenDashboardLayout title="New Report">
      <DashboardReportForm onClose={() => navigate('/citizen')} />
    </CitizenDashboardLayout>
  );
}
