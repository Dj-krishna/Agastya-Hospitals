const Doctor = require('../models/Doctors');
const getNextSequence = require('../utils/getNextSequence');

// Utility to build filter from query
const buildDoctorFilter = (query) => {
  const filter = {};
  const exactMatchFields = ['gender', 'doctorID'];

  for (const key in query) {
    const value = query[key];

    if (!value) continue;

    if (!isNaN(value)) {
      filter[key] = Number(value);
    } else if (exactMatchFields.includes(key)) {
      filter[key] = { $regex: `^${value}$`, $options: 'i' };
    } else if (key === 'specialty') {
      filter[key] = { $elemMatch: { $regex: value, $options: 'i' } };
    } else {
      filter[key] = { $regex: value, $options: 'i' };
    }
  }

  return filter;
};

// GET: Fetch doctors with optional filters
exports.getDoctors = async (req, res) => {
  try {
    const filter = buildDoctorFilter(req.query);
    const doctors = await Doctor.find(filter);

    if (doctors.length === 0) {
      return res.status(404).json({ message: 'No matching doctors found' });
    }

    return res.json(doctors.length === 1 ? doctors[0] : doctors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST: Add single or multiple doctors with auto-incremented doctorID
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

    if (!Array.isArray(payload)) {
      if (await emailExists(payload.email)) {
        return res.status(409).json({ error: 'A doctor with this email already exists.' });
      }
      if (!payload.doctorID) {
        payload.doctorID = await getNextDoctorID();
      }
      const newDoctor = new Doctor(payload);
      const saved = await newDoctor.save();
      return res.status(201).json(saved);
    }

    // For bulk insert, check for duplicate emails in DB and in payload
    const emails = payload.map(doc => doc.email);
    const existingDocs = await Doctor.find({ email: { $in: emails } }, { email: 1 });
    const existingEmails = new Set(existingDocs.map(doc => doc.email));
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
      doctorsToInsert.push(doc);
    }

    if (doctorsToInsert.length === 0) {
      return res.status(409).json({ error: 'No doctors inserted due to duplicate emails.', details: errors });
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
    if (!doctorID) {
      return res.status(400).json({ error: 'doctorID is required' });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const imagePath = req.file.path;
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

// PUT: Bulk update
exports.bulkUpdateDoctors = async (req, res) => {
  const { filter, updateFields, updates } = req.body;

  try {
    if (filter && updateFields) {
      const result = await Doctor.updateMany(filter, { $set: updateFields });
      return res.json({ message: 'Doctors updated', modifiedCount: result.modifiedCount });
    } else if (Array.isArray(updates)) {
      const bulkOps = updates.map(doc => ({
        updateOne: { filter: doc.filter, update: { $set: doc.updateFields } }
      }));
      const result = await Doctor.bulkWrite(bulkOps);
      return res.json({ message: 'Doctors updated (variant)', modifiedCount: result.modifiedCount });
    } else {
      return res.status(400).json({ error: 'Invalid update structure' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT: Update by query (single or multiple)
exports.updateDoctor = async (req, res) => {
  const filter = req.query;
  const updateData = req.body;

  if (!Object.keys(filter).length) return res.status(400).json({ error: 'No filter provided' });
  if (!Object.keys(updateData).length) return res.status(400).json({ error: 'No update data provided' });

  try {
    const result = await Doctor.updateMany(filter, { $set: updateData });
    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: 'No matching doctors found to update' });
    }

    const updated = await Doctor.find(filter);
    return res.json({
      message: 'Doctor(s) updated',
      updatedCount: result.modifiedCount,
      updatedDoctors: updated.length === 1 ? updated[0] : updated
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
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

// GET: Fetch doctor by doctorID
exports.getDoctorById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const doctor = await Doctor.findOne({ doctorID: id });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    return res.json(doctor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 