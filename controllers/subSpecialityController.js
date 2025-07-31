const SubSpeciality = require('../models/SubSpecialities');
const getNextSequence = require('../utils/getNextSequence');

// Build MongoDB filter from query params
const buildSubSpecialityFilter = (query) => {
  const filter = {};
  for (const key in query) {
    let value = query[key];
    if (value === undefined || value === '') continue;
    if (key === 'subSpecialityID' || key === 'specialityID') filter[key] = Number(value);
    else if (key === 'isActive') filter[key] = value === 'true';
    else filter[key] = { $regex: value, $options: 'i' };
  }
  return filter;
};

// GET all (or filter)
exports.getSubSpecialities = async (req, res) => {
  try {
    const filter = buildSubSpecialityFilter(req.query);
    const subSpecialities = await SubSpeciality.find(filter).sort({ subSpecialityName: 1 });
    res.json(subSpecialities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET by subSpecialityID
exports.getSubSpecialityById = async (req, res) => {
  try {
    const sub = await SubSpeciality.findOne({ subSpecialityID: Number(req.params.id) });
    if (!sub)
      return res.status(404).json({ message: 'Sub-speciality not found' });
    res.json(sub);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ADD - single or bulk
exports.addSubSpeciality = async (req, res) => {
  try {
    const payload = req.body;
    const getNextID = async () => await getNextSequence('subSpecialityID');

    // Single add
    if (!Array.isArray(payload)) {
      if (!payload.subSpecialityID) payload.subSpecialityID = await getNextID();
      const newDoc = new SubSpeciality(payload);
      const saved = await newDoc.save();
      return res.status(201).json(saved);
    }

    // Bulk add
    const toInsert = [];
    for (const s of payload) {
      if (!s.subSpecialityID) s.subSpecialityID = await getNextID();
      toInsert.push(s);
    }
    const inserted = await SubSpeciality.insertMany(toInsert);
    res.status(201).json(inserted);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE (by query e.g. by subSpecialityID or specialityID)
exports.updateSubSpeciality = async (req, res) => {
  const filter = req.query;
  const updateData = req.body;
  if (!Object.keys(filter).length) return res.status(400).json({ error: 'No filter provided' });
  if (!Object.keys(updateData).length) return res.status(400).json({ error: 'No update data provided' });

  try {
    const result = await SubSpeciality.updateMany(filter, { $set: updateData });
    if (result.modifiedCount === 0)
      return res.status(404).json({ message: 'No matching sub-specialities found to update' });
    const updated = await SubSpeciality.find(filter);
    res.json({ message: 'Sub-speciality(s) updated', updatedCount: result.modifiedCount, updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// BULK UPDATE
exports.bulkUpdateSubSpecialities = async (req, res) => {
  try {
    const { updates } = req.body;
    if (!Array.isArray(updates) || updates.length === 0)
      return res.status(400).json({ error: 'No updates provided' });

    const allowedFields = Object.keys(SubSpeciality.schema.paths);
    const results = [];
    const warnings = [];

    for (const upd of updates) {
      const { filter, updateFields } = upd;
      if (!filter || !updateFields || typeof filter !== 'object' || typeof updateFields !== 'object') {
        warnings.push({ filter, error: 'Invalid update structure' });
        continue;
      }
      const invalidFields = Object.keys(updateFields).filter(f => !allowedFields.includes(f));
      if (invalidFields.length) {
        warnings.push({ filter, warning: `Invalid fields: ${invalidFields.join(', ')}` });
        continue;
      }
      const result = await SubSpeciality.findOneAndUpdate(filter, { $set: updateFields }, { new: true });
      if (result) results.push(result);
      else warnings.push({ filter, warning: 'Sub-speciality not found' });
    }

    res.json({ message: 'Bulk update completed', updated: results.length, results, warnings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE by ID
exports.deleteSubSpecialityById = async (req, res) => {
  try {
    const deleted = await SubSpeciality.findOneAndDelete({ subSpecialityID: Number(req.params.id) });
    if (!deleted)
      return res.status(404).json({ message: 'Sub-speciality not found' });
    res.json({ message: 'Sub-speciality deleted', subSpeciality: deleted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE by filter
exports.deleteSubSpecialitiesByFilter = async (req, res) => {
  try {
    const { filter } = req.body;
    if (!filter || typeof filter !== 'object')
      return res.status(400).json({ error: 'Provide valid filter' });
    const result = await SubSpeciality.deleteMany(filter);
    if (result.deletedCount === 0)
      return res.status(404).json({ message: 'No sub-specialities matched filter' });
    res.json({ message: 'Sub-specialities deleted', deletedCount: result.deletedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// BULK DELETE by IDs
exports.bulkDeleteSubSpecialitiesByIds = async (req, res) => {
  try {
    const idsParam = req.params.ids;
    if (!idsParam)
      return res.status(400).json({ error: 'No IDs provided' });
    const ids = idsParam.split(',').map(id => Number(id.trim())).filter(id => !isNaN(id));
    if (ids.length === 0)
      return res.status(400).json({ error: 'No valid IDs provided' });
    const result = await SubSpeciality.deleteMany({ subSpecialityID: { $in: ids } });
    if (result.deletedCount === 0)
      return res.status(404).json({ message: 'No sub-specialities found for provided IDs' });
    res.json({ message: 'Sub-specialities deleted', deletedCount: result.deletedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
