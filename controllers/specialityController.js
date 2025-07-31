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

// GET all or filtered specialities
exports.getSpecialities = async (req, res) => {
  try {
    const filter = buildSpecialityFilter(req.query);
    const specialities = await Speciality.find(filter).sort({ displayOrder: 1 });
    res.json(specialities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET one by specialityID
exports.getSpecialityById = async (req, res) => {
  try {
    const speciality = await Speciality.findOne({ specialityID: Number(req.params.id) });
    if (!speciality)
      return res.status(404).json({ message: 'Speciality not found' });
    res.json(speciality);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ADD new (single or bulk)
exports.addSpeciality = async (req, res) => {
  try {
    const payload = req.body;

    // Get next sequence generator
    const getNextSpecialityID = async () => await getNextSequence('specialityID');

    // Single insert
    if (!Array.isArray(payload)) {
      if (!payload.specialityID)
        payload.specialityID = await getNextSpecialityID();
      const doc = new Speciality(payload);
      const saved = await doc.save();
      return res.status(201).json(saved);
    }

    // Bulk insert
    const toInsert = [];
    for (const sp of payload) {
      if (!sp.specialityID)
        sp.specialityID = await getNextSpecialityID();
      toInsert.push(sp);
    }
    const inserted = await Speciality.insertMany(toInsert);
    res.status(201).json(inserted);
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

// BULK UPDATE
exports.bulkUpdateSpecialities = async (req, res) => {
  try {
    const { updates } = req.body;
    if (!Array.isArray(updates) || updates.length === 0)
      return res.status(400).json({ error: 'No updates provided' });

    const allowedFields = Object.keys(Speciality.schema.paths);
    const results = [];
    const warnings = [];

    for (const upd of updates) {
      const { filter, updateFields } = upd;
      if (!filter || !updateFields || typeof filter !== 'object' || typeof updateFields !== 'object') {
        warnings.push({ filter, error: 'Invalid update structure' });
        continue;
      }
      // Invalid fields
      const invalidFields = Object.keys(updateFields).filter(f => !allowedFields.includes(f));
      if (invalidFields.length) {
        warnings.push({ filter, warning: `Invalid fields: ${invalidFields.join(', ')}` });
        continue;
      }
      const result = await Speciality.findOneAndUpdate(filter, { $set: updateFields }, { new: true });
      if (result)
        results.push(result);
      else
        warnings.push({ filter, warning: 'Speciality not found' });
    }

    res.json({ message: 'Bulk update completed', updated: results.length, results, warnings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE by ID
exports.deleteSpecialityById = async (req, res) => {
  try {
    const deleted = await Speciality.findOneAndDelete({ specialityID: Number(req.params.id) });
    if (!deleted)
      return res.status(404).json({ message: 'Speciality not found' });
    res.json({ message: 'Speciality deleted', speciality: deleted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE by filter (from body)
exports.deleteSpecialitiesByFilter = async (req, res) => {
  try {
    const { filter } = req.body;
    if (!filter || typeof filter !== 'object')
      return res.status(400).json({ error: 'Provide valid filter' });
    const result = await Speciality.deleteMany(filter);
    if (result.deletedCount === 0)
      return res.status(404).json({ message: 'No specialities matched filter' });
    res.json({ message: 'Specialities deleted', deletedCount: result.deletedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// BULK delete by comma-separated IDs
exports.bulkDeleteSpecialitiesByIds = async (req, res) => {
  try {
    const idsParam = req.params.ids;
    if (!idsParam)
      return res.status(400).json({ error: 'No IDs provided' });
    const ids = idsParam.split(',').map(id => Number(id.trim())).filter(id => !isNaN(id));
    if (ids.length === 0)
      return res.status(400).json({ error: 'No valid IDs provided' });
    const result = await Speciality.deleteMany({ specialityID: { $in: ids } });
    if (result.deletedCount === 0)
      return res.status(404).json({ message: 'No specialities found for provided IDs' });
    res.json({ message: 'Specialities deleted', deletedCount: result.deletedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
