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
    if (key === 'specialityID' || key === 'doctor' || key === 'displayOrder') {
      filter[key] = Number(value);
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
    // Start with req.body; ensure it's an object
    const payload = req.body || {};

    // Attach uploaded file URLs from ImageKit middleware
    if (req.files) {
      if (req.files.icon) payload.icon = req.files.icon[0].url;
      if (req.files.banner) payload.banner = req.files.banner[0].url;
      if (req.files.iconGfs) payload.iconGfs = req.files.iconGfs.map(f => f.url);
      if (req.files.bannerGfs) payload.bannerGfs = req.files.bannerGfs.map(f => f.url);
    }

    // Validate required field
    if (!payload.doctor) return res.status(400).json({ error: 'doctor is required' });

    // Helper to generate URL slug
    const generateSlug = (name) => {
      return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    };

    // Check if bulk insert
    const isBulk = Array.isArray(payload) && payload.length > 0;

    if (!isBulk) {
      // Single insert
      if (!payload.specialityID) payload.specialityID = await getNextSequence('specialityID');
      if (!payload.urlSlug && payload.specialityName) payload.urlSlug = generateSlug(payload.specialityName);

      const doc = new Speciality(payload);
      const saved = await doc.save();
      return res.status(201).json(saved);
    } else {
      // Bulk insert
      const insertedDocs = [];
      for (let sp of payload) {
        if (!sp.doctor) continue;
        if (!sp.specialityID) sp.specialityID = await getNextSequence('specialityID');
        if (!sp.urlSlug && sp.specialityName) sp.urlSlug = generateSlug(sp.specialityName);

        // Attach files if present in req.files for this entry (optional)
        if (req.files) {
          if (req.files.icon) sp.icon = req.files.icon[0].url;
          if (req.files.banner) sp.banner = req.files.banner[0].url;
          if (req.files.iconGfs) sp.iconGfs = req.files.iconGfs.map(f => f.url);
          if (req.files.bannerGfs) sp.bannerGfs = req.files.bannerGfs.map(f => f.url);
        }

        const doc = new Speciality(sp);
        const saved = await doc.save();
        insertedDocs.push(saved);
      }
      return res.status(201).json(insertedDocs);
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// UPDATE specialities
exports.updateSpeciality = async (req, res) => {
  const filter = req.query;
  const updateData = req.body || {};
  
  if (!Object.keys(filter).length) {
    return res.status(400).json({ error: 'No filter provided' });
  }
  
  // Check both body and files
  if (Object.keys(updateData).length === 0 && (!req.files || Object.keys(req.files).length === 0)) {
    return res.status(400).json({ error: 'No update data provided' });
  }
  
  try {
    // Handle uploaded files via ImageKit
    if (req.files) {
      if (req.files.icon) updateData.icon = req.files.icon[0].url;
      if (req.files.banner) updateData.banner = req.files.banner[0].url;

      if (req.files.iconGfs) {
        const existing = Array.isArray(updateData.iconGfs) ? updateData.iconGfs : [];
        updateData.iconGfs = existing.concat(req.files.iconGfs.map(f => f.url));
      }
      if (req.files.bannerGfs) {
        const existing = Array.isArray(updateData.bannerGfs) ? updateData.bannerGfs : [];
        updateData.bannerGfs = existing.concat(req.files.bannerGfs.map(f => f.url));
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
