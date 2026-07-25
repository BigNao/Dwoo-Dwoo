const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads an image buffer to Cloudinary
 * @param {Buffer} fileBuffer
 * @param {string} fileName
 * @returns {Promise<string>}
 */
async function uploadImage(fileBuffer, fileName) {
  return new Promise((resolve, reject) => {
    const safeFileName = fileName
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9_-]/g, "_");

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "reports",
        resource_type: "image",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
        transformation: [
          { quality: "auto", fetch_format: "auto" },
          { width: 1200, crop: "limit" },
        ],
        public_id: `${Date.now()}_${safeFileName}`,
      },
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
    const safeFileName = fileName
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9_-]/g, "_");

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "reports",
        resource_type: "video",
        public_id: `${Date.now()}_${safeFileName}`,
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary video upload error:", error);
          reject(new Error("Failed to upload video"));
        } else {
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