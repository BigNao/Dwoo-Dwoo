import React from 'react';
import CitizenDashboardLayout from '../layouts/CitizenDashboardLayout';
import DashboardReportForm from './DashboardReportForm';

export default function NewReportPage() {
  return (
    <CitizenDashboardLayout title="New Report">
      <DashboardReportForm />
    </CitizenDashboardLayout>
  );
}
