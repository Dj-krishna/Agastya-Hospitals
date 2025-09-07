const multer = require("multer");
const ImageKit = require("imagekit");

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB max
  fileFilter: (req, file, cb) => {
    const allowed = [
      "image/jpeg", "image/png", "image/webp",
      "video/mp4", "video/quicktime", "video/webm"
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

const doctorFilesMiddleware = (req, res, next) => {
  const handler = upload.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "profileImageGfs", maxCount: 3 },
    { name: "introVideoGfs", maxCount: 3 }
  ]);

  handler(req, res, async (err) => {
    if (err) return next(err);

    try {
      // Upload each file to ImageKit
      for (const field in req.files) {
        req.files[field] = await Promise.all(
          req.files[field].map(async (file) => {
            const uploaded = await imagekit.upload({
              file: file.buffer,
              fileName: file.originalname,
              folder: `/doctors/${field}`
            });
            return { url: uploaded.url }; // Only store the URL
          })
        );        
      }
      console.log('Middleware - Uploaded files:', req.files);
      next();
    } catch (error) {
      next(error);
    }
  });
};

module.exports = { doctorFilesMiddleware };
