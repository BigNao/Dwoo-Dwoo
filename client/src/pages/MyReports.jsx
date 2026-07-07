import React, { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { Navigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { db } from "../firebase.js";

function formatDate(ts) {
  if (!ts) return "—";
  const date = ts.toDate ? ts.toDate() : new Date(ts.seconds * 1000);
  return date.toLocaleDateString("en-GH", { dateStyle: "medium" });
}

export default function MyReports() {
  const { currentUser, loading: authLoading } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (!currentUser) return undefined;

    const q = query(
      collection(db, "reports"),
      where("user_id", "==", currentUser.uid),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setReports(snapshot.docs.map((doc) => doc.data()));
      setLoading(false);
    });

    return unsubscribe;
  }, [currentUser]);

  if (!authLoading && !currentUser) {
    return <Navigate to="/login" state={{ from: "/my-reports" }} replace />;
  }

  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
        <h1 className="font-display text-3xl font-semibold mb-8">My Reports</h1>

        {loading && <p className="text-sm text-ink/50">Loading your reports…</p>}

        {!loading && reports.length === 0 && (
          <div className="rounded-sign border border-dashed border-ink/20 p-10 text-center">
            <p className="text-ink/60">You haven't submitted any reports yet.</p>
          </div>
        )}

        <div className="space-y-3">
          {reports.map((report) => (
            <button
              key={report.report_id}
              onClick={() => setSelected(report)}
              className="w-full text-left rounded-sign border border-ink/15 p-5 hover:border-ink/30 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-mono text-ink/50 mb-1">{report.reference_number}</p>
                  <p className="font-display font-semibold">{report.incident_type}</p>
                  <p className="text-xs text-ink/50 mt-1">{formatDate(report.timestamp)}</p>
                </div>
                <StatusBadge status={report.status} />
              </div>
            </button>
          ))}
        </div>
      </main>

      <Footer />

      {selected && <ReportDetailModal report={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function ReportDetailModal({ report, onClose }) {
  return (
    <div className="fixed inset-0 bg-ink/50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div
        className="bg-canvas rounded-sign max-w-lg w-full p-6 max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs font-mono text-ink/50 mb-1">{report.reference_number}</p>
            <h2 className="font-display text-xl font-semibold">{report.incident_type}</h2>
          </div>
          <StatusBadge status={report.status} />
        </div>

        {report.photo_url && (
          <img
            src={report.photo_url}
            alt="Reported incident"
            className="w-full h-48 object-cover rounded-sign mb-4"
          />
        )}

        <p className="text-sm text-ink/80 leading-relaxed mb-4">{report.description}</p>

        <dl className="grid grid-cols-2 gap-4 text-sm border-t border-ink/10 pt-4 mb-4">
          <div>
            <dt className="text-xs text-ink/50 uppercase tracking-wide mb-1">Submitted</dt>
            <dd className="font-mono">{formatDate(report.timestamp)}</dd>
          </div>
          <div>
            <dt className="text-xs text-ink/50 uppercase tracking-wide mb-1">Confidence</dt>
            <dd className="font-mono">{report.confidence_score}/100</dd>
          </div>
        </dl>

        {report.admin_notes && (
          <div className="mb-4 pt-4 border-t border-ink/10">
            <dt className="text-xs text-ink/50 uppercase tracking-wide mb-1">Note from officials</dt>
            <dd className="text-sm">{report.admin_notes}</dd>
          </div>
        )}

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 rounded-sign border border-ink/20 font-medium hover:bg-ink/5 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}
