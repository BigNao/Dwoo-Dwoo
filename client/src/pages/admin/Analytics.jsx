import React, { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import api from "../../utils/api.js";
import { INCIDENT_MARKER_COLORS, STATUS_LABELS } from "../../utils/constants.js";

const STATUS_CHART_COLORS = {
  pending: "#9CA3AF",
  under_review: "#EAB308",
  verified: "#3B82F6",
  under_investigation: "#F97316",
  resolved: "#1F5C4B",
  rejected: "#B7332A",
};

function toDateInputValue(date) {
  return date.toISOString().slice(0, 10);
}

function timestampMillis(ts) {
  if (!ts) return 0;
  const seconds = ts._seconds ?? ts.seconds;
  return seconds ? seconds * 1000 : 0;
}

export default function Analytics() {
  const [dateFrom, setDateFrom] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return toDateInputValue(d);
  });
  const [dateTo, setDateTo] = useState(() => toDateInputValue(new Date()));

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateFrom, dateTo]);

  async function fetchReports() {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/reports", { params: { dateFrom, dateTo } });
      setReports(data.reports);
    } catch (err) {
      console.error("Failed to load analytics:", err);
      setError("Failed to load analytics data.");
    } finally {
      setLoading(false);
    }
  }

  const summary = useMemo(() => {
    const total = reports.length;
    const verified = reports.filter((r) => r.status === "verified").length;
    const resolved = reports.filter((r) => r.status === "resolved").length;
    const pendingOrReview = reports.filter((r) => ["pending", "under_review"].includes(r.status)).length;
    return { total, verified, resolved, pendingOrReview };
  }, [reports]);

  const byCategory = useMemo(() => {
    const counts = {};
    reports.forEach((r) => {
      counts[r.incident_type] = (counts[r.incident_type] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, [reports]);

  const byDay = useMemo(() => {
    const counts = {};
    reports.forEach((r) => {
      const millis = timestampMillis(r.timestamp);
      if (!millis) return;
      const day = new Date(millis).toISOString().slice(0, 10);
      counts[day] = (counts[day] || 0) + 1;
    });
    return Object.entries(counts)
      .sort(([a], [b]) => (a < b ? -1 : 1))
      .map(([day, count]) => ({ day, count }));
  }, [reports]);

  const byStatus = useMemo(() => {
    const counts = {};
    reports.forEach((r) => {
      counts[r.status] = (counts[r.status] || 0) + 1;
    });
    return Object.entries(counts).map(([status, count]) => ({
      name: STATUS_LABELS[status] || status,
      status,
      value: count,
    }));
  }, [reports]);

  return (
    <div className="h-screen overflow-y-auto">
      <header className="flex items-center justify-between px-8 h-16 border-b border-canvas/10">
        <h1 className="font-display text-xl font-semibold">Analytics</h1>
        <div className="flex items-center gap-3 text-sm">
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="rounded-sign bg-asphalt-light border border-canvas/20 px-3 py-1.5"
          />
          <span className="text-canvas/40">to</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="rounded-sign bg-asphalt-light border border-canvas/20 px-3 py-1.5"
          />
        </div>
      </header>

      <div className="p-8 space-y-8">
        {loading && <p className="text-sm text-canvas/50">Loading analytics…</p>}
        {error && <p className="text-sm text-kente">{error}</p>}

        {!loading && !error && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <SummaryCard label="Total Reports" value={summary.total} accent="bg-gold text-ink" />
              <SummaryCard label="Verified Reports" value={summary.verified} accent="bg-blue-500 text-white" />
              <SummaryCard label="Resolved Reports" value={summary.resolved} accent="bg-forest text-white" />
              <SummaryCard
                label="Pending / Under Review"
                value={summary.pendingOrReview}
                accent="bg-yellow-500 text-ink"
              />
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <ChartCard title="Reports by incident category">
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={byCategory} margin={{ left: 0, right: 16 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff1a" />
                    <XAxis dataKey="name" tick={{ fill: "#FAF7F2", fontSize: 10 }} interval={0} angle={-20} textAnchor="end" height={70} />
                    <YAxis tick={{ fill: "#FAF7F2", fontSize: 11 }} allowDecimals={false} />
                    <Tooltip contentStyle={{ background: "#1C1E21", border: "none", color: "#FAF7F2" }} />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {byCategory.map((entry) => (
                        <Cell key={entry.name} fill={INCIDENT_MARKER_COLORS[entry.name] || "#D4A017"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Reports per day">
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={byDay} margin={{ left: 0, right: 16 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff1a" />
                    <XAxis dataKey="day" tick={{ fill: "#FAF7F2", fontSize: 10 }} />
                    <YAxis tick={{ fill: "#FAF7F2", fontSize: 11 }} allowDecimals={false} />
                    <Tooltip contentStyle={{ background: "#1C1E21", border: "none", color: "#FAF7F2" }} />
                    <Line type="monotone" dataKey="count" stroke="#D4A017" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Reports by status">
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie data={byStatus} dataKey="value" nameKey="name" outerRadius={100} label>
                      {byStatus.map((entry) => (
                        <Cell key={entry.status} fill={STATUS_CHART_COLORS[entry.status] || "#9CA3AF"} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: "#1C1E21", border: "none", color: "#FAF7F2" }} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function SummaryCard({ label, value, accent }) {
  return (
    <div className="rounded-sign bg-asphalt-light p-5">
      <p className="text-xs font-mono uppercase tracking-wide text-canvas/50 mb-3">{label}</p>
      <p className={`inline-flex text-2xl font-display font-semibold px-3 py-1 rounded-sign ${accent}`}>
        {value}
      </p>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="rounded-sign bg-asphalt-light p-5">
      <p className="text-sm font-medium mb-4">{title}</p>
      {children}
    </div>
  );
}
