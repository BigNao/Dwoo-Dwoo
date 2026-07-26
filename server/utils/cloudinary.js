const cloudinary = require("cloudinary").v2;
const path = require("path");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const EXTENSION_TO_FORMAT = {
  jpg: "jpg",
  jpeg: "jpeg",
  png: "png",
  webp: "webp",
  mp4: "mp4",
  webm: "webm",
  mov: "mov",
  qt: "mov",
  m4v: "m4v",
  "3gp": "3gp",
  avi: "avi",
  wmv: "wmv",
  flv: "flv",
  mkv: "mkv",
  mpg: "mpg",
  mpeg: "mpeg",
};

function getExtension(fileName) {
  const ext = path.extname(fileName || "").replace(".", "").toLowerCase();
  return ext || "";
}

function getFormat(extension) {
  return EXTENSION_TO_FORMAT[extension] || extension || undefined;
}

/**
 * Uploads an image buffer to Cloudinary
 * @param {Buffer} fileBuffer
 * @param {string} fileName
 * @returns {Promise<string>}
 */
async function uploadImage(fileBuffer, fileName) {
  return new Promise((resolve, reject) => {
    const ext = getExtension(fileName);
    const safeFileName = fileName
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9_-]/g, "_");

    const uploadOptions = {
      folder: "reports",
      resource_type: "image",
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
      transformation: [
        { quality: "auto", fetch_format: "auto" },
        { width: 1200, crop: "limit" },
      ],
      public_id: `${Date.now()}_${safeFileName}`,
    };

    if (ext) {
      uploadOptions.public_id = `${Date.now()}_${safeFileName}.${ext}`;
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          console.error("Cloudinary image upload error:", error);
          reject(new Error("Failed to upload image"));
        } else {
          resolve(result.secure_url);
        }
      }
    );

    uploadStream.end(fileBuffer);
  });
}

/**
 * Uploads a video buffer to Cloudinary
 * @param {Buffer} fileBuffer
 * @param {string} fileName
 * @returns {Promise<string>}
 */
async function uploadVideo(fileBuffer, fileName) {
  return new Promise((resolve, reject) => {
    const ext = getExtension(fileName);
    const format = getFormat(ext);
    const safeFileName = fileName
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9_-]/g, "_");

    const uploadOptions = {
      folder: "reports",
      resource_type: "video",
      public_id: `${Date.now()}_${safeFileName}`,
    };

    if (ext) {
      uploadOptions.public_id = `${Date.now()}_${safeFileName}.${ext}`;
    }

    if (format) {
      uploadOptions.format = format;
    }

    console.log(
      `[uploadVideo] fileName="${fileName}" ext="${ext}" format="${format}" size=${fileBuffer.length}`
    );

    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          console.error("Cloudinary video upload error:", {
            message: error.message,
            http_code: error.http_code,
            fileName,
            ext,
            format,
            bufferSize: fileBuffer.length,
          });
          reject(new Error("Failed to upload video"));
        } else {
          console.log(
            `[uploadVideo] SUCCESS fileName="${fileName}" url=${result.secure_url}`
          );
          resolve(result.secure_url);
        }
      }
    );

    uploadStream.end(fileBuffer);
  });
}

module.exports = {
  uploadImage,
  uploadVideo,
};