const Speciality = require('../models/Specialities');  // Specialities model
const getNextSequence = require('../utils/getNextSequence'); // used for specialityID
const Doctor = require('../models/Doctors'); // needed to get doctorName

// Utility: Build filter object from query params
const buildSpecialityFilter = (query) => {
  const filter = {};
  for (const key in query) {
    if (query[key] === undefined || query[key] === '') continue;
    let value = query[key];

    // Handle booleans and numbers
    if (key === 'specialityID' || key === 'doctor' || key === 'displayOrder') {
      filter[key] = Number(value);
    } else if (key === 'isActive' || key === 'isNavigationDisplay') {
      filter[key] = value === 'true';
    } else {
      filter[key] = { $regex: value, $options: 'i' }; // Partial, case-insensitive
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

    // Attach doctorName if doctor present
    const doctorIDs = [...new Set(specialities.map(s => s.doctor).filter(Boolean))];
    let doctorMap = new Map();
    if (doctorIDs.length) {
      const doctors = await Doctor.find(
        { doctorID: { $in: doctorIDs } },
        { doctorID: 1, fullName: 1, _id: 0 }
      );
      doctorMap = new Map(doctors.map(d => [d.doctorID, d.fullName]));
    }

    const enriched = specialities.map(s => ({
      ...s.toObject(),
      doctorName: doctorMap.get(s.doctor)
    }));

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
    const payload = req.body;

    // Validate doctor
    if (!payload.doctor) return res.status(400).json({ error: 'doctor is required' });

    const generateSlug = (name) => {
      return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    };

    // Single insert
    if (!Array.isArray(payload)) {
      if (!payload.specialityID) payload.specialityID = await getNextSequence('specialityID');
      if (!payload.urlSlug && payload.specialityName) payload.urlSlug = generateSlug(payload.specialityName);

      const doc = new Speciality(payload);
      const saved = await doc.save();
      return res.status(201).json(saved);
    }

    // Bulk insert (if ever needed)
    const insertedDocs = [];
    for (const sp of payload) {
      if (!sp.doctor) continue; // skip invalid
      if (!sp.specialityID) sp.specialityID = await getNextSequence('specialityID');
      if (!sp.urlSlug && sp.specialityName) sp.urlSlug = generateSlug(sp.specialityName);

      const doc = new Speciality(sp);
      const saved = await doc.save();
      insertedDocs.push(saved);
    }

    res.status(201).json(insertedDocs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// UPDATE specialities
exports.updateSpeciality = async (req, res) => {
  const filter = req.query;
  const updateData = req.body;
  if (!Object.keys(filter).length) return res.status(400).json({ error: 'No filter provided' });
  if (!Object.keys(updateData).length) return res.status(400).json({ error: 'No update data provided' });

  try {
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

    // Bulk IDs from params
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
