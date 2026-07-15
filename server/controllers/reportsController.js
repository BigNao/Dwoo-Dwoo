const { db, admin } = require("../config/firebaseAdmin");
const { calculateConfidenceScore, deriveInitialStatus } = require("../utils/confidence");
const { uploadImage } = require("../utils/cloudinary");
const {
  generateReferenceNumber,
  generateReportId,
  generateLogId,
  generateNotificationId,
  distanceInKm,
} = require("../utils/helpers");
const {
  INCIDENT_CATEGORIES,
  REPORT_STATUSES,
  CORROBORATION_RADIUS_KM,
  CORROBORATION_WINDOW_MS,
} = require("../utils/constants");

const REPORTS_COLLECTION = "reports";
const USERS_COLLECTION = "users";
const ADMIN_LOGS_COLLECTION = "admin_logs";
const NOTIFICATIONS_COLLECTION = "notifications";

/**
 * Looks for other reports of the same incident_type, within
 * CORROBORATION_RADIUS_KM and CORROBORATION_WINDOW_MS of "now".
 * Returns the list of matching report document snapshots.
 */
async function findCorroboratingReports({ incident_type, latitude, longitude }) {
  const windowStart = admin.firestore.Timestamp.fromMillis(Date.now() - CORROBORATION_WINDOW_MS);

  // Single-field timestamp query (auto-indexed) — filter type + distance in memory
  // so report submission works before composite indexes are deployed.
  const snapshot = await db
    .collection(REPORTS_COLLECTION)
    .where("timestamp", ">=", windowStart)
    .get();

  const matches = [];
  snapshot.forEach((doc) => {
    const data = doc.data();
    if (data.incident_type !== incident_type) return;
    if (typeof data.latitude !== "number" || typeof data.longitude !== "number") return;

    const km = distanceInKm(latitude, longitude, data.latitude, data.longitude);
    if (km <= CORROBORATION_RADIUS_KM) {
      matches.push(doc);
    }
  });

  return matches;
}

async function createReport(req, res) {
  try {
    const {
      submission_type,
      incident_type,
      description,
      latitude,
      longitude,
      photo_data,
      photo_name,
      user_id,
    } = req.body;

    // --- Validation ---
    const errors = {};

    if (!["anonymous", "registered"].includes(submission_type)) {
      errors.submission_type = "submission_type must be 'anonymous' or 'registered'.";
    }

    if (!INCIDENT_CATEGORIES.includes(incident_type)) {
      errors.incident_type = "incident_type must be one of the 7 supported categories.";
    }

    if (typeof description !== "string" || description.trim().length < 20) {
      errors.description = "description must be at least 20 characters long.";
    }

    const lat = Number(latitude);
    const lng = Number(longitude);
    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      errors.location = "Valid latitude and longitude are required.";
    }

    if (submission_type === "registered" && !user_id) {
      errors.user_id = "user_id is required when submission_type is 'registered'.";
    }

    if (photo_data && !photo_name) {
      errors.photo_name = "photo_name is required when photo_data is provided.";
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ error: "ValidationError", fields: errors });
    }

    // --- Image upload to Cloudinary ---
    let photoUrl = null;
    if (photo_data) {
      try {
        const buffer = Buffer.from(photo_data, 'base64');
        photoUrl = await uploadImage(buffer, photo_name);
      } catch (uploadError) {
        console.error('Image upload failed:', uploadError);
        return res.status(500).json({
          error: "UploadError",
          message: "Failed to upload image. Please try again."
        });
      }
    }

    // --- Corroboration check ---
    const corroborating = await findCorroboratingReports({
      incident_type,
      latitude: lat,
      longitude: lng,
    });
    const corroborationFlag = corroborating.length >= 1;

    // --- Confidence score ---
    const confidenceScore = calculateConfidenceScore({
      incidentType: incident_type,
      description,
      latitude: lat,
      longitude: lng,
      photoUrl: photoUrl || null,
      corroborationFlag,
    });
    const status = deriveInitialStatus(confidenceScore);

    const reportId = generateReportId();
    const referenceNumber = generateReferenceNumber();
    const now = admin.firestore.Timestamp.now();

    const reportDoc = {
      report_id: reportId,
      reference_number: referenceNumber,
      submission_type,
      user_id: submission_type === "registered" ? user_id : null,
      incident_type,
      description: description.trim(),
      latitude: lat,
      longitude: lng,
      timestamp: now,
      photo_url: photoUrl || null,
      status,
      confidence_score: confidenceScore,
      corroboration_flag: corroborationFlag,
      admin_notes: null,
    };

    await db.collection(REPORTS_COLLECTION).doc(reportId).set(reportDoc);

    // Bump matching reports' corroboration_flag + confidence_score (+10, capped at 100)
    if (corroborating.length > 0) {
      const batch = db.batch();
      corroborating.forEach((doc) => {
        const data = doc.data();
        const bumpedScore = Math.min((data.confidence_score || 0) + 10, 100);
        batch.update(doc.ref, {
          corroboration_flag: true,
          confidence_score: bumpedScore,
        });
      });
      await batch.commit();
    }

    // Keep the user's report_count in sync for registered submissions
    if (submission_type === "registered" && user_id) {
      await db
        .collection(USERS_COLLECTION)
        .doc(user_id)
        .update({ report_count: admin.firestore.FieldValue.increment(1) })
        .catch(() => {
          // If the user document doesn't have report_count yet, set it explicitly.
          return db
            .collection(USERS_COLLECTION)
            .doc(user_id)
            .set({ report_count: 1 }, { merge: true });
        });
    }

    return res.status(201).json({
      report_id: reportId,
      reference_number: referenceNumber,
      status,
      confidence_score: confidenceScore,
    });
  } catch (err) {
    console.error("createReport error:", err);
    return res.status(500).json({
      error: "InternalServerError",
      message: "Failed to submit report. Please try again.",
    });
  }
}

