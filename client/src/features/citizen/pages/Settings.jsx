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
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="font-semibold mb-4">Notification Preferences</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Push Notifications</p>
                <p className="text-sm text-muted">Receive notifications about your reports</p>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  notifications ? 'bg-primary' : 'bg-muted'
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
                <p className="font-medium">Email Updates</p>
                <p className="text-sm text-muted">Receive email updates about your reports</p>
              </div>
              <button
                onClick={() => setEmailUpdates(!emailUpdates)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  emailUpdates ? 'bg-primary' : 'bg-muted'
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

        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="font-semibold mb-4">Privacy</h3>
          <div className="space-y-4">
            <button className="w-full text-left px-4 py-3 border border-border rounded-lg hover:border-primary transition-colors">
              <p className="font-medium">Privacy Policy</p>
              <p className="text-sm text-muted">View our privacy policy</p>
            </button>
            <button className="w-full text-left px-4 py-3 border border-border rounded-lg hover:border-primary transition-colors">
              <p className="font-medium">Data Management</p>
              <p className="text-sm text-muted">Manage your personal data</p>
            </button>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="font-semibold mb-4">Account</h3>
          <div className="space-y-4">
            <button className="w-full text-left px-4 py-3 border border-border rounded-lg hover:border-primary transition-colors">
              <p className="font-medium">Change Password</p>
              <p className="text-sm text-muted">Update your password</p>
            </button>
            <button
              onClick={logout}
              className="w-full text-left px-4 py-3 border border-red-200 rounded-lg hover:bg-red-50 transition-colors text-red-600"
            >
              <p className="font-medium">Log Out</p>
              <p className="text-sm text-red-400/80">Sign out of your account</p>
            </button>
          </div>
        </div>
      </div>
    </CitizenDashboardLayout>
  );
}
