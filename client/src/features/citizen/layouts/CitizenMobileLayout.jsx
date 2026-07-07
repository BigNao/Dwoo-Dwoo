import React from 'react';
import DashboardHeader from '../components/DashboardHeader';
import BottomNavigation from '../components/BottomNavigation';

export default function CitizenMobileLayout({ children, title, breadcrumb }) {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader title={title} breadcrumb={breadcrumb} />
      <main className="p-4 pb-20">
        {children}
      </main>
      <BottomNavigation />
    </div>
  );
}
