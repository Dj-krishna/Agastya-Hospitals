const Doctor = require('../models/Doctors');
const Department = require('../models/Departments');
const Speciality = require('../models/Specialities');
const getNextSequence = require('../utils/getNextSequence');

// 🔧 Build filter from request query
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
    } else if (['speciality', 'languagesKnown', 'servicesOffered'].includes(key)) {
      filter[key] = { $elemMatch: { $regex: value, $options: 'i' } };
    } else {
      filter[key] = { $regex: value, $options: 'i' };
    }
  }
  return filter;
};

// 🔍 Aggregation to join department
const doctorWithDepartmentAndSpecialitiesLookup = (match = {}) => [
  { $match: match },
  {
    $lookup: {
      from: 'departments',
      localField: 'departmentID',
      foreignField: 'departmentID',
      as: 'departmentData'
    }
  },
  { $unwind: { path: '$departmentData', preserveNullAndEmptyArrays: true } },
  {
    $lookup: {
      from: 'specialities',
      localField: 'speciality',
      foreignField: 'specialityID',
      as: 'specialityDetails'
    }
  },  
  {
    $addFields: {
      departmentName: '$departmentData.departmentName',
      specialityNames: {
        $cond: [
          { $isArray: '$specialityDetails' },
          { $map: { input: '$specialityDetails', as: 's', in: '$$s.specialityName' } },
          []
        ]
      }
    }
  },
  { $project: { departmentData: 0,  specialityDetails: 0 } }
];

// 🔁 Transform departmentID into { id: name }
const transformSpecialities = (doctor) => {
  if (Array.isArray(doctor.speciality) && Array.isArray(doctor.specialityNames)) {
    const mapped = {};
    doctor.speciality.forEach((id, idx) => {
      mapped[id] = doctor.specialityNames[idx] || 'Unknown';
    });
    doctor.speciality = mapped;
    delete doctor.specialityNames;
  }
  return doctor;
};

