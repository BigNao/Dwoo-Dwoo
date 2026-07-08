import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import CitizenDashboardLayout from '../layouts/CitizenDashboardLayout';

export default function Profile() {
  const { userProfile, currentUser } = useAuth();

  return (
    <CitizenDashboardLayout title="Profile">
      <div className="max-w-2xl space-y-6">
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center gap-6 mb-6">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-3xl font-bold text-primary">
                {userProfile?.display_name?.charAt(0) || 'U'}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-semibold">{userProfile?.display_name || 'Citizen'}</h2>
              <p className="text-muted">{userProfile?.email_address}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <input
                type="text"
                defaultValue={userProfile?.display_name || ''}
                className="w-full px-4 py-2 border border-border rounded-lg bg-card focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email Address</label>
              <input
                type="email"
                value={currentUser?.email || ''}
                disabled
                className="w-full px-4 py-2 border border-border rounded-lg bg-muted/30 text-muted cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Role</label>
              <input
                type="text"
                value={userProfile?.role || 'citizen'}
                disabled
                className="w-full px-4 py-2 border border-border rounded-lg bg-muted/30 text-muted cursor-not-allowed capitalize"
              />
            </div>

            <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors">
              Save Changes
            </button>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="font-semibold mb-4">Account Statistics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted mb-1">Reports Submitted</p>
              <p className="text-2xl font-semibold">{userProfile?.report_count || 0}</p>
            </div>
            <div>
              <p className="text-sm text-muted mb-1">Member Since</p>
              <p className="text-2xl font-semibold">
                {userProfile?.registration_timestamp
                  ? new Date(userProfile.registration_timestamp.seconds * 1000).getFullYear()
                  : '—'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </CitizenDashboardLayout>
  );
}
