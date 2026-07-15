import React, { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";
import { db } from "../../firebase.js";
import { INCIDENT_MARKER_COLORS, STATUS_LABELS } from "../../utils/constants.js";
import ReportManagementPanel from "./ReportManagementPanel.jsx";

const GHANA_CENTER = [7.9465, -1.0232];

function formatTimestamp(ts) {
  if (!ts) return "—";
  const date = ts.toDate ? ts.toDate() : new Date(ts.seconds * 1000);
  return date.toLocaleString("en-GH", { dateStyle: "medium", timeStyle: "short" });
}

export default function LiveMap() {
  const [reports, setReports] = useState([]);
  const [managingReport, setManagingReport] = useState(null);

  useEffect(() => {
    const q = query(collection(db, "reports"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setReports(snapshot.docs.map((doc) => doc.data()));
    });
    return unsubscribe;
  }, []);

  const validReports = reports.filter(
    (r) => r.latitude != null && r.longitude != null && !Number.isNaN(r.latitude) && !Number.isNaN(r.longitude)
  );
  const skippedCount = reports.length - validReports.length;

  return (
    <div className="h-screen flex flex-col">
      <header className="h-16 flex items-center px-8 border-b border-white/10">
        <h1 className="font-display text-xl font-semibold">Live Map</h1>
        <span className="ml-3 text-xs font-mono text-white/50">
          {validReports.length} report{validReports.length === 1 ? "" : "s"} with location
          {skippedCount > 0 && (
            <span className="text-danger ml-2">
              · {skippedCount} without coordinates
            </span>
          )}
          · updating in real time
        </span>
      </header>

      <div className="flex-1">
        <MapContainer center={GHANA_CENTER} zoom={7} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {validReports.map((report) => (
            <CircleMarker
              key={report.report_id}
              center={[report.latitude, report.longitude]}
              radius={9}
              pathOptions={{
                color: INCIDENT_MARKER_COLORS[report.incident_type] || "#374151",
                fillColor: INCIDENT_MARKER_COLORS[report.incident_type] || "#374151",
                fillOpacity: 0.85,
                weight: 2,
              }}
            >
              <Popup>
                <div className="text-sm space-y-1 min-w-[180px]">
                  <p className="font-semibold">{report.incident_type}</p>
                  <p className="text-xs">{STATUS_LABELS[report.status] || report.status}</p>
                  <p className="text-xs">Confidence: {report.confidence_score}/100</p>
                  <p className="text-xs">{formatTimestamp(report.timestamp)}</p>
                  {report.photo_url && (
                    <img src={report.photo_url} alt="Incident" className="w-full h-20 object-cover rounded mt-1" />
                  )}
                  <p className="text-xs mt-1">{report.description}</p>
                  <button
                    type="button"
                    onClick={() => setManagingReport(report)}
                    className="mt-2 w-full py-1.5 rounded bg-primary text-white text-xs font-semibold"
                  >
                    Manage Report
                  </button>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      {managingReport && (
        <ReportManagementPanel
          report={managingReport}
          onClose={() => setManagingReport(null)}
          onUpdated={(updated) => {
            setManagingReport(updated);
          }}
        />
      )}
    </div>
  );
}
