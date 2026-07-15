import React from 'react';
import Sidebar from '../components/Sidebar';
import DashboardHeader from '../components/DashboardHeader';

export default function CitizenDesktopLayout({ children, title, breadcrumb }) {
  return (
    <div className="min-h-screen bg-background dark:bg-asphalt dark:text-white text-ink flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader title={title} breadcrumb={breadcrumb} />
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
