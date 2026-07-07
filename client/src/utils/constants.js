export const INCIDENT_CATEGORIES = [
  "Road Traffic Accident",
  "Road Hazard",
  "Missing or Damaged Road Signs / Traffic Signals",
  "Highway Robbery / Carjacking",
  "Reckless or Dangerous Driving",
  "Abandoned Vehicle",
  "Poor Road Condition",
];

export const REPORT_STATUSES = [
  "pending",
  "under_review",
  "verified",
  "under_investigation",
  "resolved",
  "rejected",
];

// Text-label version of each status, for display.
export const STATUS_LABELS = {
  pending: "Pending",
  under_review: "Under Review",
  verified: "Verified",
  under_investigation: "Under Investigation",
  resolved: "Resolved",
  rejected: "Rejected",
};

// Tailwind classes per status badge, matching the spec's colour scheme.
export const STATUS_COLORS = {
  pending: "text-muted bg-background",
  under_review: "text-accent-dark bg-accent-light",
  verified: "text-primary bg-primary-light",
  under_investigation: "text-accent-dark bg-accent-light",
  resolved: "text-secondary bg-secondary-light",
  rejected: "text-danger bg-danger-light",
};

// Hex marker colours per incident type, for the Leaflet live map.
export const INCIDENT_MARKER_COLORS = {
  "Road Traffic Accident": "#DC2626",
  "Road Hazard": "#F59E0B",
  "Missing or Damaged Road Signs / Traffic Signals": "#F59E0B",
  "Highway Robbery / Carjacking": "#1E40AF",
  "Reckless or Dangerous Driving": "#1D4ED8",
  "Abandoned Vehicle": "#475569",
  "Poor Road Condition": "#059669",
};

export function confidenceColor(score) {
  if (score < 40) return { bar: "bg-danger", text: "text-danger" };
  if (score < 70) return { bar: "bg-accent", text: "text-accent-dark" };
  return { bar: "bg-secondary", text: "text-secondary" };
}
