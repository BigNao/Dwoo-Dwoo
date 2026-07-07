import React, { useEffect, useState } from "react";
import ConfidenceBar from "../../components/ConfidenceBar.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";
import api from "../../utils/api.js";
import { REPORT_STATUSES, STATUS_LABELS } from "../../utils/constants.js";

function formatTimestamp(ts) {
  if (!ts) return "—";
  const seconds = ts._seconds ?? ts.seconds;
  if (!seconds) return "—";
  return new Date(seconds * 1000).toLocaleString("en-GH", { dateStyle: "medium", timeStyle: "short" });
}

export default function ReportManagementPanel({ report, onClose, onUpdated }) {
  const [status, setStatus] = useState(report.status);
  const [adminNotes, setAdminNotes] = useState(report.admin_notes || "");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [logs, setLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(true);
  const [photoExpanded, setPhotoExpanded] = useState(false);

  useEffect(() => {
    setStatus(report.status);
    setAdminNotes(report.admin_notes || "");
  }, [report.report_id]);

  useEffect(() => {
    let cancelled = false;
    setLogsLoading(true);

    api
      .get(`/reports/${report.report_id}/logs`)
      .then(({ data }) => {
        if (!cancelled) setLogs(data.logs);
      })
      .catch((err) => console.error("Failed to load audit trail:", err))
      .finally(() => {
        if (!cancelled) setLogsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [report.report_id]);

  async function handleSave() {
    setSaving(true);
    setSaveError("");
    try {
      const { data } = await api.patch(`/reports/${report.report_id}`, {
        status,
        admin_notes: adminNotes,
      });
      onUpdated?.(data);
    } catch (err) {
      console.error("Failed to save report:", err);
      setSaveError(err.response?.data?.message || "Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-ink/40" onClick={onClose}>
      <div
        className="h-full w-full max-w-md bg-canvas text-ink overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-canvas border-b border-ink/10 px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-mono text-ink/50">{report.reference_number}</p>
            <h2 className="font-display text-lg font-semibold">{report.incident_type}</h2>
          </div>
          <button type="button" onClick={onClose} className="text-2xl leading-none text-ink/40 hover:text-ink">
            ×
          </button>
        </div>

        <div className="px-6 py-5 space-y-6">
          <div className="flex items-center gap-3">
            <StatusBadge status={report.status} />
            {report.corroboration_flag && (
              <span className="sign-badge text-forest bg-green-100">Corroborated</span>
            )}
          </div>

          <div>
            <p className="text-xs font-mono uppercase tracking-wide text-ink/50 mb-1">Description</p>
            <p className="text-sm leading-relaxed">{report.description}</p>
          </div>

          <ConfidenceBar score={report.confidence_score} />

          {report.photo_url && (
            <div>
              <p className="text-xs font-mono uppercase tracking-wide text-ink/50 mb-2">Photo</p>
              <img
                src={report.photo_url}
                alt="Reported incident"
                onClick={() => setPhotoExpanded(true)}
                className="w-full h-40 object-cover rounded-sign cursor-zoom-in"
              />
            </div>
          )}

          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-xs text-ink/50 uppercase tracking-wide mb-1">Location</dt>
              <dd className="font-mono text-xs">
                {report.latitude?.toFixed(5)}, {report.longitude?.toFixed(5)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-ink/50 uppercase tracking-wide mb-1">Submitted</dt>
              <dd className="font-mono text-xs">{formatTimestamp(report.timestamp)}</dd>
            </div>
          </dl>

          <div className="border-t border-ink/10 pt-5">
            <label className="block text-sm font-medium mb-2">Update status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-sign border border-ink/20 px-4 py-2.5 bg-white"
            >
              {REPORT_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Admin notes</label>
            <textarea
              rows={4}
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Visible to the citizen who submitted this report…"
              className="w-full rounded-sign border border-ink/20 px-4 py-3 bg-white resize-none"
            />
          </div>

          {saveError && <p className="text-sm text-kente font-medium">{saveError}</p>}

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="w-full py-3 rounded-sign bg-ink text-canvas font-semibold hover:bg-ink/80 transition-colors disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>

          <div className="border-t border-ink/10 pt-5">
            <p className="text-xs font-mono uppercase tracking-wide text-ink/50 mb-3">Audit trail</p>

            {logsLoading && <p className="text-sm text-ink/40">Loading history…</p>}

            {!logsLoading && logs.length === 0 && (
              <p className="text-sm text-ink/40">No status changes recorded yet.</p>
            )}

            <ul className="space-y-3">
              {logs.map((log) => (
                <li key={log.log_id} className="text-sm border-l-2 border-gold pl-3">
                  <p className="font-medium">
                    {STATUS_LABELS[log.previous_status] || log.previous_status} →{" "}
                    {STATUS_LABELS[log.new_status] || log.new_status}
                  </p>
                  <p className="text-xs text-ink/50">{formatTimestamp(log.action_timestamp)}</p>
                  {log.admin_notes && <p className="text-xs text-ink/70 mt-1">{log.admin_notes}</p>}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {photoExpanded && report.photo_url && (
        <div
          className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center p-6"
          onClick={() => setPhotoExpanded(false)}
        >
          <img src={report.photo_url} alt="Reported incident, full size" className="max-h-full max-w-full rounded-sign" />
        </div>
      )}
    </div>
  );
}
