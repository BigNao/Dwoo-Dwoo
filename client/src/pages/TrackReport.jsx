import React, { useState } from "react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import api from "../utils/api.js";

function formatTimestamp(ts) {
  if (!ts) return "—";
  // Firestore Timestamp arrives over REST as { _seconds, _nanoseconds }
  const seconds = ts._seconds ?? ts.seconds;
  if (!seconds) return "—";
  return new Date(seconds * 1000).toLocaleString("en-GH", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function TrackReport() {
  const [referenceNumber, setReferenceNumber] = useState("");
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setReport(null);

    const trimmed = referenceNumber.trim().toUpperCase();
    if (!trimmed) {
      setError("Enter your reference number.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.get(`/reports/track/${encodeURIComponent(trimmed)}`);
      setReport(data);
    } catch (err) {
      if (err.response?.status === 404) {
        setError("No report found for that reference number. Double-check and try again.");
      } else {
        setError("Something went wrong looking up your report. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-lg mx-auto px-4 sm:px-6 py-14">
        <h1 className="font-display text-3xl font-semibold mb-2">Track My Report</h1>
        <p className="text-sm text-muted mb-8">
          Enter the reference number you received when you submitted your report.
        </p>

        <form onSubmit={handleSubmit} className="flex gap-2 mb-8">
          <input
            type="text"
            value={referenceNumber}
            onChange={(e) => setReferenceNumber(e.target.value)}
            placeholder="KD-XXXXXXXX"
            className="flex-1 rounded-sign border border-border px-4 py-3 font-mono uppercase tracking-wide bg-card focus:border-primary"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-sign bg-primary text-white font-semibold hover:bg-primary-hover transition-colors disabled:opacity-50"
          >
            {loading ? "Searching…" : "Track"}
          </button>
        </form>

        {error && (
          <p className="text-sm text-danger font-medium mb-6" role="alert">
            {error}
          </p>
        )}

        {report && (
          <div className="rounded-sign border border-border p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs font-mono uppercase tracking-wide text-muted/80 mb-1">
                  {report.reference_number}
                </p>
                <h2 className="font-display text-xl font-semibold">{report.incident_type}</h2>
              </div>
              <StatusBadge status={report.status} />
            </div>

            <p className="text-sm text-ink/80 leading-relaxed mb-4">{report.description}</p>

            <dl className="grid grid-cols-2 gap-4 text-sm border-t border-border pt-4">
              <div>
                <dt className="text-xs text-muted/80 uppercase tracking-wide mb-1">Submitted</dt>
                <dd className="font-mono">{formatTimestamp(report.timestamp)}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted/80 uppercase tracking-wide mb-1">Last updated</dt>
                <dd className="font-mono">{formatTimestamp(report.last_updated)}</dd>
              </div>
            </dl>

            {report.admin_notes && (
              <div className="mt-4 pt-4 border-t border-border">
                <dt className="text-xs text-muted/80 uppercase tracking-wide mb-1">Note from officials</dt>
                <dd className="text-sm">{report.admin_notes}</dd>
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
