const Patient = require('../models/Patients');
const Doctor = require('../models/Doctors');
const HealthPackage = require('../models/HealthPackages');
const getNextSequence = require('../utils/getNextSequence');

// 🔧 Build filter from query
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

// 🔍 GET patients (single/bulk/filter)
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

    const enriched = patients.map(p => {
      const obj = p.toObject();
      return {
        ...obj,
        doctorName: doctorMap.get(p.doctorID),
        packageNames: Array.isArray(p.packageIDs)
          ? p.packageIDs.map(id => packageMap.get(id)).filter(Boolean)
          : [],
        UHID: `AHA${p.patientID}`
      };
    });

    if (req.query.patientID) {
      res.json(enriched[0]);
    } else {
      res.json(enriched);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ------------------ VERIFY PATIENT ------------------
exports.verifyPatient = async (req, res) => {
  try {
    const { mobile } = req.body;
    if (!mobile) return res.status(400).json({ error: "mobile is required" });

    const patient = await Patient.findOne({ mobile });
    if (patient) {
      return res.json({
        flag: 1,
        patient: {
          patientID: patient.patientID,
          fullName: patient.fullName,
          mobile: patient.mobile,
          email: patient.email,
          dob: patient.dob,
          gender: patient.gender,
          address: patient.address,
          countryCode: patient.countryCode,
          profilePicture: patient.profilePicture || null,
          profileImageGfs: patient.profileImageGfs || []
        }
      });
    } else {
      return res.json({ flag: 0 });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🟢 ADD patient (single/bulk) + ImageKit
// 🟢 ADD patient (single/bulk) + ImageKit + form-data friendly
exports.addPatient = async (req, res) => {
  try {
    // Merge form-data fields with body
    let payload = { ...req.body };

    // If packageIDs sent as string, convert to array
    if (payload.packageIDs && typeof payload.packageIDs === 'string') {
      payload.packageIDs = payload.packageIDs.split(',').map(Number);
    }

    const getNextPatientID = async () => await getNextSequence('patientID');
    const emailExists = async (email) => await Patient.exists({ email });

    // Handle ImageKit files
    if (req.files) {
      if (req.files.profilePicture) payload.profilePicture = req.files.profilePicture[0].url;
      if (req.files.profileImageGfs) payload.profileImageGfs = req.files.profileImageGfs.map(f => f.url);
    }

    // Single insert
    if (!Array.isArray(payload)) {
      if (await emailExists(payload.email)) {
        return res.status(409).json({ error: 'A patient with this email already exists.' });
      }

      if (!payload.patientID) payload.patientID = await getNextPatientID();
      payload.UHID = `AHA${payload.patientID}`;

      const saved = await new Patient(payload).save();
      return res.status(201).json(saved);
    }

    // Bulk insert (if payload is array)
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

      if (!doc.patientID) doc.patientID = await getNextPatientID();
      doc.UHID = `AHA${doc.patientID}`;

      // Handle ImageKit files for bulk items if sent in form-data arrays (optional)
      if (req.files) {
        if (doc.profilePicture) doc.profilePicture = doc.profilePicture;
        if (doc.profileImageGfs) doc.profileImageGfs = doc.profileImageGfs;
      }

      // Normalize packageIDs if string
      if (doc.packageIDs && typeof doc.packageIDs === 'string') {
        doc.packageIDs = doc.packageIDs.split(',').map(Number);
      }

      patientsToInsert.push(doc);
    }

    if (patientsToInsert.length === 0) {
      return res.status(409).json({ error: 'No patients inserted', details: errors });
    }

    const inserted = await Patient.insertMany(patientsToInsert);
    let response = { inserted };
    if (errors.length > 0) response.errors = errors;
    res.status(errors.length > 0 ? 207 : 201).json(response);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🟢 UPDATE patient by filter + ImageKit + form-data friendly
exports.updatePatient = async (req, res) => {
  try {
    const filter = buildPatientFilter(req.query);
    if (!Object.keys(filter).length) return res.status(400).json({ error: 'No filter provided' });

    // Merge form-data fields with files
    const updateData = { ...req.body };

    // Normalize packageIDs if string
    if (updateData.packageIDs && typeof updateData.packageIDs === 'string') {
      updateData.packageIDs = updateData.packageIDs.split(',').map(Number);
    }

    // Handle ImageKit uploads
    if (req.files) {
      if (req.files.profilePicture) updateData.profilePicture = req.files.profilePicture[0].url;
      if (req.files.profileImageGfs) {
        const existing = Array.isArray(updateData.profileImageGfs) ? updateData.profileImageGfs : [];
        updateData.profileImageGfs = existing.concat(req.files.profileImageGfs.map(f => f.url));
      }
    }

    if (!Object.keys(updateData).length) return res.status(400).json({ error: 'No update data provided' });

    const result = await Patient.updateMany(filter, { $set: updateData });
    if (result.modifiedCount === 0) return res.status(404).json({ message: 'No matching patients found to update' });

    const updatedPatients = await Patient.find(filter);
    res.json({
      message: 'Patient(s) updated',
      updatedCount: result.modifiedCount,
      updatedPatients: updatedPatients.length === 1 ? updatedPatients[0] : updatedPatients
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// 🟢 DELETE patients (same as before)
exports.deletePatients = async (req, res) => {
  try {
    let filter = {};

    if (req.params.ids) {
      const ids = req.params.ids.split(',').map(id => Number(id.trim())).filter(id => !isNaN(id));
      if (!ids.length) return res.status(400).json({ error: 'No valid IDs provided' });
      filter = { patientID: { $in: ids } };
    } else if (req.query.patientID) {
      filter = { patientID: Number(req.query.patientID) };
    } else if (Object.keys(req.query).length > 0) {
      filter = buildPatientFilter(req.query);
    } else if (req.body.filter) {
      if (typeof req.body.filter !== 'object') return res.status(400).json({ error: 'Provide valid filter' });
      filter = req.body.filter;
    } else {
      return res.status(400).json({ error: 'No filter provided. Use query params, body filter, or /bulk/:ids' });
    }

    const toDelete = await Patient.find(filter);
    if (!toDelete.length) return res.status(404).json({ message: 'No patients found matching the criteria' });

    const result = await Patient.deleteMany(filter);
    if (result.deletedCount === 0) return res.status(404).json({ message: 'No patients were deleted' });

    if (req.query.patientID) {
      res.json({ message: 'Patient deleted', patient: toDelete[0] });
    } else {
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
