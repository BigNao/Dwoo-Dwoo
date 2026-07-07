const { randomUUID } = require("crypto");

const ALPHANUMERIC = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I to avoid confusion

/**
 * Generates a human-friendly reference number in the format KD-XXXXXXXX
 * where X is one of 8 random alphanumeric characters.
 */
function generateReferenceNumber() {
  let code = "";
  for (let i = 0; i < 8; i += 1) {
    code += ALPHANUMERIC.charAt(Math.floor(Math.random() * ALPHANUMERIC.length));
  }
  return `KD-${code}`;
}

function generateReportId() {
  return randomUUID();
}

function generateLogId() {
  return randomUUID();
}

/**
 * Haversine distance between two lat/lng points, in kilometres.
 */
function distanceInKm(lat1, lon1, lat2, lon2) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const earthRadiusKm = 6371;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusKm * c;
}

module.exports = { generateReferenceNumber, generateReportId, generateLogId, distanceInKm };
