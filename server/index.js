require("dotenv").config();

const express = require("express");
const cors = require("cors");

const reportsRouter = require("./routes/reports");
const uploadRouter = require("./routes/upload");

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://dwoo-dwoo.vercel.app",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "50mb" }));

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "kwansodwoo-server",
  });
});

app.use("/api/reports", reportsRouter);
app.use("/api/upload", uploadRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "NotFound",
    message: `No route for ${req.method} ${req.originalUrl}`,
  });
});

// Centralised error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  console.error("Request details:", {
    method: req.method,
    path: req.path,
    origin: req.headers.origin,
    userAgent: req.headers["user-agent"],
  });

  res.status(500).json({
    error: "InternalServerError",
    message: "Something went wrong.",
    details:
      process.env.NODE_ENV === "development"
        ? err.message
        : undefined,
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`KwansoDwoo API listening on port ${PORT}`);
});