const cloudinary = require('../config/cloudinary');
const { v4: uuidv4 } = require('uuid');

async function uploadImage(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'ValidationError', message: 'No file uploaded' });
    }

    // Use streamifier to convert buffer to stream for Cloudinary upload
    const streamifier = require('streamifier');
    
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'reports',
          public_id: `${Date.now()}_${uuidv4()}`,
          resource_type: 'image',
          allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
          max_file_size: 10485760, // 10MB
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
    });

    return res.status(200).json({
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
    });
  } catch (err) {
    console.error('uploadImage error:', err);
    return res.status(500).json({
      error: 'InternalServerError',
      message: 'Failed to upload image. Please try again.',
    });
  }
}

async function deleteImage(req, res) {
  try {
    const { public_id } = req.body;

    if (!public_id) {
      return res.status(400).json({ error: 'ValidationError', message: 'public_id is required' });
    }

    const result = await cloudinary.uploader.destroy(public_id);

    if (result.result === 'ok' || result.result === 'not found') {
      return res.status(200).json({ success: true });
    } else {
      return res.status(500).json({
        error: 'InternalServerError',
        message: 'Failed to delete image from Cloudinary',
      });
    }
  } catch (err) {
    console.error('deleteImage error:', err);
    return res.status(500).json({
      error: 'InternalServerError',
      message: 'Failed to delete image. Please try again.',
    });
  }
}

module.exports = {
  uploadImage,
  deleteImage,
};
