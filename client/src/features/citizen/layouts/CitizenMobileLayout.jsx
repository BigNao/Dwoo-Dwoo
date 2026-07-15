import React from 'react';
import { useTheme } from '../../../context/ThemeContext';
import DashboardHeader from '../components/DashboardHeader';
import BottomNavigation from '../components/BottomNavigation';

export default function CitizenMobileLayout({ children, title, breadcrumb }) {
  const { theme } = useTheme();

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className="min-h-screen bg-background dark:bg-asphalt dark:text-white text-ink">
        <DashboardHeader title={title} breadcrumb={breadcrumb} />
        <main className="p-4 pb-20">
          {children}
        </main>
        <BottomNavigation />
      </div>
    </div>
  );
}
