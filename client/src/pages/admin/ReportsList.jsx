import React, { useEffect, useMemo, useState } from "react";
import Papa from "papaparse";
import StatusBadge from "../../components/StatusBadge.jsx";
import api from "../../utils/api.js";
import { INCIDENT_CATEGORIES, REPORT_STATUSES, STATUS_LABELS } from "../../utils/constants.js";
import ReportManagementPanel from "./ReportManagementPanel.jsx";

const PAGE_SIZE = 20;

const COLUMNS = [
  { key: "reference_number", label: "Reference No." },
  { key: "incident_type", label: "Incident Type" },
  { key: "user", label: "User" },
  { key: "location", label: "Location" },
  { key: "status", label: "Status" },
  { key: "confidence_score", label: "Confidence Score" },
  { key: "timestamp", label: "Submitted At" },
];

function timestampMillis(ts) {
  if (!ts) return 0;
  const seconds = ts._seconds ?? ts.seconds;
  return seconds ? seconds * 1000 : 0;
}

function formatTimestamp(ts) {
  const millis = timestampMillis(ts);
  if (!millis) return "—";
  return new Date(millis).toLocaleString("en-GH", { dateStyle: "medium", timeStyle: "short" });
}

export default function ReportsList() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    incident_type: "",
    status: "",
    dateFrom: "",
    dateTo: "",
    minScore: 0,
    maxScore: 100,
  });

  const [sortKey, setSortKey] = useState("timestamp");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(1);
  const [managingReport, setManagingReport] = useState(null);

  useEffect(() => {
    fetchReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.incident_type, filters.status, filters.dateFrom, filters.dateTo, filters.minScore, filters.maxScore]);

  async function fetchReports() {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (filters.incident_type) params.incident_type = filters.incident_type;
      if (filters.status) params.status = filters.status;
      if (filters.dateFrom) params.dateFrom = filters.dateFrom;
      if (filters.dateTo) params.dateTo = filters.dateTo;
      if (filters.minScore > 0) params.minScore = filters.minScore;
      if (filters.maxScore < 100) params.maxScore = filters.maxScore;

      const { data } = await api.get("/reports", { params });
      setReports(data.reports);
      setPage(1);
    } catch (err) {
      console.error("Failed to fetch reports:", err);
      setError("Failed to load reports. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function updateFilter(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  function toggleSort(key) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const sortedReports = useMemo(() => {
    const copy = [...reports];
    copy.sort((a, b) => {
      let av;
      let bv;

      if (sortKey === "timestamp") {
        av = timestampMillis(a.timestamp);
        bv = timestampMillis(b.timestamp);
      } else if (sortKey === "location") {
        av = a.latitude;
        bv = b.latitude;
      } else if (sortKey === "user") {
        av = a.user_display_name;
        bv = b.user_display_name;
      } else {
        av = a[sortKey];
        bv = b[sortKey];
      }

      if (typeof av === "string") av = av.toLowerCase();
      if (typeof bv === "string") bv = bv.toLowerCase();

      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return copy;
  }, [reports, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sortedReports.length / PAGE_SIZE));
  const pageReports = sortedReports.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function exportCsv() {
    const rows = sortedReports.map((r) => ({
      reference_number: r.reference_number,
      incident_type: r.incident_type,
      user: r.user_display_name || (r.submission_type === "anonymous" ? "Anonymous" : r.user_id),
      description: r.description,
      latitude: r.latitude,
      longitude: r.longitude,
      status: r.status,
      confidence_score: r.confidence_score,
      corroboration_flag: r.corroboration_flag,
      admin_notes: r.admin_notes || "",
      submitted_at: formatTimestamp(r.timestamp),
      report_id: r.report_id,
    }));

    const csv = Papa.unparse(rows);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const today = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.download = `kwansodwoo-reports-${today}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="h-screen flex flex-col">
      <header className="flex items-center justify-between px-8 h-16 border-b border-white/10">
        <h1 className="font-display text-xl font-semibold">Reports List</h1>
        <button
          type="button"
          onClick={exportCsv}
          className="px-4 py-2 rounded-sign bg-accent text-ink text-sm font-semibold hover:bg-accent-dark transition-colors"
        >
          Export Filtered Reports
        </button>
      </header>

      <div className="px-8 py-4 border-b border-white/10 flex flex-wrap gap-4 items-end">
        <FilterSelect
          label="Incident type"
          value={filters.incident_type}
          onChange={(v) => updateFilter("incident_type", v)}
          options={[{ value: "", label: "All types" }, ...INCIDENT_CATEGORIES.map((c) => ({ value: c, label: c }))]}
        />

        <FilterSelect
          label="Status"
          value={filters.status}
          onChange={(v) => updateFilter("status", v)}
          options={[
            { value: "", label: "All statuses" },
            ...REPORT_STATUSES.map((s) => ({ value: s, label: STATUS_LABELS[s] })),
          ]}
        />

        <div>
          <label className="block text-xs text-white/50 mb-1">From</label>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => updateFilter("dateFrom", e.target.value)}
            className="rounded-sign bg-asphalt-light border border-white/20 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs text-white/50 mb-1">To</label>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => updateFilter("dateTo", e.target.value)}
            className="rounded-sign bg-asphalt-light border border-white/20 px-3 py-2 text-sm"
          />
        </div>

        <div className="min-w-[220px]">
          <label className="block text-xs text-white/50 mb-1">
            Confidence: {filters.minScore}–{filters.maxScore}
          </label>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="0"
              max="100"
              value={filters.minScore}
              onChange={(e) => updateFilter("minScore", Math.min(Number(e.target.value), filters.maxScore))}
              className="w-full"
            />
            <input
              type="range"
              min="0"
              max="100"
              value={filters.maxScore}
              onChange={(e) => updateFilter("maxScore", Math.max(Number(e.target.value), filters.minScore))}
              className="w-full"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto px-8 py-4">
        {loading && <p className="text-sm text-white/50">Loading reports…</p>}
        {error && <p className="text-sm text-danger">{error}</p>}

        {!loading && !error && (
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="text-left border-b border-white/15">
                {COLUMNS.map((col) => (
                  <th
                    key={col.key}
                    onClick={() => toggleSort(col.key)}
                    className="py-3 pr-4 font-mono text-xs uppercase tracking-wide text-white/60 cursor-pointer select-none"
                  >
                    {col.label} {sortKey === col.key ? (sortDir === "asc" ? "▲" : "▼") : ""}
                  </th>
                ))}
                <th className="py-3 font-mono text-xs uppercase tracking-wide text-white/60">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageReports.map((report) => (
                <tr
                  key={report.report_id}
                  className="border-b border-white/5 hover:bg-asphalt-light cursor-pointer"
                  onClick={() => setManagingReport(report)}
                >
                  <td className="py-3 pr-4 font-mono">{report.reference_number}</td>
                  <td className="py-3 pr-4">{report.incident_type}</td>
                  <td className="py-3 pr-4">
                    <span className={`text-xs font-medium ${report.submission_type === "anonymous" ? "text-white/40" : "text-white"}`}>
                      {report.user_display_name || (report.submission_type === "anonymous" ? "Anonymous" : report.user_id)}
                    </span>
                  </td>
                  <td className="py-3 pr-4 font-mono text-xs">
                    {report.latitude?.toFixed(4)}, {report.longitude?.toFixed(4)}
                  </td>
                  <td className="py-3 pr-4">
                    <StatusBadge status={report.status} />
                  </td>
                  <td className="py-3 pr-4">{report.confidence_score}</td>
                  <td className="py-3 pr-4 text-xs">{formatTimestamp(report.timestamp)}</td>
                  <td className="py-3">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setManagingReport(report);
                      }}
                      className="text-xs font-semibold text-accent hover:text-accent-light"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))}

              {pageReports.length === 0 && (
                <tr>
                  <td colSpan={COLUMNS.length + 1} className="py-10 text-center text-white/40">
                    No reports match these filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <div className="px-8 py-4 border-t border-white/10 flex items-center justify-between text-sm">
        <p className="text-white/50">
          Page {page} of {totalPages} · {sortedReports.length} total reports
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1.5 rounded-sign border border-white/20 disabled:opacity-30"
          >
            Previous
          </button>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="px-3 py-1.5 rounded-sign border border-white/20 disabled:opacity-30"
          >
            Next
          </button>
        </div>
      </div>

      {managingReport && (
        <ReportManagementPanel
          report={managingReport}
          onClose={() => setManagingReport(null)}
          onUpdated={(updated) => {
            setReports((prev) => prev.map((r) => (r.report_id === updated.report_id ? updated : r)));
            setManagingReport(null);
          }}
        />
      )}
    </div>
  );
}

function FilterSelect({ label, value, onChange, options }) {
  return (
    <div>
      <label className="block text-xs text-white/50 mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-sign bg-asphalt-light border border-white/20 px-3 py-2 text-sm min-w-[180px]"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
