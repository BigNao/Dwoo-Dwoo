const express = require("express");
const multer = require("multer");
const { MulterError } = multer;
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

const VIDEO_MIMES = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "video/3gpp",
  "video/3gpp2",
  "video/x-m4v",
  "video/x-msvideo",
  "video/x-ms-wmv",
  "video/ogg",
];

const videoUpload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (VIDEO_MIMES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Unsupported video format. Please use MP4, WEBM, MOV, 3GP, or AVI."
        )
      );
    }
  },
});

function logFileDiagnostics(prefix, file) {
  console.log(`[${prefix}] Diagnostics:`, {
    originalname: file.originalname,
    mimetype: file.mimetype,
    size: file.size,
    bufferLength: file.buffer.length,
    encoding: file.encoding,
  });
}

function multerErrorHandler(err, req, res, next) {
  if (err instanceof MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({
        error: "FileTooLarge",
        message: "File is too large. Maximum size is 100 MB for videos.",
      });
    }
    return res.status(400).json({
      error: "UploadError",
      message: err.message,
    });
  }

  if (err) {
    return res.status(400).json({
      error: "ValidationError",
      message: err.message,
    });
  }

  next();
}

router.post(
  "/image",
  (req, res, next) => {
    imageUpload.single("file")(req, res, (err) => {
      if (err) return multerErrorHandler(err, req, res, next);
      next();
    });
  },
  async (req, res) => {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ error: "ValidationError", message: "No file provided." });
      }

      logFileDiagnostics("uploadImage", req.file);

      const url = await uploadImage(req.file.buffer, req.file.originalname);

      return res.status(200).json({ url });
    } catch (err) {
      console.error("[uploadImage] Error:", err.message);
      return res.status(500).json({
        error: "UploadError",
        message: "Failed to upload image.",
      });
    }
  }
);

router.post(
  "/video",
  (req, res, next) => {
    videoUpload.single("file")(req, res, (err) => {
      if (err) return multerErrorHandler(err, req, res, next);
      next();
    });
  },
  async (req, res) => {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ error: "ValidationError", message: "No file provided." });
      }

      logFileDiagnostics("uploadVideo", req.file);

      const url = await uploadVideo(req.file.buffer, req.file.originalname);

      return res.status(200).json({ url });
    } catch (err) {
      const isCloudinaryError =
        err.message === "Failed to upload video" ||
        err.message?.includes("video format");

      console.error("[uploadVideo] Error:", err.message);

      if (isCloudinaryError) {
        return res.status(502).json({
          error: "UploadError",
          message:
            "Video upload failed. The video format may not be supported. Please try a different video or convert it to MP4.",
        });
      }

      return res.status(500).json({
        error: "UploadError",
        message: "Failed to upload video.",
      });
    }
  }
);

module.exports = router;
