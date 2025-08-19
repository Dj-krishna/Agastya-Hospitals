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

// GET all/bulk/filter
exports.getPatients = async (req, res) => {
  try {
    const filter = buildPatientFilter(req.query);
    const patients = await Patient.find(filter);

    if (!patients || patients.length === 0) return res.json([]);

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

    res.json(enriched);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET by patientID
exports.getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findOne({ patientID: Number(req.params.id) });
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    const [doctor, packages] = await Promise.all([
      Doctor.findOne({ doctorID: patient.doctorID }, { fullName: 1, _id: 0 }),
      Array.isArray(patient.packageIDs) && patient.packageIDs.length
        ? HealthPackage.find(
            { packageID: { $in: patient.packageIDs } },
            { packageID: 1, packageName: 1, _id: 0 }
          )
        : Promise.resolve([])
    ]);

    const packageMap = new Map(packages.map(pk => [pk.packageID, pk.packageName]));

    res.json({
      ...patient.toObject(),
      doctorName: doctor?.fullName,
      packageNames: Array.isArray(patient.packageIDs)
        ? patient.packageIDs.map(id => packageMap.get(id)).filter(Boolean)
        : []
    });
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

// DELETE by ID
exports.deletePatientById = async (req, res) => {
  try {
    const deleted = await Patient.findOneAndDelete({ patientID: Number(req.params.id) });
    if (!deleted)
      return res.status(404).json({ message: 'Patient not found' });
    res.json({ message: 'Patient deleted', patient: deleted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE by filter
exports.deletePatientsByFilter = async (req, res) => {
  try {
    const { filter } = req.body;
    if (!filter || typeof filter !== 'object')
      return res.status(400).json({ error: 'Provide valid filter' });
    const result = await Patient.deleteMany(filter);
    if (result.deletedCount === 0)
      return res.status(404).json({ message: 'No patients matched filter' });
    res.json({ message: 'Patients deleted', deletedCount: result.deletedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// BULK DELETE by IDs
exports.bulkDeletePatientsByIds = async (req, res) => {
  try {
    const idsParam = req.params.ids;
    if (!idsParam)
      return res.status(400).json({ error: 'No IDs provided' });
    const ids = idsParam.split(',').map(id => Number(id.trim())).filter(id => !isNaN(id));
    if (ids.length === 0)
      return res.status(400).json({ error: 'No valid IDs provided' });
    const result = await Patient.deleteMany({ patientID: { $in: ids } });
    if (result.deletedCount === 0)
      return res.status(404).json({ message: 'No patients found for provided IDs' });
    res.json({ message: 'Patients deleted', deletedCount: result.deletedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