async function trackReport(req, res) {
  try {
    const { referenceNumber } = req.params;

    if (!referenceNumber) {
      return res.status(400).json({ error: "ValidationError", message: "referenceNumber is required." });
    }

    const snapshot = await db
      .collection(REPORTS_COLLECTION)
      .where("reference_number", "==", referenceNumber.toUpperCase())
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({
        error: "NotFound",
        message: "No report found for that reference number.",
      });
    }

    const data = snapshot.docs[0].data();

    return res.status(200).json({
      reference_number: data.reference_number,
      incident_type: data.incident_type,
      description: data.description,
      status: data.status,
      timestamp: data.timestamp,
      last_updated: data.timestamp,
      admin_notes: data.admin_notes || null,
    });
  } catch (err) {
    console.error("trackReport error:", err);
    return res.status(500).json({
      error: "InternalServerError",
      message: "Failed to retrieve report.",
    });
  }
}

async function listReports(req, res) {
  try {
    const { incident_type, status, dateFrom, dateTo, minScore, maxScore } = req.query;

    let query = db.collection(REPORTS_COLLECTION);

    if (incident_type && INCIDENT_CATEGORIES.includes(incident_type)) {
      query = query.where("incident_type", "==", incident_type);
    }

    if (status && REPORT_STATUSES.includes(status)) {
      query = query.where("status", "==", status);
    }

    if (dateFrom) {
      const fromDate = new Date(dateFrom);
      if (!Number.isNaN(fromDate.getTime())) {
        query = query.where("timestamp", ">=", admin.firestore.Timestamp.fromDate(fromDate));
      }
    }

    if (dateTo) {
      const toDate = new Date(dateTo);
      if (!Number.isNaN(toDate.getTime())) {
        query = query.where("timestamp", "<=", admin.firestore.Timestamp.fromDate(toDate));
      }
    }

    query = query.orderBy("timestamp", "desc");

    const snapshot = await query.get();

    let reports = snapshot.docs.map((doc) => doc.data());

    // Score range filtering done in-memory (keeps Firestore composite-index
    // requirements minimal for the other filters above).
    const min = minScore !== undefined ? Number(minScore) : null;
    const max = maxScore !== undefined ? Number(maxScore) : null;

    if (min !== null && !Number.isNaN(min)) {
      reports = reports.filter((r) => r.confidence_score >= min);
    }
    if (max !== null && !Number.isNaN(max)) {
      reports = reports.filter((r) => r.confidence_score <= max);
    }

    // Enrich registered reports with the citizen's display name
    const enriched = await Promise.all(
      reports.map(async (report) => {
        if (report.submission_type === "registered" && report.user_id) {
          try {
            const userSnap = await db.collection(USERS_COLLECTION).doc(report.user_id).get();
            if (userSnap.exists) {
              const userData = userSnap.data();
              return { ...report, user_display_name: userData.display_name || userData.email_address || report.user_id };
            }
          } catch { }
          return { ...report, user_display_name: report.user_id };
        }
        return { ...report, user_display_name: "Anonymous" };
      })
    );

    return res.status(200).json({ reports: enriched });
  } catch (err) {
    console.error("listReports error:", err);
    return res.status(500).json({
      error: "InternalServerError",
      message: "Failed to retrieve reports.",
    });
  }
}

