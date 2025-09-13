const Doctor = require("../models/Doctors");
const Department = require("../models/Departments");
const Speciality = require("../models/Specialities");
const getNextSequence = require("../utils/getNextSequence");

// ---------------- Helper Functions ----------------

// Safe file URL extraction (ImageKit or Multer)
const getFileUrl = (fileArr) => {
  if (!fileArr || !Array.isArray(fileArr) || fileArr.length === 0) return null;
  const f = fileArr[0];
  return f.url || f.path || f.location || null;
};

// Normalize arrays (string, CSV, or JSON string → array)
const normalizeArray = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed;
    } catch (_) {
      // fallback to comma-split
    }
    return value.split(",").map((s) => s.trim()).filter(Boolean);
  }
  return [];
};

// Validate and normalize doctor input
const validateAndNormalizeDoctor = async (doc, isUpdate = false) => {
  const errors = [];
  let normalizedDoc = { ...doc };

  // Required fields only for create
  if (!isUpdate) {
    if (!normalizedDoc.fullName) errors.push("fullName is required");
    if (!normalizedDoc.email) errors.push("email is required");
    if (!normalizedDoc.mobile) errors.push("mobile is required");
    if (!normalizedDoc.medicalRegNumber) errors.push("medicalRegNumber is required");
    if (!normalizedDoc.designation) errors.push("designation is required");
    if (!normalizedDoc.departmentID) errors.push("departmentID is required");
  }

  // Normalize array fields
  normalizedDoc.languagesKnown = normalizeArray(doc.languagesKnown);
  normalizedDoc.servicesOffered = normalizeArray(doc.servicesOffered);
  normalizedDoc.educationQualification = normalizeArray(doc.educationQualification);
  normalizedDoc.opTimings = normalizeArray(doc.opTimings);
  normalizedDoc.speciality = normalizeArray(doc.speciality);

  // Validate email
  if (
    normalizedDoc.email &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedDoc.email)
  ) {
    errors.push("Invalid email format");
  }

  // Validate mobile
  if (
    normalizedDoc.mobile &&
    !/^\d{10}$/.test(normalizedDoc.mobile.replace(/\D/g, ""))
  ) {
    errors.push("Mobile number must be 10 digits");
  }

  // Validate gender
  if (
    normalizedDoc.gender &&
    !["Male", "Female", "Others"].includes(normalizedDoc.gender)
  ) {
    errors.push("Gender must be Male, Female, or Others");
  }

  // Convert numbers
  if (normalizedDoc.departmentID) {
    normalizedDoc.departmentID = Number(normalizedDoc.departmentID);
    if (isNaN(normalizedDoc.departmentID)) {
      errors.push("departmentID must be a valid number");
    }
  }

  if (normalizedDoc.speciality && Array.isArray(normalizedDoc.speciality)) {
    normalizedDoc.speciality = normalizedDoc.speciality
      .map((s) => Number(s))
      .filter((s) => !isNaN(s));
  }

  return { normalizedDoc, errors };
};

// Build filter from query
const buildDoctorFilter = (query) => {
  const filter = {};
  const regexMatchFields = ["gender"];

  for (const key in query) {
    const value = query[key];
    if (!value) continue;

    if (key === "doctorID") {
      filter[key] = Number(value);
    } else if (regexMatchFields.includes(key)) {
      filter[key] = { $regex: `^${value}$`, $options: "i" };
    } else if (["speciality", "languagesKnown", "servicesOffered"].includes(key)) {
      filter[key] = { $elemMatch: { $regex: value, $options: "i" } };
    } else {
      filter[key] = { $regex: value, $options: "i" };
    }
  }
  return filter;
};

// Aggregation pipeline
const doctorWithDepartmentAndSpecialitiesLookup = (match = {}) => [
  { $match: match },
  {
    $lookup: {
      from: "departments",
      localField: "departmentID",
      foreignField: "departmentID",
      as: "departmentData",
    },
  },
  { $unwind: { path: "$departmentData", preserveNullAndEmptyArrays: true } },
  {
    $lookup: {
      from: "specialities",
      localField: "speciality",
      foreignField: "specialityID",
      as: "specialityDetails",
    },
  },
  {
    $addFields: {
      departmentName: "$departmentData.departmentName",
      specialityNames: {
        $cond: [
          {
            $and: [
              { $isArray: "$specialityDetails" },
              { $gt: [{ $size: "$specialityDetails" }, 0] },
            ],
          },
          {
            $map: {
              input: "$specialityDetails",
              as: "s",
              in: "$$s.specialityName",
            },
          },
          [],
        ],
      },
    },
  },
  { $project: { departmentData: 0, specialityDetails: 0 } },
];

