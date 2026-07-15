import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import CitizenDashboardLayout from '../layouts/CitizenDashboardLayout';

export default function Settings() {
  const { logout } = useAuth();
  const [notifications, setNotifications] = React.useState(true);
  const [emailUpdates, setEmailUpdates] = React.useState(true);

  return (
    <CitizenDashboardLayout title="Settings">
      <div className="max-w-2xl space-y-6">
        <div className="bg-card dark:bg-asphalt-light rounded-lg border border-border dark:border-white/10 p-6">
          <h3 className="font-semibold mb-4 text-ink dark:text-white">Notification Preferences</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-ink dark:text-white">Push Notifications</p>
                <p className="text-sm text-muted dark:text-white/60">Receive notifications about your reports</p>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  notifications ? 'bg-primary dark:bg-accent' : 'bg-muted dark:bg-white/20'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    notifications ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-ink dark:text-white">Email Updates</p>
                <p className="text-sm text-muted dark:text-white/60">Receive email updates about your reports</p>
              </div>
              <button
                onClick={() => setEmailUpdates(!emailUpdates)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  emailUpdates ? 'bg-primary dark:bg-accent' : 'bg-muted dark:bg-white/20'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    emailUpdates ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-card dark:bg-asphalt-light rounded-lg border border-border dark:border-white/10 p-6">
          <h3 className="font-semibold mb-4 text-ink dark:text-white">Privacy</h3>
          <div className="space-y-4">
            <button className="w-full text-left px-4 py-3 border border-border dark:border-white/10 rounded-lg hover:border-primary dark:hover:border-white/40 transition-colors">
              <p className="font-medium text-ink dark:text-white">Privacy Policy</p>
              <p className="text-sm text-muted dark:text-white/60">View our privacy policy</p>
            </button>
            <button className="w-full text-left px-4 py-3 border border-border dark:border-white/10 rounded-lg hover:border-primary dark:hover:border-white/40 transition-colors">
              <p className="font-medium text-ink dark:text-white">Data Management</p>
              <p className="text-sm text-muted dark:text-white/60">Manage your personal data</p>
            </button>
          </div>
        </div>

        <div className="bg-card dark:bg-asphalt-light rounded-lg border border-border dark:border-white/10 p-6">
          <h3 className="font-semibold mb-4 text-ink dark:text-white">Account</h3>
          <div className="space-y-4">
            <button className="w-full text-left px-4 py-3 border border-border dark:border-white/10 rounded-lg hover:border-primary dark:hover:border-white/40 transition-colors">
              <p className="font-medium text-ink dark:text-white">Change Password</p>
              <p className="text-sm text-muted dark:text-white/60">Update your password</p>
            </button>
            <button
              onClick={logout}
              className="w-full text-left px-4 py-3 border border-red-200 dark:border-red-800/50 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-600 dark:text-red-400"
            >
              <p className="font-medium text-red-600 dark:text-red-400">Log Out</p>
              <p className="text-sm text-red-400/80 dark:text-red-400/60">Sign out of your account</p>
            </button>
          </div>
        </div>
      </div>
    </CitizenDashboardLayout>
  );
}
