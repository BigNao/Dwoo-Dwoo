const express = require("express");
const multer = require("multer");
const { uploadImage } = require("../utils/cloudinary");

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (["image/jpeg", "image/png", "image/webp"].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPG, PNG, or WEBP images are allowed."));
    }
  },
});

router.post("/image", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "ValidationError", message: "No file provided." });
    }

    const url = await uploadImage(req.file.buffer, req.file.originalname);

    return res.status(200).json({ url });
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({
      error: "UploadError",
      message: "Failed to upload image.",
    });
  }
});

module.exports = router;
