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

// 🔍 Aggregation to join department and specialities
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
  { $project: { departmentData: 0, specialityDetails: 0 } }
];

// 🔁 Transform speciality array to { id: name }
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

// 🟢 GET /doctors
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

// 🟢 GET /doctors/:id
exports.getDoctorById = async (req, res) => {
  try {
    const doctorID = Number(req.params.id);
    const data = await Doctor.aggregate(doctorWithDepartmentAndSpecialitiesLookup({ doctorID }));
    if (data.length === 0) return res.status(404).json({ message: 'Doctor not found.' });

    res.json(transformSpecialities(data[0]));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🟢 POST /doctors
exports.addDoctor = async (req, res) => {
  try {
    const payload = req.body;
    const getNextDoctorID = async () => await getNextSequence('doctorID');

    const normalizeFields = (doc) => {
      ['languagesKnown', 'servicesOffered', 'educationQualification', 'opTimings'].forEach(field => {
        if (!Array.isArray(doc[field]) && doc[field]) {
          doc[field] = doc[field].split(',').map(s => s.trim());
        }
      });
      return doc;
    };

    const emailExists = async (email) => await Doctor.exists({ email });

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

    // Bulk insert
    const emails = payload.map(doc => doc.email);
    const existingDoctors = await Doctor.find({ email: { $in: emails } }, { email: 1 });
    const existingEmails = new Set(existingDoctors.map(doc => doc.email));
    const duplicateEmails = emails.filter((email, idx) => emails.indexOf(email) !== idx);

    const errors = [];
    const doctorsToInsert = [];

    for (const doc of payload) {
      if (existingEmails.has(doc.email)) {
        errors.push({ email: doc.email, error: 'Email already exists in DB.' });
        continue;
      }
      if (duplicateEmails.includes(doc.email)) {
        errors.push({ email: doc.email, error: 'Duplicate email in request payload.' });
        continue;
      }
      if (!doc.doctorID) doc.doctorID = await getNextDoctorID();
      doctorsToInsert.push(normalizeFields(doc));
    }

    if (doctorsToInsert.length === 0) {
      return res.status(409).json({ error: 'No doctors inserted', details: errors });
    }

    const inserted = await Doctor.insertMany(doctorsToInsert);
    const ids = inserted.map(doc => doc.doctorID);
    const enriched = await Doctor.aggregate(doctorWithDepartmentAndSpecialitiesLookup({ doctorID: { $in: ids } }));
    const transformed = enriched.map(transformSpecialities);

    const response = { inserted: transformed };
    if (errors.length > 0) response.errors = errors;
    res.status(errors.length > 0 ? 207 : 201).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// 🟢 POST /doctors/upload-profile-image
exports.uploadDoctorImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    res.status(201).json({
      message: 'Profile image uploaded successfully',
      fileName: req.file.filename,
      path: req.file.path
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// 🟢 PUT /doctors
exports.updateDoctor = async (req, res) => {
  try {
    const filter = req.query;
    const updateData = req.body;

    if (!Object.keys(filter).length) return res.status(400).json({ error: 'No filter provided' });
    if (!Object.keys(updateData).length) return res.status(400).json({ error: 'No update data provided' });

    ['languagesKnown', 'servicesOffered'].forEach(field => {
      if (updateData[field] && typeof updateData[field] === 'string') {
        updateData[field] = updateData[field].split(',').map(s => s.trim());
      }
    });

    const result = await Doctor.updateMany(filter, { $set: updateData });
    if (result.modifiedCount === 0) return res.status(404).json({ message: 'No matching doctors found to update' });

    const updated = await Doctor.aggregate(doctorWithDepartmentAndSpecialitiesLookup(buildDoctorFilter(filter)));
    const transformed = updated.map(transformSpecialities);

    res.json({ message: 'Doctor(s) updated', updatedCount: result.modifiedCount, updatedDoctors: transformed });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// bulkUpdateDoctors: removed per requirement

// 🟢 DELETE by ID
exports.deleteDoctorById = async (req, res) => {
  try {
    const doctorID = Number(req.params.id);
    const doctorToDelete = await Doctor.findOne({ doctorID });
    if (!doctorToDelete) return res.status(404).json({ message: 'Doctor not found' });

    await Doctor.deleteOne({ doctorID });
    const enriched = await Doctor.aggregate(doctorWithDepartmentAndSpecialitiesLookup({ doctorID }));
    res.json({ message: 'Doctor deleted', doctor: transformSpecialities(enriched[0] || doctorToDelete) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🟢 DELETE by filter
exports.deleteDoctorsByFilter = async (req, res) => {
  try {
    const { filter } = req.body;
    if (!filter || typeof filter !== 'object') return res.status(400).json({ error: 'Provide valid filter' });

    const toDelete = await Doctor.aggregate(doctorWithDepartmentAndSpecialitiesLookup(filter));
    const result = await Doctor.deleteMany(filter);
    if (result.deletedCount === 0) return res.status(404).json({ message: 'No doctors matched filter' });

    res.json({ message: 'Doctors deleted', deletedCount: result.deletedCount, deletedDoctors: toDelete.map(transformSpecialities) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🟢 Bulk delete by IDs
exports.bulkDeleteDoctorsByIds = async (req, res) => {
  try {
    const ids = req.params.ids.split(',').map(id => Number(id.trim())).filter(id => !isNaN(id));
    if (!ids.length) return res.status(400).json({ error: 'No valid IDs provided' });

    const toDelete = await Doctor.aggregate(doctorWithDepartmentAndSpecialitiesLookup({ doctorID: { $in: ids } }));
    const result = await Doctor.deleteMany({ doctorID: { $in: ids } });
    if (result.deletedCount === 0) return res.status(404).json({ message: 'No doctors found for provided IDs' });

    res.json({ message: 'Doctors deleted', deletedCount: result.deletedCount, deletedDoctors: toDelete.map(transformSpecialities) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
