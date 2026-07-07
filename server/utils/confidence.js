/**
 * Confidence score calculation for a newly submitted report.
 *
 * Rules (as specified):
 *  - incident_type selected:            +20
 *  - description length >= 50 chars:    +20
 *  - GPS coordinates provided:          +25
 *  - photo uploaded:                    +25
 *  - corroboration_flag is true:        +10
 *  Capped at 100.
 *
 * Reports scoring below 40 are auto-flagged to "under_review" instead
 * of the default "pending" status.
 */

const MIN_SCORE_FOR_PENDING = 40;

function calculateConfidenceScore({
  incidentType,
  description,
  latitude,
  longitude,
  photoUrl,
  corroborationFlag,
}) {
  let score = 0;

  if (incidentType && typeof incidentType === "string" && incidentType.trim().length > 0) {
    score += 20;
  }

  if (description && typeof description === "string" && description.trim().length >= 50) {
    score += 20;
  }

  const hasCoordinates =
    typeof latitude === "number" &&
    typeof longitude === "number" &&
    !Number.isNaN(latitude) &&
    !Number.isNaN(longitude);

  if (hasCoordinates) {
    score += 25;
  }

  if (photoUrl) {
    score += 25;
  }

  if (corroborationFlag) {
    score += 10;
  }

  return Math.min(score, 100);
}

function deriveInitialStatus(confidenceScore) {
  return confidenceScore < MIN_SCORE_FOR_PENDING ? "under_review" : "pending";
}

module.exports = { calculateConfidenceScore, deriveInitialStatus, MIN_SCORE_FOR_PENDING };
