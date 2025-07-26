const Patient = require('../models/Patients');
const getNextSequence = require('../utils/getNextSequence');

// Utility to build filter from query
const buildPatientFilter = (query) => {
  const filter = {};
  const exactMatchFields = ['gender', 'patientID'];

  for (const key in query) {
    const value = query[key];

    if (!value) continue;

    if (!isNaN(value)) {
      filter[key] = Number(value);
    } else if (exactMatchFields.includes(key)) {
      filter[key] = { $regex: `^${value}$`, $options: 'i' };
    } else {
      filter[key] = { $regex: value, $options: 'i' };
    }
  }

  return filter;
};

// GET: Fetch patients with optional filters
exports.getPatients = async (req, res) => {
  try {
    const filter = buildPatientFilter(req.query);
    const patients = await Patient.find(filter);

    if (patients.length === 0) {
      return res.status(404).json({ message: 'No matching patients found' });
    }

    return res.json(patients.length === 1 ? patients[0] : patients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET: Fetch patient by patientID
exports.getPatientById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const patient = await Patient.findOne({ patientID: id });
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    return res.json(patient);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST: Add single or multiple patients with auto-incremented patientID
exports.addPatient = async (req, res) => {
  try {
    const payload = req.body;

    // Helper to get next patientID
    const getNextPatientID = async () => {
      return await getNextSequence('patientID');
    };

    // Helper to check for existing email
    const emailExists = async (email) => {
      return await Patient.exists({ email });
    };

    if (!Array.isArray(payload)) {
      if (await emailExists(payload.email)) {
        return res.status(409).json({ error: 'A patient with this email already exists.' });
      }
      if (!payload.patientID) {
        payload.patientID = await getNextPatientID();
      }
      const newPatient = new Patient(payload);
      const saved = await newPatient.save();
      return res.status(201).json(saved);
    }

    // For bulk insert, check for duplicate emails in DB and in payload
    const emails = payload.map(pat => pat.email);
    const existingPatients = await Patient.find({ email: { $in: emails } }, { email: 1 });
    const existingEmails = new Set(existingPatients.map(pat => pat.email));
    const duplicateEmails = emails.filter((email, idx) => emails.indexOf(email) !== idx);
    const errors = [];
    const patientsToInsert = [];
    for (const pat of payload) {
      if (existingEmails.has(pat.email)) {
        errors.push({ email: pat.email, error: 'Email already exists in database.' });
        continue;
      }
      if (duplicateEmails.includes(pat.email)) {
        errors.push({ email: pat.email, error: 'Duplicate email in request payload.' });
        continue;
      }
      if (!pat.patientID) {
        pat.patientID = await getNextPatientID();
      }
      patientsToInsert.push(pat);
    }

    if (patientsToInsert.length === 0) {
      return res.status(409).json({ error: 'No patients inserted due to duplicate emails.', details: errors });
    }

    const inserted = await Patient.insertMany(patientsToInsert);
    let response = { inserted };
    if (errors.length > 0) {
      response.errors = errors;
    }
    res.status(errors.length > 0 ? 207 : 201).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST: Upload patient profile image
exports.uploadPatientImage = async (req, res) => {
  try {
    const { patientID } = req.body;
    if (!patientID) {
      return res.status(400).json({ error: 'patientID is required' });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const imagePath = req.file.path;
    const updatedPatient = await Patient.findOneAndUpdate(
      { patientID: Number(patientID) },
      { profilePicture: imagePath },
      { new: true }
    );
    if (!updatedPatient) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    res.json({ message: 'Profile image uploaded', patient: updatedPatient });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT: Bulk update
exports.bulkUpdatePatients = async (req, res) => {
  const { filter, updateFields, updates } = req.body;

  try {
    if (filter && updateFields) {
      const result = await Patient.updateMany(filter, { $set: updateFields });
      return res.json({ message: 'Patients updated', modifiedCount: result.modifiedCount });
    } else if (Array.isArray(updates)) {
      const bulkOps = updates.map(pat => ({
        updateOne: { filter: pat.filter, update: { $set: pat.updateFields } }
      }));
      const result = await Patient.bulkWrite(bulkOps);
      return res.json({ message: 'Patients updated (variant)', modifiedCount: result.modifiedCount });
    } else {
      return res.status(400).json({ error: 'Invalid update structure' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT: Update by query (single or multiple)
exports.updatePatient = async (req, res) => {
  const filter = req.query;
  const updateData = req.body;

  if (!Object.keys(filter).length) return res.status(400).json({ error: 'No filter provided' });
  if (!Object.keys(updateData).length) return res.status(400).json({ error: 'No update data provided' });

  try {
    const result = await Patient.updateMany(filter, { $set: updateData });
    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: 'No matching patients found to update' });
    }

    const updated = await Patient.find(filter);
    return res.json({
      message: 'Patient(s) updated',
      updatedCount: result.modifiedCount,
      updatedPatients: updated.length === 1 ? updated[0] : updated
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE: Single patient by patientID
exports.deletePatientById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const deleted = await Patient.findOneAndDelete({ patientID: id });

    if (!deleted) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    return res.json({ message: 'Patient deleted', patient: deleted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE: Multiple patients by filter
exports.deletePatientsByFilter = async (req, res) => {
  try {
    const { filter } = req.body;

    if (!filter || typeof filter !== 'object') {
      return res.status(400).json({ error: 'Provide valid filter' });
    }

    const result = await Patient.deleteMany(filter);
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'No patients matched filter' });
    }

    return res.json({ message: 'Patients deleted', deletedCount: result.deletedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE: Bulk delete patients by comma-separated IDs in path
exports.bulkDeletePatientsByIds = async (req, res) => {
  try {
    const idsParam = req.params.ids;
    if (!idsParam) {
      return res.status(400).json({ error: 'No IDs provided' });
    }
    const ids = idsParam.split(',').map(id => Number(id.trim())).filter(id => !isNaN(id));
    if (ids.length === 0) {
      return res.status(400).json({ error: 'No valid IDs provided' });
    }
    const result = await Patient.deleteMany({ patientID: { $in: ids } });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'No patients found for provided IDs' });
    }
    res.json({ message: 'Patients deleted', deletedCount: result.deletedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 