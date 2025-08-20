const Patient = require('../models/Patients');
const Doctor = require('../models/Doctors');
const HealthPackage = require('../models/HealthPackages');
const getNextSequence = require('../utils/getNextSequence');

// Build filter from req.query
const buildPatientFilter = (query) => {
  const filter = {};
  for (const key in query) {
    let value = query[key];
    if (!value) continue;

    if (['patientID', 'doctorID'].includes(key)) {
      filter[key] = Number(value);
    } else if (['packageIDs'].includes(key)) {
      filter[key] = { $in: value.split(',').map(Number) };
    } else if (key === 'dob') {
      filter[key] = new Date(value);
    } else if (['gender', 'email', 'mobile', 'fullName'].includes(key)) {
      filter[key] = { $regex: value, $options: 'i' };
    }
  }
  return filter;
};

// GET all/bulk/filter (handles all cases including by ID)
exports.getPatients = async (req, res) => {
  try {
    const filter = buildPatientFilter(req.query);
    const patients = await Patient.find(filter);

    if (!patients || patients.length === 0) {
      return res.status(404).json({ message: 'No patients found.' });
    }

    const doctorIDs = [...new Set(patients.map(p => p.doctorID).filter(Boolean))];
    const doctors = await Doctor.find(
      { doctorID: { $in: doctorIDs } },
      { doctorID: 1, fullName: 1, _id: 0 }
    );
    const doctorMap = new Map(doctors.map(d => [d.doctorID, d.fullName]));

    const packageIDs = [...new Set(
      patients.flatMap(p => Array.isArray(p.packageIDs) ? p.packageIDs : []).filter(id => typeof id === 'number')
    )];
    const packages = packageIDs.length
      ? await HealthPackage.find({ packageID: { $in: packageIDs } }, { packageID: 1, packageName: 1, _id: 0 })
      : [];
    const packageMap = new Map(packages.map(pk => [pk.packageID, pk.packageName]));

    const enriched = patients.map(p => ({
      ...p.toObject(),
      doctorName: doctorMap.get(p.doctorID),
      packageNames: Array.isArray(p.packageIDs)
        ? p.packageIDs.map(id => packageMap.get(id)).filter(Boolean)
        : []
    }));

    // If filtering by patientID, return single object, otherwise return array
    if (req.query.patientID) {
      res.json(enriched[0]);
    } else {
      res.json(enriched);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ADD (single or bulk)
exports.addPatient = async (req, res) => {
  try {
    const payload = req.body;

    const getNextPatientID = async () => await getNextSequence('patientID');

    const emailExists = async (email) => await Patient.exists({ email });

    // Single insert
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

    // Bulk insert
    const emails = payload.map(doc => doc.email);
    const existingPatients = await Patient.find({ email: { $in: emails } }, { email: 1 });
    const existingEmails = new Set(existingPatients.map(doc => doc.email));
    const duplicateEmails = emails.filter((email, idx) => emails.indexOf(email) !== idx);
    const errors = [];
    const patientsToInsert = [];

    for (const doc of payload) {
      if (existingEmails.has(doc.email)) {
        errors.push({ email: doc.email, error: 'Email already exists in database.' });
        continue;
      }
      if (duplicateEmails.includes(doc.email)) {
        errors.push({ email: doc.email, error: 'Duplicate email in request payload.' });
        continue;
      }
      if (!doc.patientID) {
        doc.patientID = await getNextPatientID();
      }
      patientsToInsert.push(doc);
    }

    if (patientsToInsert.length === 0) {
      return res.status(409).json({
        error: 'No patients inserted due to duplicate emails.',
        details: errors
      });
    }

    const inserted = await Patient.insertMany(patientsToInsert);
    let response = { inserted };
    if (errors.length > 0) response.errors = errors;
    res.status(errors.length > 0 ? 207 : 201).json(response);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PROFILE PICTURE UPLOAD
exports.uploadPatientImage = async (req, res) => {
  try {
    const { patientID } = req.body;

    if (!patientID) return res.status(400).json({ error: 'patientID is required' });
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const imagePath = req.file.path;

    const updatedPatient = await Patient.findOneAndUpdate(
      { patientID: Number(patientID) },
      { profilePicture: imagePath },
      { new: true }
    );

    if (!updatedPatient) return res.status(404).json({ error: 'Patient not found' });
    res.json({ message: 'Profile image uploaded', patient: updatedPatient });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE by filter (can update arrays/fields)
exports.updatePatient = async (req, res) => {
  const filter = req.query;
  const updateData = req.body;

  if (!Object.keys(filter).length)
    return res.status(400).json({ error: 'No filter provided' });
  if (!Object.keys(updateData).length)
    return res.status(400).json({ error: 'No update data provided' });

  try {
    const result = await Patient.updateMany(filter, { $set: updateData });
    if (result.modifiedCount === 0)
      return res.status(404).json({ message: 'No matching patients found to update' });

    const updatedPatients = await Patient.find(filter);
    return res.json({
      message: 'Patient(s) updated',
      updatedCount: result.modifiedCount,
      updatedPatients: updatedPatients.length === 1 ? updatedPatients[0] : updatedPatients
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// bulkUpdatePatients: removed per requirement

// DELETE patients (handles all cases: by ID, by filter, bulk by IDs)
exports.deletePatients = async (req, res) => {
  try {
    let filter = {};

    // Handle different delete scenarios
    if (req.params.ids) {
      // Bulk delete by comma-separated IDs
      const ids = req.params.ids.split(',').map(id => Number(id.trim())).filter(id => !isNaN(id));
      if (!ids.length) return res.status(400).json({ error: 'No valid IDs provided' });
      filter = { patientID: { $in: ids } };
    } else if (req.query.patientID) {
      // Delete single patient by ID
      filter = { patientID: Number(req.query.patientID) };
    } else if (Object.keys(req.query).length > 0) {
      // Delete by query parameters
      filter = buildPatientFilter(req.query);
    } else if (req.body.filter) {
      // Delete by filter from request body
      if (typeof req.body.filter !== 'object') return res.status(400).json({ error: 'Provide valid filter' });
      filter = req.body.filter;
    } else {
      return res.status(400).json({ error: 'No filter provided. Use query params, body filter, or /bulk/:ids' });
    }

    // Get patients to delete (for response)
    const toDelete = await Patient.find(filter);
    if (!toDelete.length) return res.status(404).json({ message: 'No patients found matching the criteria' });

    // Perform deletion
    const result = await Patient.deleteMany(filter);
    if (result.deletedCount === 0) return res.status(404).json({ message: 'No patients were deleted' });

    // Return appropriate response
    if (req.query.patientID) {
      // Single patient deleted
      res.json({ message: 'Patient deleted', patient: toDelete[0] });
    } else {
      // Multiple patients deleted
      res.json({ 
        message: 'Patients deleted', 
        deletedCount: result.deletedCount,
        deletedPatients: toDelete
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