// ---------------- Controllers ----------------

// GET /doctors
exports.getDoctors = async (req, res) => {
  try {
    const filter = buildDoctorFilter(req.query);
    const doctors = await Doctor.aggregate(doctorWithDepartmentAndSpecialitiesLookup(filter));

    if (doctors.length === 0) {
      return res.status(404).json({ success: false, message: "No doctors found matching the criteria.", data: [] });
    }

    if (req.query.doctorID) {
      res.json({ success: true, message: "Doctor retrieved successfully", data: doctors[0] });
    } else {
      res.json({ success: true, message: "Doctors retrieved successfully", count: doctors.length, data: doctors });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// POST /doctors (Unified: JSON-only or JSON + file)
exports.addDoctor = async (req, res) => {
  try {
    let payload = req.body;
    if (!payload || typeof payload !== "object") {
      return res.status(400).json({ success: false, error: "Invalid request body" });
    }

    const { normalizedDoc, errors } = await validateAndNormalizeDoctor(payload);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, error: "Validation failed", details: errors });
    }

    if (await Doctor.exists({ email: normalizedDoc.email })) {
      return res.status(409).json({ success: false, error: "A doctor with this email already exists." });
    }

    if (!normalizedDoc.doctorID) {
      normalizedDoc.doctorID = await getNextSequence("doctorID");
    }

    // ✅ Handle optional profilePicture
    if (req.files && req.files.profilePicture) {
      normalizedDoc.profilePicture = getFileUrl(req.files.profilePicture);
    }

    const saved = await new Doctor(normalizedDoc).save();
    const enriched = await Doctor.aggregate(
      doctorWithDepartmentAndSpecialitiesLookup({ doctorID: saved.doctorID })
    );

    res.status(201).json({ success: true, message: "Doctor created successfully", data: enriched[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// PUT /doctors/:doctorID (Update + optional file)
exports.updateDoctor = async (req, res) => {
  try {
    const doctorID = req.query.doctorID;  // ← get from query now
    if (!doctorID) {
      return res.status(400).json({ success: false, error: "doctorID is required in query parameter" });
    }

    const filter = { doctorID: Number(doctorID) };
    let updateData = { ...req.body };

    if (typeof updateData === "string") {
      try {
        updateData = JSON.parse(updateData);
      } catch (e) {
        return res.status(400).json({ success: false, error: "Invalid JSON in body" });
      }
    }

    delete updateData._id;
    delete updateData.doctorID;

    const { normalizedDoc, errors } = await validateAndNormalizeDoctor(updateData, true);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, error: "Validation failed", details: errors });
    }

    // ✅ File uploads
    if (req.files && req.files.profilePicture) {
      normalizedDoc.profilePicture = getFileUrl(req.files.profilePicture);
    }

    const result = await Doctor.updateOne(filter, { $set: normalizedDoc });

    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, message: "No doctor found to update" });
    }

    const updatedDoctors = await Doctor.aggregate(doctorWithDepartmentAndSpecialitiesLookup(filter));

    res.json({ success: true, message: "Doctor updated successfully", data: updatedDoctors[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// DELETE /doctors
exports.deleteDoctors = async (req, res) => {
  try {
    let filter = {};
    if (req.params.ids) {
      const ids = req.params.ids.split(",").map((id) => Number(id.trim())).filter((id) => !isNaN(id));
      filter = { doctorID: { $in: ids } };
    } else if (req.query.doctorID) {
      filter = { doctorID: Number(req.query.doctorID) };
    } else if (req.body.filter) {
      filter = req.body.filter;
    } else {
      return res.status(400).json({ success: false, error: "No filter provided." });
    }

    const toDelete = await Doctor.aggregate(doctorWithDepartmentAndSpecialitiesLookup(filter));
    if (toDelete.length === 0) {
      return res.status(404).json({ success: false, message: "No doctors found" });
    }

    const result = await Doctor.deleteMany(filter);

    res.json({
      success: true,
      message: result.deletedCount === 1 ? "Doctor deleted successfully" : "Doctors deleted successfully",
      deletedCount: result.deletedCount,
      data: toDelete,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
