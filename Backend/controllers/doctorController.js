// Import the Doctor model
const Doctor = require('../models/Doctors');
const getNextSequence = require('../utils/getNextSequence');

// Utility to build MongoDB filter from request query parameters
const buildDoctorFilter = (query) => {
  const filter = {};
  const exactMatchFields = ['gender', 'doctorID'];

  for (const key in query) {
    const value = query[key];
    if (!value) continue;

    if (!isNaN(value)) {
      filter[key] = Number(value); // convert numeric fields like doctorID
    } else if (exactMatchFields.includes(key)) {
      filter[key] = { $regex: `^${value}$`, $options: 'i' }; // exact match with case-insensitive
    } else if (['speciality', 'languagesKnown', 'servicesOffered'].includes(key)) {
      filter[key] = { $elemMatch: { $regex: value, $options: 'i' } }; // match array elements
    } else {
      filter[key] = { $regex: value, $options: 'i' }; // general partial string match
    }
  }
  return filter;
};

// Get doctors with optional query filter
exports.getDoctors = async (req, res) => {
  try {
    const filter = buildDoctorFilter(req.query);
    const doctors = await Doctor.find(filter);
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get doctor by unique doctorID
exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ doctorID: req.params.id });
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.status(200).json(doctor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add new doctor
exports.addDoctor = async (req, res) => {
  try {
    const payload = req.body;

    // Helper to get next doctorID
    const getNextDoctorID = async () => {
      return await getNextSequence('doctorID');
    };

    // Helper to check for existing email
    const emailExists = async (email) => {
      return await Doctor.exists({ email });
    };

    // Function to normalize fields
    const normalizeFields = (doc) => {
      if (!Array.isArray(doc.languagesKnown) && doc.languagesKnown)
        doc.languagesKnown = doc.languagesKnown.split(',').map(s => s.trim());

      if (!Array.isArray(doc.servicesOffered) && doc.servicesOffered)
        doc.servicesOffered = doc.servicesOffered.split(',').map(s => s.trim());

      if (!Array.isArray(doc.educationQualifications) && doc.educationQualifications)
        doc.educationQualifications = doc.educationQualifications.split(',').map(s => s.trim());

      if (!Array.isArray(doc.opTimings) && doc.opTimings)
        doc.opTimings = doc.opTimings.split(',').map(s => s.trim());

      return doc;
    };

    // Single doctor insert
    if (!Array.isArray(payload)) {
      if (await emailExists(payload.email)) {
        return res.status(409).json({ error: 'A doctor with this email already exists.' });
      }
      if (!payload.doctorID) {
        payload.doctorID = await getNextDoctorID();
      }
      const normalized = normalizeFields(payload);
      const newDoctor = new Doctor(normalized);
      const saved = await newDoctor.save();
      return res.status(201).json(saved);
    }

    // Bulk insert
    const emails = payload.map(doc => doc.email);
    const existingDoctors = await Doctor.find({ email: { $in: emails } }, { email: 1 });
    const existingEmails = new Set(existingDoctors.map(doc => doc.email));
    const duplicateEmails = emails.filter((email, idx) => emails.indexOf(email) !== idx);
    const errors = [];
    const doctorsToInsert = [];

    for (const doc of payload) {
      if (existingEmails.has(doc.email)) {
        errors.push({ email: doc.email, error: 'Email already exists in database.' });
        continue;
      }
      if (duplicateEmails.includes(doc.email)) {
        errors.push({ email: doc.email, error: 'Duplicate email in request payload.' });
        continue;
      }
      if (!doc.doctorID) {
        doc.doctorID = await getNextDoctorID();
      }
      const normalized = normalizeFields(doc);
      doctorsToInsert.push(normalized);
    }

    if (doctorsToInsert.length === 0) {
      return res.status(409).json({
        error: 'No doctors inserted due to duplicate emails.',
        details: errors
      });
    }

    const inserted = await Doctor.insertMany(doctorsToInsert);
    let response = { inserted };
    if (errors.length > 0) {
      response.errors = errors;
    }

    res.status(errors.length > 0 ? 207 : 201).json(response);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// POST: Upload doctor profile image
exports.uploadDoctorImage = async (req, res) => {
  try {
    const { doctorID } = req.body;

    // Validate doctorID and file
    if (!doctorID) {
      return res.status(400).json({ error: 'doctorID is required' });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Build image path (assumes Multer destination is configured)
    const imagePath = req.file.path;

    // Update profile picture path in DB
    const updatedDoctor = await Doctor.findOneAndUpdate(
      { doctorID: Number(doctorID) },
      { profilePicture: imagePath },
      { new: true }
    );

    if (!updatedDoctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    res.json({ message: 'Profile image uploaded', doctor: updatedDoctor });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// PUT: Update doctors by query
exports.updateDoctor = async (req, res) => {
  const filter = req.query;
  const updateData = req.body;

  if (!Object.keys(filter).length) return res.status(400).json({ error: 'No filter provided' });
  if (!Object.keys(updateData).length) return res.status(400).json({ error: 'No update data provided' });

  // Normalize arrays
  if (!Array.isArray(updateData.languagesKnown)) {
    updateData.languagesKnown = updateData.languagesKnown?.split(',').map(lang => lang.trim());
  }
  if (!Array.isArray(updateData.servicesOffered)) {
    updateData.servicesOffered = updateData.servicesOffered?.split(',').map(service => service.trim());
  }
  if (!Array.isArray(updateData.educationQualification)) {
    updateData.educationQualification = updateData.educationQualification || [];
  }
  if (!Array.isArray(updateData.opTimings)) {
    updateData.opTimings = updateData.opTimings || [];
  }

  try {
    const result = await Doctor.updateMany(filter, { $set: updateData });
    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: 'No matching doctors found to update' });
    }

    const updatedDoctors = await Doctor.find(filter);
    return res.json({
      message: 'Doctor(s) updated',
      updatedCount: result.modifiedCount,
      updatedDoctors: updatedDoctors.length === 1 ? updatedDoctors[0] : updatedDoctors
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT: Bulk update doctors
exports.bulkUpdateDoctors = async (req, res) => {
  try {
    const { updates } = req.body;

    if (!Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({ error: 'No updates provided' });
    }

    // Get allowed fields from schema
    const allowedFields = Object.keys(Doctor.schema.paths);

    const results = [];
    const warnings = [];

    for (const update of updates) {
      const { filter, updateFields } = update;

      if (!filter || typeof filter !== 'object' || !updateFields || typeof updateFields !== 'object') {
        warnings.push({ filter, error: 'Invalid structure for update' });
        continue;
      }

      // Check for invalid fields
      const invalidFields = Object.keys(updateFields).filter(key => !allowedFields.includes(key));
      if (invalidFields.length > 0) {
        warnings.push({
          filter,
          warning: `Invalid fields: ${invalidFields.join(', ')}. Skipped update.`,
        });
        continue;
      }

      // Normalize fields
      if (updateFields.languagesKnown && !Array.isArray(updateFields.languagesKnown)) {
        updateFields.languagesKnown = updateFields.languagesKnown.split(',').map(l => l.trim());
      }
      if (updateFields.servicesOffered && !Array.isArray(updateFields.servicesOffered)) {
        updateFields.servicesOffered = updateFields.servicesOffered.split(',').map(s => s.trim());
      }

      const result = await Doctor.findOneAndUpdate(filter, { $set: updateFields }, { new: true });
      if (result) {
        results.push(result);
      } else {
        warnings.push({ filter, warning: 'Doctor not found' });
      }
    }

    res.json({ message: 'Bulk update completed', updated: results.length, results, warnings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// DELETE: Single doctor by doctorID
exports.deleteDoctorById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const deleted = await Doctor.findOneAndDelete({ doctorID: id });

    if (!deleted) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    return res.json({ message: 'Doctor deleted', doctor: deleted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE: Multiple doctors by filter
exports.deleteDoctorsByFilter = async (req, res) => {
  try {
    const { filter } = req.body;

    if (!filter || typeof filter !== 'object') {
      return res.status(400).json({ error: 'Provide valid filter' });
    }

    const result = await Doctor.deleteMany(filter);
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'No doctors matched filter' });
    }

    return res.json({ message: 'Doctors deleted', deletedCount: result.deletedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE: Bulk delete doctors by comma-separated IDs in path
exports.bulkDeleteDoctorsByIds = async (req, res) => {
  try {
    const idsParam = req.params.ids;
    if (!idsParam) {
      return res.status(400).json({ error: 'No IDs provided' });
    }
    const ids = idsParam.split(',').map(id => Number(id.trim())).filter(id => !isNaN(id));
    if (ids.length === 0) {
      return res.status(400).json({ error: 'No valid IDs provided' });
    }
    const result = await Doctor.deleteMany({ doctorID: { $in: ids } });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'No doctors found for provided IDs' });
    }
    res.json({ message: 'Doctors deleted', deletedCount: result.deletedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


