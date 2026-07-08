import React from 'react';
import { useMediaQuery } from '../hooks/useMediaQuery';
import CitizenDesktopLayout from './CitizenDesktopLayout';
import CitizenMobileLayout from './CitizenMobileLayout';
import { BREAKPOINTS } from '../constants/breakpoints';

export default function CitizenDashboardLayout({ children, title, breadcrumb }) {
  const isDesktop = useMediaQuery(`(min-width: ${BREAKPOINTS.DESKTOP}px)`);

  if (isDesktop) {
    return (
      <CitizenDesktopLayout title={title} breadcrumb={breadcrumb}>
        <div className="fade-in">{children}</div>
      </CitizenDesktopLayout>
    );
  }

  return (
    <CitizenMobileLayout title={title} breadcrumb={breadcrumb}>
      <div className="fade-in">{children}</div>
    </CitizenMobileLayout>
  );
}
