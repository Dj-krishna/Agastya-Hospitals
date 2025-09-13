const multer = require('multer');
const ImageKit = require('imagekit');
const express = require('express');

// Multer setup for memory storage with file size limits
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max per file
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error('Unsupported file type'), false);
    }
    cb(null, true);
  },
});

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

const technologyFilesMiddleware = (req, res, next) => {
  const contentType = req.headers['content-type'] || '';

  if (contentType.includes('application/json')) {
    // JSON only, no files
    return express.json()(req, res, (err) => {
      if (err) {
        console.error('JSON parse error:', err.message);
        return res.status(400).json({ error: 'Invalid JSON', details: err.message });
      }
      req.files = {};
      next();
    });
  }

  // Multipart form-data for files (icon)
  const handler = upload.fields([
    { name: 'icon', maxCount: 1 },
  ]);

  handler(req, res, async (err) => {
    if (err) {
      console.error('Multer error:', err.message);
      return res.status(400).json({ error: 'File upload error', details: err.message });
    }

    try {
      if (!req.files) req.files = {};

      for (const field in req.files) {
        if (req.files[field] && req.files[field].length > 0) {
          req.files[field] = await Promise.all(
            req.files[field].map(async (file) => {
              const uploaded = await imagekit.upload({
                file: file.buffer,
                fileName: `${Date.now()}-${file.originalname}`,
                folder: `/technologies/${field}`,
                useUniqueFileName: true,
              });
              return { url: uploaded.url, fileId: uploaded.fileId };
            })
          );
        }
      }

      next();
    } catch (error) {
      console.error('File upload middleware error:', error);
      return res.status(500).json({ error: 'File upload failed', details: error.message });
    }
  });
};

module.exports = { technologyFilesMiddleware };
