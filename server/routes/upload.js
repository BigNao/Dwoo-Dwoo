const express = require("express");
const multer = require("multer");
const { uploadImage, uploadVideo } = require("../utils/cloudinary");

const router = express.Router();

const storage = multer.memoryStorage();

const imageUpload = multer({
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

const videoUpload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (["video/mp4", "video/webm", "video/quicktime"].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only MP4, WEBM, or MOV videos are allowed."));
    }
  },
});

router.post("/image", imageUpload.single("file"), async (req, res) => {
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

router.post("/video", videoUpload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "ValidationError", message: "No file provided." });
    }

    const url = await uploadVideo(req.file.buffer, req.file.originalname);

    return res.status(200).json({ url });
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({
      error: "UploadError",
      message: "Failed to upload video.",
    });
  }
});

module.exports = router;
