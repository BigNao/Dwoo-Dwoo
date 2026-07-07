require("dotenv").config();

const express = require("express");
const cors = require("cors");

const reportsRouter = require("./routes/reports");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", service: "kwansodwoo-server" });
});

app.use("/api/reports", reportsRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "NotFound", message: `No route for ${req.method} ${req.originalUrl}` });
});

// Centralised error handler (catches anything thrown synchronously in routes)
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "InternalServerError", message: "Something went wrong." });
});

app.listen(PORT, () => {
  console.log(`KwansoDwoo API listening on port ${PORT}`);
});
