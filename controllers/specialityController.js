const Speciality = require('../models/Specialities');
const getNextSequence = require('../utils/getNextSequence');
const Doctor = require('../models/Doctors');

// Utility: Build filter object from query params
const buildSpecialityFilter = (query) => {
  const filter = {};
  for (const key in query) {
    if (query[key] === undefined || query[key] === '') continue;
    let value = query[key];

    // Handle booleans and numbers
    if (key === 'specialityID' || key === 'displayOrder') {
      filter[key] = Number(value);
    } else if (key === 'doctor') {
      // Accepts single doctorID or comma-separated
      const doctorArr = Array.isArray(value)
        ? value.map(Number)
        : String(value).split(',').map(v => Number(v));
      filter[key] = { $in: doctorArr };
    } else if (key === 'isActive' || key === 'isNavigationDisplay') {
      filter[key] = value === 'true';
    } else {
      filter[key] = { $regex: value, $options: 'i' };
    }
  }
  return filter;
};

// GET all or filtered specialities
exports.getSpecialities = async (req, res) => {
  try {
    const filter = buildSpecialityFilter(req.query);
    const specialities = await Speciality.find(filter).sort({ displayOrder: 1 });
    if (!specialities.length) return res.status(404).json({ message: 'No specialities found.' });

    // Gather unique doctorIDs from all arrays
    const doctorIDs = [
      ...new Set(
        specialities
          .flatMap(s => Array.isArray(s.doctor) ? s.doctor : (s.doctor ? [s.doctor] : []))
          .filter(Boolean)
      )
    ];
    let doctorMap = new Map();
    if (doctorIDs.length) {
      const doctors = await Doctor.find(
        { doctorID: { $in: doctorIDs } },
        { doctorID: 1, fullName: 1, _id: 0 }
      );
      doctorMap = new Map(doctors.map(d => [d.doctorID, d.fullName]));
    }

    const enriched = specialities.map(s => {
      const docArr = Array.isArray(s.doctor) ? s.doctor : (s.doctor ? [s.doctor] : []);
      return {
        ...s.toObject(),
        doctorNames: docArr.map(docId => doctorMap.get(docId) || null)
      };
    });

    if (req.query.specialityID) {
      res.json(enriched[0]);
    } else {
      res.json(enriched);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET speciality list with only specialityID and specialityName
exports.getSpecialityList = async (req, res) => {
  try {
    const specialities = await Speciality.find({}, { specialityID: 1, specialityName: 1, _id: 0 })
      .sort({ specialityName: 1 });
    res.json(specialities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ADD new speciality
exports.addSpeciality = async (req, res) => {
  try {
    const payload = req.body || {};

    // If doctor is string (from form-data) parse it to array of numbers
    const normalizeDoctorField = (doc) => {
      if (typeof doc.doctor === 'string') {
        try {
          const parsed = JSON.parse(doc.doctor);
          if (Array.isArray(parsed)) return parsed.map(id => Number(id));
        } catch (e) {
          return doc.doctor.split(',').map(id => Number(id.trim()));
        }
      }
      return doc.doctor;
    };

    // Attach uploaded file URLs from ImageKit middleware
    if (req.files) {
      if (req.files.icon) payload.icon = req.files.icon[0].url;
      if (req.files.banner) payload.banner = req.files.banner.map(f => f.url);
    }

    // Validate doctor as array of at least one ID
    const isBulk = Array.isArray(payload) && payload.length > 0;
    const validateDoctorField = doc =>
      Array.isArray(doc.doctor) && doc.doctor.length > 0 &&
      doc.doctor.every(id => typeof id === 'number' || typeof id === 'string');

    // Helper to generate URL slug
    const generateSlug = (name) => {
      return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    };

    if (!isBulk) {
      payload.doctor = normalizeDoctorField(payload);

      if (!validateDoctorField(payload)) {
        return res.status(400).json({ error: 'doctor (array) is required and cannot be empty' });
      }
      if (!payload.specialityID) payload.specialityID = await getNextSequence('specialityID');
      if (!payload.urlSlug && payload.specialityName) payload.urlSlug = generateSlug(payload.specialityName);

      const doc = new Speciality(payload);
      const saved = await doc.save();
      return res.status(201).json(saved);
    } else {
      const insertedDocs = [];
      for (let sp of payload) {
        sp.doctor = normalizeDoctorField(sp);

        if (!validateDoctorField(sp)) continue;
        if (!sp.specialityID) sp.specialityID = await getNextSequence('specialityID');
        if (!sp.urlSlug && sp.specialityName) sp.urlSlug = generateSlug(sp.specialityName);

        if (req.files) {
          if (req.files.icon) sp.icon = req.files.icon[0].url;
          if (req.files.banner) sp.banner = req.files.banner.map(f => f.url);
        }

        const doc = new Speciality(sp);
        const saved = await doc.save();
        insertedDocs.push(saved);
      }
      if (!insertedDocs.length) {
        return res.status(400).json({ error: 'No valid entry with doctor array provided' });
      }
      return res.status(201).json(insertedDocs);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE specialities
exports.updateSpeciality = async (req, res) => {
  const filter = buildSpecialityFilter(req.query);
  const updateData = req.body || {};

  // Normalize doctor field if string
  if (updateData.doctor) {
    if (typeof updateData.doctor === 'string') {
      try {
        const parsed = JSON.parse(updateData.doctor);
        if (Array.isArray(parsed)) {
          updateData.doctor = parsed.map(id => Number(id));
        }
      } catch (e) {
        updateData.doctor = updateData.doctor.split(',').map(id => Number(id.trim()));
      }
    }
  }

  if (!Object.keys(filter).length) {
    return res.status(400).json({ error: 'No filter provided' });
  }
  if (Object.keys(updateData).length === 0 && (!req.files || Object.keys(req.files).length === 0)) {
    return res.status(400).json({ error: 'No update data provided' });
  }
  try {
    if (req.files) {
      if (req.files.icon) updateData.icon = req.files.icon[0].url;
      if (req.files.banner) {
        const existingBanner = Array.isArray(updateData.banner) ? updateData.banner : (updateData.banner ? [updateData.banner] : []);
        updateData.banner = existingBanner.concat(req.files.banner.map(f => f.url));
      }
    }
    const result = await Speciality.updateMany(filter, { $set: updateData });
    if (result.modifiedCount === 0) return res.status(404).json({ message: 'No matching specialities found to update' });
    const updated = await Speciality.find(filter);
    res.json({ message: 'Speciality(s) updated', updatedCount: result.modifiedCount, updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// DELETE specialities
exports.deleteSpecialities = async (req, res) => {
  try {
    let filter = {};

    if (req.params.ids) {
      const ids = req.params.ids.split(',').map(id => Number(id.trim())).filter(id => !isNaN(id));
      if (!ids.length) return res.status(400).json({ error: 'No valid IDs provided' });
      filter = { specialityID: { $in: ids } };
    } else if (req.query.specialityID) {
      filter = { specialityID: Number(req.query.specialityID) };
    } else if (Object.keys(req.query).length > 0) {
      filter = buildSpecialityFilter(req.query);
    } else if (req.body.filter) {
      if (typeof req.body.filter !== 'object') return res.status(400).json({ error: 'Provide valid filter' });
      filter = req.body.filter;
    } else {
      return res.status(400).json({ error: 'No filter provided. Use query params, body filter, or /bulk/:ids' });
    }

    const toDelete = await Speciality.find(filter);
    if (!toDelete.length) return res.status(404).json({ message: 'No specialities found matching the criteria' });

    const result = await Speciality.deleteMany(filter);
    if (result.deletedCount === 0) return res.status(404).json({ message: 'No specialities were deleted' });

    if ((req.query.specialityID) || (req.params.ids && req.params.ids.split(',').length === 1)) {
      res.json({ message: 'Speciality deleted', speciality: toDelete[0] });
    } else {
      res.json({ message: 'Specialities deleted', deletedCount: result.deletedCount, deletedSpecialities: toDelete });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
