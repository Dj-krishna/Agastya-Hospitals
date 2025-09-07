const Doctor = require('../models/Doctors');
const Department = require('../models/Departments');
const Speciality = require('../models/Specialities');
const getNextSequence = require('../utils/getNextSequence');


// Helper: Validate and normalize input fields including speciality conversion
const validateAndNormalizeDoctor = async (doc) => {
  const errors = [];

  // Normalize array fields from comma-separated strings if needed
  ['languagesKnown', 'servicesOffered', 'educationQualification', 'opTimings'].forEach(field => {
    if (doc[field] && !Array.isArray(doc[field])) {
      doc[field] = doc[field].split(',').map(s => s.trim());
    }
  });

  // Validate and convert speciality field
  if (doc.speciality) {
    let specialityArray = [];

    if (Array.isArray(doc.speciality)) {
      specialityArray = doc.speciality;
    } else if (typeof doc.speciality === 'string') {
      specialityArray = [doc.speciality];
    } else {
      errors.push('Field "speciality" must be a string or an array.');
    }

    const specialityIDs = [];
    for (const item of specialityArray) {
      if (typeof item === 'number') {
        specialityIDs.push(item);
      } else if (typeof item === 'string') {
        const specDoc = await Speciality.findOne({ specialityName: { $regex: `^${item}$`, $options: 'i' } }, { specialityID: 1 });
        if (specDoc) {
          specialityIDs.push(specDoc.specialityID);
        } else {
          errors.push(`Speciality not found: ${item}`);
        }
      } else {
        errors.push(`Invalid speciality item: ${item}`);
      }
    }

    doc.speciality = specialityIDs;
  }

  return { normalizedDoc: doc, errors };
};


// Build filter from request query for GET, DELETE, etc.
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


// Aggregation pipeline to enrich doctors with department and speciality names
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


// Transform speciality arrays of IDs and names to a map { id: name }
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