async function updateReport(req, res) {
  try {
    const { reportId } = req.params;
    const { status, admin_notes } = req.body;

    if (status && !REPORT_STATUSES.includes(status)) {
      return res.status(400).json({
        error: "ValidationError",
        message: `status must be one of: ${REPORT_STATUSES.join(", ")}`,
      });
    }

    const reportRef = db.collection(REPORTS_COLLECTION).doc(reportId);
    const reportSnap = await reportRef.get();

    if (!reportSnap.exists) {
      return res.status(404).json({ error: "NotFound", message: "Report not found." });
    }

    const previousStatus = reportSnap.data().status;

    const updates = {};
    if (status) updates.status = status;
    if (admin_notes !== undefined) updates.admin_notes = admin_notes;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        error: "ValidationError",
        message: "Provide at least one of: status, admin_notes.",
      });
    }

    await reportRef.update(updates);

    if (status && status !== previousStatus) {
      const logId = generateLogId();
      let actionType = "status_update";
      if (status === "verified") actionType = "report_verified";
      if (status === "rejected") actionType = "report_rejected";

      await db
        .collection(ADMIN_LOGS_COLLECTION)
        .doc(logId)
        .set({
          log_id: logId,
          admin_user_id: req.user.uid,
          action_type: actionType,
          report_id: reportId,
          previous_status: previousStatus,
          new_status: status,
          action_timestamp: admin.firestore.Timestamp.now(),
          admin_notes: admin_notes !== undefined ? admin_notes : null,
        });

      // Notify the citizen if the report belongs to a registered user
      const reportData = reportSnap.data();
      if (reportData.user_id) {
        const statusLabels = {
          pending: "Pending",
          under_review: "Under Review",
          verified: "Verified",
          under_investigation: "Under Investigation",
          resolved: "Resolved",
          rejected: "Rejected",
        };
        const notificationId = generateNotificationId();
        await db.collection(NOTIFICATIONS_COLLECTION).doc(notificationId).set({
          notification_id: notificationId,
          user_id: reportData.user_id,
          title: "Report Status Updated",
          message: `Your report ${reportData.reference_number} status has been updated to "${statusLabels[status] || status}".`,
          timestamp: admin.firestore.Timestamp.now(),
          read: false,
          report_id: reportId,
          reference_number: reportData.reference_number,
        });
      }
    }

    const updatedSnap = await reportRef.get();
    return res.status(200).json(updatedSnap.data());
  } catch (err) {
    console.error("updateReport error:", err);
    return res.status(500).json({
      error: "InternalServerError",
      message: "Failed to update report.",
    });
  }
}

async function getReportLogs(req, res) {
  try {
    const { reportId } = req.params;

    const snapshot = await db
      .collection(ADMIN_LOGS_COLLECTION)
      .where("report_id", "==", reportId)
      .orderBy("action_timestamp", "desc")
      .get();

    const logs = snapshot.docs.map((doc) => doc.data());

    return res.status(200).json({ logs });
  } catch (err) {
    console.error("getReportLogs error:", err);
    return res.status(500).json({
      error: "InternalServerError",
      message: "Failed to retrieve audit trail.",
    });
  }
}

module.exports = {
  createReport,
  trackReport,
  listReports,
  updateReport,
  getReportLogs,
};