// GET /doctors
exports.getDoctors = async (req, res) => {
  try {
    const filter = buildDoctorFilter(req.query);
    const doctors = await Doctor.aggregate(doctorWithDepartmentAndSpecialitiesLookup(filter));
    if (doctors.length === 0) return res.status(404).json({ message: 'No doctors found.' });

    const transformed = doctors.map(transformSpecialities);
    res.json(transformed.length === 1 ? transformed[0] : transformed);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /doctors/:id
exports.getDoctorById = async (req, res) => {
  try {
    const doctorID = Number(req.params.id);
    const data = await Doctor.aggregate(doctorWithDepartmentAndSpecialitiesLookup({ doctorID }));
    if (data.length === 0) return res.status(404).json({ message: 'Doctor not found.' });

    const transformed = transformSpecialities(data[0]);
    res.json(transformed);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /doctors
exports.addDoctor = async (req, res) => {
  try {
    const payload = req.body;
    const getNextDoctorID = async () => await getNextSequence('doctorID');
    const emailExists = async (email) => await Doctor.exists({ email });

    const normalizeFields = (doc) => {
      const fieldsToNormalize = ['languagesKnown', 'servicesOffered', 'educationQualifications', 'opTimings'];
      fieldsToNormalize.forEach(field => {
        if (!Array.isArray(doc[field]) && doc[field]) {
          doc[field] = doc[field].split(',').map(s => s.trim());
        }
      });
      return doc;
    };

    if (!Array.isArray(payload)) {
      if (await emailExists(payload.email)) {
        return res.status(409).json({ error: 'A doctor with this email already exists.' });
      }
      if (!payload.doctorID) payload.doctorID = await getNextDoctorID();
      const normalized = normalizeFields(payload);
      const saved = await new Doctor(normalized).save();

      const enriched = await Doctor.aggregate(doctorWithDepartmentAndSpecialitiesLookup({ doctorID: saved.doctorID }));
      return res.status(201).json(transformSpecialities(enriched[0]));
    }

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
      if (!doc.doctorID) doc.doctorID = await getNextDoctorID();
      const normalized = normalizeFields(doc);
      doctorsToInsert.push(normalized);
    }

    if (doctorsToInsert.length === 0) {
      return res.status(409).json({ error: 'No doctors inserted', details: errors });
    }

    const inserted = await Doctor.insertMany(doctorsToInsert);
    const ids = inserted.map(doc => doc.doctorID);
    const enriched = await Doctor.aggregate(doctorWithDepartmentAndSpecialitiesLookup({ doctorID: { $in: ids } }));
    const transformed = enriched.map(transformSpecialities);

    let response = { inserted: transformed };
    if (errors.length > 0) response.errors = errors;

    res.status(errors.length > 0 ? 207 : 201).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PROFILE PICTURE UPLOAD
exports.uploadDoctorImage = async (req, res) => {
  try {
    const { doctorID } = req.body;

    if (!doctorID) return res.status(400).json({ error: 'doctorID is required' });
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const imagePath = req.file.path;

    const updatedDoctor = await Doctor.findOneAndUpdate(
      { doctorID: Number(doctorID) },
      { profilePicture: imagePath },
      { new: true }
    );

    if (!updatedDoctor) return res.status(404).json({ error: 'Doctor not found' });

    res.json({ message: 'Profile image uploaded', doctor: updatedDoctor });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// PUT /doctors
exports.updateDoctor = async (req, res) => {
  const filter = req.query;
  const updateData = req.body;

  if (!Object.keys(filter).length) return res.status(400).json({ error: 'No filter provided' });
  if (!Object.keys(updateData).length) return res.status(400).json({ error: 'No update data provided' });

  const normalize = (obj) => {
    ['languagesKnown', 'servicesOffered'].forEach(key => {
      if (!Array.isArray(obj[key]) && typeof obj[key] === 'string') {
        obj[key] = obj[key].split(',').map(v => v.trim());
      }
    });
    return obj;
  };

  try {
    normalize(updateData);
    const result = await Doctor.updateMany(filter, { $set: updateData });

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: 'No matching doctors found to update' });
    }

    const updated = await Doctor.aggregate(doctorWithDepartmentAndSpecialitiesLookup(buildDoctorFilter(filter)));
    const transformed = updated.map(transformSpecialities);

    return res.json({
      message: 'Doctor(s) updated',
      updatedCount: result.modifiedCount,
      updatedDoctors: transformed
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT /doctors/bulk
exports.bulkUpdateDoctors = async (req, res) => {
  try {
    const { updates } = req.body;
    if (!Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({ error: 'No updates provided' });
    }

    const allowedFields = Object.keys(Doctor.schema.paths);
    const results = [];
    const warnings = [];

    for (const update of updates) {
      const { filter, updateFields } = update;
      if (!filter || !updateFields) {
        warnings.push({ filter, error: 'Invalid update format' });
        continue;
      }

      const invalid = Object.keys(updateFields).filter(f => !allowedFields.includes(f));
      if (invalid.length > 0) {
        warnings.push({ filter, warning: `Invalid fields: ${invalid.join(', ')}` });
        continue;
      }

      ['languagesKnown', 'servicesOffered'].forEach(field => {
        if (updateFields[field] && !Array.isArray(updateFields[field])) {
          updateFields[field] = updateFields[field].split(',').map(f => f.trim());
        }
      });

      const result = await Doctor.findOneAndUpdate(filter, { $set: updateFields }, { new: true });
      if (result) {
        const enriched = await Doctor.aggregate(doctorWithDepartmentAndSpecialitiesLookup({ doctorID: result.doctorID }));
        results.push(transformSpecialities(enriched[0]));
      } else {
        warnings.push({ filter, warning: 'Doctor not found' });
      }
    }

    res.json({ message: 'Bulk update complete', updated: results.length, results, warnings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE by ID
exports.deleteDoctorById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const deleted = await Doctor.findOneAndDelete({ doctorID: id });

    if (!deleted) return res.status(404).json({ message: 'Doctor not found' });

    const enriched = await Doctor.aggregate(doctorWithDepartmentAndSpecialitiesLookup({ doctorID: id }));
    res.json({ message: 'Doctor deleted', doctor: transformSpecialities(enriched[0] || deleted) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE by filter
exports.deleteDoctorsByFilter = async (req, res) => {
  try {
    const { filter } = req.body;
    if (!filter || typeof filter !== 'object') {
      return res.status(400).json({ error: 'Provide valid filter' });
    }

    const toDelete = await Doctor.aggregate(doctorWithDepartmentAndSpecialitiesLookup(filter));
    const result = await Doctor.deleteMany(filter);

    if (result.deletedCount === 0) return res.status(404).json({ message: 'No doctors matched filter' });

    res.json({
      message: 'Doctors deleted',
      deletedCount: result.deletedCount,
      deletedDoctors: toDelete.map(transformSpecialities)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /doctors/bulk/:ids
exports.bulkDeleteDoctorsByIds = async (req, res) => {
  try {
    const ids = req.params.ids.split(',').map(id => Number(id.trim())).filter(id => !isNaN(id));
    if (ids.length === 0) return res.status(400).json({ error: 'No valid IDs provided' });

    const toDelete = await Doctor.aggregate(doctorWithDepartmentAndSpecialitiesLookup({ doctorID: { $in: ids } }));
    const result = await Doctor.deleteMany({ doctorID: { $in: ids } });

    if (result.deletedCount === 0) return res.status(404).json({ message: 'No doctors found for provided IDs' });

    res.json({
      message: 'Doctors deleted',
      deletedCount: result.deletedCount,
      deletedDoctors: toDelete.map(transformSpecialities)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
