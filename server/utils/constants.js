const INCIDENT_CATEGORIES = [
  "Road Traffic Accident",
  "Road Hazard",
  "Missing or Damaged Road Signs / Traffic Signals",
  "Highway Robbery / Carjacking",
  "Reckless or Dangerous Driving",
  "Abandoned Vehicle",
  "Poor Road Condition",
];

const REPORT_STATUSES = [
  "pending",
  "under_review",
  "verified",
  "under_investigation",
  "resolved",
  "rejected",
];

const CORROBORATION_RADIUS_KM = 0.5;
const CORROBORATION_WINDOW_MS = 2 * 60 * 60 * 1000; // 2 hours

module.exports = {
  INCIDENT_CATEGORIES,
  REPORT_STATUSES,
  CORROBORATION_RADIUS_KM,
  CORROBORATION_WINDOW_MS,
};
