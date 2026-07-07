const express = require("express");
const verifyAdmin = require("../middleware/verifyAdmin");
const {
  createReport,
  trackReport,
  listReports,
  updateReport,
  getReportLogs,
} = require("../controllers/reportsController");

const router = express.Router();

// Public — anonymous or registered citizens
router.post("/", createReport);
router.get("/track/:referenceNumber", trackReport);

// Admin only
router.get("/", verifyAdmin, listReports);
router.patch("/:reportId", verifyAdmin, updateReport);
router.get("/:reportId/logs", verifyAdmin, getReportLogs);

module.exports = router;
