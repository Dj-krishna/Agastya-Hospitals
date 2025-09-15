const express = require("express");
const multer = require("multer");
const ImageKit = require("imagekit");

// Multer setup for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB max
  fileFilter: (req, file, cb) => {
    const allowed = [
      "image/jpeg", "image/png", "image/webp"
    ];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error("Unsupported file type"), false);
    }
    cb(null, true);
  }
});

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

// Middleware that handles JSON OR multipart for health packages
const healthPackageFilesMiddleware = (req, res, next) => {
  const contentType = req.headers["content-type"] || "";

  // JSON requests
  if (contentType.includes("application/json")) {
    return express.json()(req, res, (err) => {
      if (err) {
        return res.status(400).json({ error: "Invalid JSON", details: err.message });
      }
      req.files = {};
      next();
    });
  }

  // Multipart (with or without files)
  const handler = upload.fields([
    { name: "photo", maxCount: 1 }
  ]);

  handler(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: "File upload error", details: err.message });
    }

    try {
      if (!req.files) req.files = {};

      // Upload files to ImageKit
      for (const field in req.files) {
        if (req.files[field] && req.files[field].length > 0) {
          req.files[field] = await Promise.all(
            req.files[field].map(async (file) => {
              const uploaded = await imagekit.upload({
                file: file.buffer,
                fileName: `${Date.now()}-${file.originalname}`,
                folder: `/health-packages/${field}`,
                useUniqueFileName: true,
              });
              return { url: uploaded.url, fileId: uploaded.fileId };
            })
          );
        }
      }

      next();
    } catch (error) {
      return res.status(500).json({ error: "File upload failed", details: error.message });
    }
  });
};

module.exports = { healthPackageFilesMiddleware };


