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
  pending: "text-gray-600 bg-gray-100",
  under_review: "text-yellow-800 bg-yellow-100",
  verified: "text-blue-800 bg-blue-100",
  under_investigation: "text-orange-800 bg-orange-100",
  resolved: "text-forest bg-green-100",
  rejected: "text-kente bg-red-100",
};

// Hex marker colours per incident type, for the Leaflet live map.
export const INCIDENT_MARKER_COLORS = {
  "Road Traffic Accident": "#DC2626", // red
  "Road Hazard": "#EA580C", // orange
  "Missing or Damaged Road Signs / Traffic Signals": "#EAB308", // yellow
  "Highway Robbery / Carjacking": "#7E22CE", // purple
  "Reckless or Dangerous Driving": "#2563EB", // blue
  "Abandoned Vehicle": "#6B7280", // grey
  "Poor Road Condition": "#78350F", // brown
};

export function confidenceColor(score) {
  if (score < 40) return { bar: "bg-kente", text: "text-kente" };
  if (score < 70) return { bar: "bg-yellow-500", text: "text-yellow-700" };
  return { bar: "bg-forest", text: "text-forest" };
}
