const Speciality = require('../models/Specialities');  // This is your specialities.js model
const getNextSequence = require('../utils/getNextSequence'); // used for specialityID

// Utility: Build filter object from query params
const buildSpecialityFilter = (query) => {
  const filter = {};
  for (const key in query) {
    if (query[key] === undefined || query[key] === '') continue;
    let value = query[key];

    // Handle booleans and numbers
    if (key === 'specialityID' || key === 'doctorID' || key === 'displayOrder') {
      filter[key] = Number(value);
    } else if (key === 'isActive' || key === 'isNavigationDisplay') {
      filter[key] = value === 'true';
    } else {
      filter[key] = { $regex: value, $options: 'i' }; // Partial, case-insensitive
    }
  }
  return filter;
};

// GET all or filtered specialities (handles all cases including by ID)
exports.getSpecialities = async (req, res) => {
  try {
    const filter = buildSpecialityFilter(req.query);
    const specialities = await Speciality.find(filter).sort({ displayOrder: 1 });
    if (!specialities.length) return res.status(404).json({ message: 'No specialities found.' });

    // Attach doctorName if doctorID present
    const doctorIDs = [...new Set(specialities.map(s => s.doctorID).filter(Boolean))];
    let doctorMap = new Map();
    if (doctorIDs.length) {
      const doctors = await require('../models/Doctors').find(
        { doctorID: { $in: doctorIDs } },
        { doctorID: 1, fullName: 1, _id: 0 }
      );
      doctorMap = new Map(doctors.map(d => [d.doctorID, d.fullName]));
    }
    const enriched = specialities.map(s => ({ ...s.toObject(), doctorName: doctorMap.get(s.doctorID) }));
    
    // If filtering by specialityID, return single object, otherwise return array
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
      .sort({ specialityName: 1 }); // optional: sort alphabetically
    res.json(specialities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ADD new (single or bulk) - Counter increments only on successful insert
exports.addSpeciality = async (req, res) => {
  try {
    const payload = req.body;

    // Single insert
    if (!Array.isArray(payload)) {
      // Create doc first without specialityID
      const doc = new Speciality(payload);
      // Save doc
      const saved = await doc.save();
      // Only after successful save, generate and set specialityID if not provided
      if (!saved.specialityID) {
        const nextID = await getNextSequence('specialityID');
        saved.specialityID = nextID;
        await saved.save(); // update doc with new ID
      }
      return res.status(201).json(saved);
    }

    // Bulk insert
    const insertedDocs = [];
    for (const sp of payload) {
      const doc = new Speciality(sp);
      const saved = await doc.save();
      if (!saved.specialityID) {
        const nextID = await getNextSequence('specialityID');
        saved.specialityID = nextID;
        await saved.save();
      }
      insertedDocs.push(saved);
    }

    res.status(201).json(insertedDocs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPLOAD icon or banner for a speciality
exports.uploadSpecialityImage = async (req, res) => {
  try {
    const { specialityID, type } = req.body;
    if (!specialityID || !type || !req.file)
      return res.status(400).json({ error: 'specialityID, type, and file are required' });
    if (type !== 'icon' && type !== 'banner')
      return res.status(400).json({ error: 'type must be icon or banner' });

    const updateField = {};
    updateField[type] = req.file.path;
    const updated = await Speciality.findOneAndUpdate(
      { specialityID: Number(specialityID) },
      { $set: updateField },
      { new: true }
    );
    if (!updated)
      return res.status(404).json({ error: 'Speciality not found' });
    res.json({ message: 'Image uploaded', speciality: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE (single or by filter)
exports.updateSpeciality = async (req, res) => {
  const filter = req.query;
  const updateData = req.body;
  if (!Object.keys(filter).length)
    return res.status(400).json({ error: 'No filter provided' });
  if (!Object.keys(updateData).length)
    return res.status(400).json({ error: 'No update data provided' });

  try {
    const result = await Speciality.updateMany(filter, { $set: updateData });
    if (result.modifiedCount === 0)
      return res.status(404).json({ message: 'No matching specialities found to update' });
    const updated = await Speciality.find(filter);
    res.json({ message: 'Speciality(s) updated', updatedCount: result.modifiedCount, updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// bulkUpdateSpecialities: removed per requirement

// ------------------ DELETE ------------------
exports.deleteSpecialities = async (req, res) => {
  try {
    let filter = {};

    // Bulk IDs from params
    if (req.params.ids) {
      const ids = req.params.ids
        .split(',')
        .map(id => Number(id.trim()))
        .filter(id => !isNaN(id));
      if (!ids.length) return res.status(400).json({ error: 'No valid IDs provided' });
      filter = { specialityID: { $in: ids } };
    }

    // Single or multiple IDs from query
    else if (req.query.specialityID) {
      if (typeof req.query.specialityID === 'string' && req.query.specialityID.includes(',')) {
        const ids = req.query.specialityID
          .split(',')
          .map(id => Number(id.trim()))
          .filter(id => !isNaN(id));
        filter = { specialityID: { $in: ids } };
      } else {
        filter = { specialityID: Number(req.query.specialityID) };
      }
    }

    // Other query filters
    else if (Object.keys(req.query).length > 0) {
      filter = buildSpecialityFilter(req.query);
    }

    // Body filter
    else if (req.body.filter) {
      if (typeof req.body.filter !== 'object')
        return res.status(400).json({ error: 'Provide valid filter' });
      filter = req.body.filter;
    } else {
      return res.status(400).json({ error: 'No filter provided. Use query params, body filter, or /bulk/:ids' });
    }

    // Find documents before delete
    const toDelete = await Speciality.find(filter);
    if (!toDelete.length) {
      return res.status(404).json({ message: 'No specialities found matching the criteria' });
    }

    const result = await Speciality.deleteMany(filter);
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'No specialities were deleted' });
    }

    // If only one deleted, return the single doc
    if (
      (req.query.specialityID && !String(req.query.specialityID).includes(',')) ||
      (req.params.ids && req.params.ids.split(',').length === 1)
    ) {
      res.json({ message: 'Speciality deleted', speciality: toDelete[0] });
    } else {
      res.json({
        message: 'Specialities deleted',
        deletedCount: result.deletedCount,
        deletedSpecialities: toDelete
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

