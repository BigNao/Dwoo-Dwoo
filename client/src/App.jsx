import React, { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing.jsx";
import ReportForm from "./pages/ReportForm.jsx";
import TrackReport from "./pages/TrackReport.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import MyReports from "./pages/MyReports.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminLogin from "./pages/admin/AdminLogin.jsx";
import AdminRoute from "./components/PrivateRoute.jsx";
import CitizenRoute from "./components/CitizenRoute.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";

const CitizenDashboard = lazy(() => import("./features/citizen/pages/Dashboard.jsx"));
const CitizenReports = lazy(() => import("./features/citizen/pages/Reports.jsx"));
const CitizenReportDetails = lazy(() => import("./features/citizen/pages/ReportDetails.jsx"));
const CitizenNotifications = lazy(() => import("./features/citizen/pages/Notifications.jsx"));
const CitizenProfile = lazy(() => import("./features/citizen/pages/Profile.jsx"));
const CitizenSettings = lazy(() => import("./features/citizen/pages/Settings.jsx"));

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/report" element={<ReportForm />} />
      <Route path="/track" element={<TrackReport />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/my-reports" element={<MyReports />} />

      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin/*"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />

      {/* Citizen Routes */}
      <Route
        path="/citizen/*"
        element={
          <CitizenRoute>
            <ThemeProvider>
              <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background">Loading...</div>}>
                <Routes>
                  <Route index element={<CitizenDashboard />} />
                  <Route path="reports" element={<CitizenReports />} />
                  <Route path="reports/:id" element={<CitizenReportDetails />} />
                  <Route path="notifications" element={<CitizenNotifications />} />
                  <Route path="profile" element={<CitizenProfile />} />
                  <Route path="settings" element={<CitizenSettings />} />
                </Routes>
              </Suspense>
            </ThemeProvider>
          </CitizenRoute>
        }
      />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <p className="font-display text-4xl font-semibold mb-2">404</p>
        <p className="text-muted">This page doesn't exist.</p>
      </div>
    </div>
  );
}