// GET /doctors (supports filtering, returns enriched data)
exports.getDoctors = async (req, res) => {
  try {
    const filter = buildDoctorFilter(req.query);
    const doctors = await Doctor.aggregate(doctorWithDepartmentAndSpecialitiesLookup(filter));

    if (doctors.length === 0) {
      return res.status(404).json({ message: 'No doctors found.' });
    }

    const transformed = doctors.map(transformSpecialities);

    if (req.query.doctorID) {
      res.json(transformed[0]);
    } else {
      res.json(transformed);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// POST /doctors (single or bulk insert, with validation and file upload handling)
exports.addDoctor = async (req, res) => {
  try {
    const payload = req.body;
    const getNextDoctorID = async () => await getNextSequence('doctorID');

    const emailExists = async (email) => await Doctor.exists({ email });

    // Handle single insert
    if (!Array.isArray(payload)) {
      const { normalizedDoc, errors } = await validateAndNormalizeDoctor(payload);
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      if (await emailExists(normalizedDoc.email)) {
        return res.status(409).json({ error: 'A doctor with this email already exists.' });
      }

      if (!normalizedDoc.doctorID) normalizedDoc.doctorID = await getNextDoctorID();

      if (req.files) {
        if (req.files.profilePicture) {
          normalizedDoc.profilePicture = req.files.profilePicture[0].url;
        }
        if (req.files.profileImageGfs) {
          normalizedDoc.profileImageGfs = req.files.profileImageGfs.map(f => f.url);
        }
        if (req.files.introVideoGfs) {
          normalizedDoc.introVideoGfs = req.files.introVideoGfs.map(f => f.url);
        }
      }

      const saved = await new Doctor(normalizedDoc).save();
      const enriched = await Doctor.aggregate(doctorWithDepartmentAndSpecialitiesLookup({ doctorID: saved.doctorID }));

      return res.status(201).json(transformSpecialities(enriched[0]));
    }

    // Handle bulk insert
    const emails = payload.map(doc => doc.email);
    const existingDoctors = await Doctor.find({ email: { $in: emails } }, { email: 1 });
    const existingEmails = new Set(existingDoctors.map(doc => doc.email));
    const duplicateEmails = emails.filter((email, idx) => emails.indexOf(email) !== idx);

    const errors = [];
    const doctorsToInsert = [];

    for (const doc of payload) {
      const { normalizedDoc, errors: validationErrors } = await validateAndNormalizeDoctor(doc);

      if (existingEmails.has(normalizedDoc.email)) {
        errors.push({ email: normalizedDoc.email, error: 'Email already exists in DB.' });
        continue;
      }
      if (duplicateEmails.includes(normalizedDoc.email)) {
        errors.push({ email: normalizedDoc.email, error: 'Duplicate email in request payload.' });
        continue;
      }
      if (validationErrors.length > 0) {
        errors.push({ email: normalizedDoc.email, errors: validationErrors });
        continue;
      }

      if (!normalizedDoc.doctorID) normalizedDoc.doctorID = await getNextDoctorID();

      // For bulk insert, file uploads usually handled separately per doctor
      doctorsToInsert.push(normalizedDoc);
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


// PUT /doctors (update with optional file uploads, validation, and error reporting)
exports.updateDoctor = async (req, res) => {
  try {
    const filter = buildDoctorFilter(req.query);
    if (!Object.keys(filter).length) {
      return res.status(400).json({ error: 'No filter provided' });
    }

    // Clone body to avoid mutations
    const updateData = { ...req.body };

    // Remove fields that should not be updated
    delete updateData._id;
    delete updateData.doctorID;

    const { normalizedDoc, errors } = await validateAndNormalizeDoctor(updateData);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    if (req.files) {
      // Replace console.log with proper logging as needed
      // For now, no logging

      if (req.files?.profilePicture?.length > 0) {
        normalizedDoc.profilePicture = req.files.profilePicture[0].url || normalizedDoc.profilePicture;
      }
      if (req.files?.profileImageGfs?.length > 0) {
        const existingImages = Array.isArray(normalizedDoc.profileImageGfs) ? normalizedDoc.profileImageGfs : [];
        const newImages = req.files.profileImageGfs.map(f => f.url).filter(Boolean);
        normalizedDoc.profileImageGfs = existingImages.concat(newImages);
      }
      if (req.files?.introVideoGfs?.length > 0) {
        const existingVideos = Array.isArray(normalizedDoc.introVideoGfs) ? normalizedDoc.introVideoGfs : [];
        const newVideos = req.files.introVideoGfs.map(f => f.url).filter(Boolean);
        normalizedDoc.introVideoGfs = existingVideos.concat(newVideos);
      }
    }

    const result = await Doctor.updateMany(filter, { $set: normalizedDoc });

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'No matching doctors found to update' });
    }

    const updatedDoctors = await Doctor.aggregate(doctorWithDepartmentAndSpecialitiesLookup(filter));
    const transformedDoctors = updatedDoctors.map(transformSpecialities);

    res.json({
      message: `Doctor(s) updated successfully`,
      updatedCount: result.modifiedCount,
      updatedDoctors: transformedDoctors,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// DELETE /doctors (supports bulk delete by IDs, filter, or single by query)
exports.deleteDoctors = async (req, res) => {
  try {
    let filter = {};
    let deletedDoctors = [];

    if (req.params.ids) {
      // Bulk delete by comma-separated doctorIDs
      const ids = req.params.ids.split(',').map(id => Number(id.trim())).filter(id => !isNaN(id));
      if (!ids.length) return res.status(400).json({ error: 'No valid IDs provided' });

      filter = { doctorID: { $in: ids } };
    } else if (req.query.doctorID) {
      // Single delete by ID
      filter = { doctorID: Number(req.query.doctorID) };
    } else if (Object.keys(req.query).length > 0) {
      // Delete by query params
      filter = buildDoctorFilter(req.query);
    } else if (req.body.filter) {
      if (typeof req.body.filter !== 'object') return res.status(400).json({ error: 'Provide valid filter' });
      filter = req.body.filter;
    } else {
      return res.status(400).json({ error: 'No filter provided. Use query params, body filter, or /bulk/:ids' });
    }

    // Find doctors before deletion for response
    const toDelete = await Doctor.aggregate(doctorWithDepartmentAndSpecialitiesLookup(filter));
    if (toDelete.length === 0) return res.status(404).json({ message: 'No doctors found matching the criteria' });

    const result = await Doctor.deleteMany(filter);
    if (result.deletedCount === 0) return res.status(404).json({ message: 'No doctors were deleted' });

    deletedDoctors = toDelete.map(transformSpecialities);

    if (req.query.doctorID) {
      // Single delete response
      res.json({ message: 'Doctor deleted', doctor: deletedDoctors[0] });
    } else {
      // Bulk or filtered delete response
      res.json({
        message: 'Doctors deleted',
        deletedCount: result.deletedCount,
        deletedDoctors: deletedDoctors,
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
