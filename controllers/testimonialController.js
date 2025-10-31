const Testimonial = require("../models/Testimonials");
const getNextSequence = require("../utils/getNextSequence");

// ---------------- Helper Functions ----------------

// Safe file URL extraction (works for Multer, ImageKit, or S3)
const getFileUrl = (fileArr) => {
  if (!fileArr || !Array.isArray(fileArr) || fileArr.length === 0) return null;
  const f = fileArr[0];
  return f.url || f.path || f.location || null;
};

// Normalize string safely
const normalizeString = (val) => {
  if (val === undefined || val === null) return null;
  if (typeof val === "string") return val.trim();
  return val;
};

// ---------------- Validation ----------------
const validateTestimonial = (data, isUpdate = false) => {
  const errors = [];
  const normalized = { ...data };

  if (!isUpdate) {
    if (!normalized.name) errors.push("name is required");
    if (!normalized.type) errors.push("type is required");
  }

  normalized.name = normalizeString(data.name);
  normalized.place = normalizeString(data.place);
  normalized.description = normalizeString(data.description);
  normalized.youtubeLink = normalizeString(data.youtubeLink);
  normalized.createdBy = normalizeString(data.createdBy) || "admin";

  if (normalized.type && !["text", "video"].includes(normalized.type)) {
    errors.push("type must be 'text' or 'video'");
  }

  // Optional: Enforce rule for video testimonials
  if (normalized.type === "video" && !normalized.videoUpload && !normalized.youtubeLink) {
    errors.push("Video testimonials must include a video upload or YouTube link");
  }

  return { normalized, errors };
};

// ---------------- Controllers ----------------

// GET /testimonials
exports.getTestimonials = async (req, res) => {
  try {
    const filter = {};

    // Optional filtering by query params
    if (req.query.type) filter.type = req.query.type;
    if (req.query.name) filter.name = { $regex: req.query.name, $options: "i" };
    if (req.query.place) filter.place = { $regex: req.query.place, $options: "i" };

    const testimonials = await Testimonial.find(filter).sort({ createdAt: -1 });

    if (testimonials.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No testimonials found matching criteria.",
        data: [],
      });
    }

    res.json({
      success: true,
      message: "Testimonials retrieved successfully",
      count: testimonials.length,
      data: testimonials,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// POST /testimonials
exports.addTestimonial = async (req, res) => {
  try {
    let payload = req.body;
    if (!payload || typeof payload !== "object") {
      return res.status(400).json({ success: false, error: "Invalid request body" });
    }

    const { normalized, errors } = validateTestimonial(payload);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, error: "Validation failed", details: errors });
    }

    // Auto-generate testimonialID
    const nextId = await getNextSequence("testimonialID");
    normalized.testimonialID = Number(nextId);

    // Handle file uploads
    if (req.files && req.files.userPhoto) {
      normalized.userPhoto = getFileUrl(req.files.userPhoto);
    }
    if (req.files && req.files.videoUpload) {
      normalized.videoUpload = getFileUrl(req.files.videoUpload);
    }

    const saved = await new Testimonial(normalized).save();

    res.status(201).json({
      success: true,
      message: "Testimonial created successfully",
      data: saved,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// PUT /testimonials?testimonialID=123
exports.updateTestimonial = async (req, res) => {
  try {
    const testimonialID = req.query.testimonialID;
    if (!testimonialID) {
      return res.status(400).json({
        success: false,
        error: "testimonialID is required in query parameter",
      });
    }

    let updateData = { ...req.body };

    if (typeof updateData === "string") {
      try {
        updateData = JSON.parse(updateData);
      } catch (e) {
        return res.status(400).json({
          success: false,
          error: "Invalid JSON in body",
        });
      }
    }

    const { normalized, errors } = validateTestimonial(updateData, true);
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        details: errors,
      });
    }

    // Handle file uploads
    if (req.files && req.files.userPhoto) {
      normalized.userPhoto = getFileUrl(req.files.userPhoto);
    }
    if (req.files && req.files.videoUpload) {
      normalized.videoUpload = getFileUrl(req.files.videoUpload);
    }

    const filter = { testimonialID: Number(testimonialID) };
    const updated = await Testimonial.findOneAndUpdate(
      filter,
      { $set: normalized },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "No testimonial found to update",
      });
    }

    res.json({
      success: true,
      message: "Testimonial updated successfully",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// DELETE /testimonials or /testimonials/bulk/:ids
exports.deleteTestimonials = async (req, res) => {
  try {
    let filter = {};

    if (req.query.testimonialID) {
      // delete single testimonial by query param
      filter = { testimonialID: Number(req.query.testimonialID) };
    } else if (req.query.ids) {
      // delete multiple testimonials via ?ids=1,2,3
      const ids = req.query.ids
        .split(',')
        .map((id) => Number(id.trim()))
        .filter((id) => !isNaN(id));
      filter = { testimonialID: { $in: ids } };
    } else if (req.body.filter) {
      filter = req.body.filter;
    } else {
      return res.status(400).json({ success: false, error: "No testimonialID or ids provided." });
    }

    // Fetch testimonials to delete
    const toDelete = await Testimonial.find(filter);
    if (toDelete.length === 0) {
      return res.status(404).json({ success: false, message: "No testimonials found" });
    }

    // Delete them
    const result = await Testimonial.deleteMany(filter);

    res.json({
      success: true,
      message:
        result.deletedCount === 1
          ? "Testimonial deleted successfully"
          : "Testimonials deleted successfully",
      deletedCount: result.deletedCount,
      data: toDelete,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

