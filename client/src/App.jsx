import React from "react";
import { Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing.jsx";
import ReportForm from "./pages/ReportForm.jsx";
import TrackReport from "./pages/TrackReport.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import MyReports from "./pages/MyReports.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/report" element={<ReportForm />} />
      <Route path="/track" element={<TrackReport />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/my-reports" element={<MyReports />} />
      <Route
        path="/admin/*"
        element={
          <PrivateRoute>
            <AdminDashboard />
          </PrivateRoute>
        }
      />
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
