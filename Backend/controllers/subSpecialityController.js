const SubSpeciality = require('../models/SubSpecialities');
const getNextSequence = require('../utils/getNextSequence');

// Utility: Build Mongoose filter from query params
const buildSubSpecialityFilter = (query) => {
  const filter = {};
  const numFields = ['subSpecialityID', 'specialityID', 'doctorID'];
  for (const key in query) {
    const value = query[key];
    if (value === undefined || value === '') continue;
    if (numFields.includes(key)) {
      filter[key] = Number(value);
    } else if (key === 'subSpecialityName') {
      filter[key] = { $regex: value, $options: 'i' };
    } else {
      filter[key] = value;
    }
  }
  return filter;
};

// GET: All or filtered subspecialities
exports.getSubSpecialities = async (req, res) => {
  try {
    const filter = buildSubSpecialityFilter(req.query);
    const subSpecialities = await SubSpeciality.find(filter);
    if (!subSpecialities.length) {
      return res.status(404).json({ message: 'No sub-specialities found.' });
    }
    res.json(subSpecialities.length === 1 ? subSpecialities[0] : subSpecialities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET: Single by subSpecialityID
exports.getSubSpecialityById = async (req, res) => {
  try {
    const subSpecialityID = Number(req.params.id);
    const subSpeciality = await SubSpeciality.findOne({ subSpecialityID });
    if (!subSpeciality) return res.status(404).json({ message: 'Sub-speciality not found.' });
    res.json(subSpeciality);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST: Add one or many
exports.addSubSpeciality = async (req, res) => {
  try {
    const payload = req.body;
    const getNextID = async () => await getNextSequence('subSpecialityID');

    // Helper: Unique by name+specialityID combo
    const exists = async (name, specialityID) => (
      await SubSpeciality.exists({ subSpecialityName: name, specialityID })
    );

    if (!Array.isArray(payload)) {
      if (await exists(payload.subSpecialityName, payload.specialityID)) {
        return res.status(409).json({ error: 'Sub-speciality with this name already exists for this speciality.' });
      }
      if (!payload.subSpecialityID) payload.subSpecialityID = await getNextID();
      const newDoc = new SubSpeciality(payload);
      const saved = await newDoc.save();
      return res.status(201).json(saved);
    }

    // Bulk insert
    const combos = payload.map(doc => `${doc.subSpecialityName}|${doc.specialityID}`);
    const dbDocs = await SubSpeciality.find({
      $or: payload.map(doc => ({
        subSpecialityName: doc.subSpecialityName, specialityID: doc.specialityID
      }))
    }, { subSpecialityName: 1, specialityID: 1 });

    const dbCombos = new Set(dbDocs.map(d => `${d.subSpecialityName}|${d.specialityID}`));
    const duplicateCombos = combos.filter((c, i) => combos.indexOf(c) !== i);

    const errors = [];
    const docsToInsert = [];
    for (const doc of payload) {
      const combo = `${doc.subSpecialityName}|${doc.specialityID}`;
      if (dbCombos.has(combo)) {
        errors.push({ subSpecialityName: doc.subSpecialityName, specialityID: doc.specialityID, error: 'Duplicate in DB.' });
        continue;
      }
      if (duplicateCombos.includes(combo)) {
        errors.push({ subSpecialityName: doc.subSpecialityName, specialityID: doc.specialityID, error: 'Duplicate in payload.' });
        continue;
      }
      if (!doc.subSpecialityID) doc.subSpecialityID = await getNextID();
      docsToInsert.push(doc);
    }
    if (!docsToInsert.length) {
      return res.status(409).json({ error: 'No subspecialities inserted due to duplicates.', details: errors });
    }
    const inserted = await SubSpeciality.insertMany(docsToInsert);
    let response = { inserted };
    if (errors.length) response.errors = errors;
    res.status(errors.length ? 207 : 201).json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT: Bulk update
exports.bulkUpdateSubSpecialities = async (req, res) => {
  const { filter, updateFields, updates } = req.body;
  try {
    if (filter && updateFields) {
      const result = await SubSpeciality.updateMany(filter, { $set: updateFields });
      return res.json({ message: 'Sub-specialities updated', modifiedCount: result.modifiedCount });
    } else if (Array.isArray(updates)) {
      const bulkOps = updates.map(u => ({
        updateOne: { filter: u.filter, update: { $set: u.updateFields } }
      }));
      const result = await SubSpeciality.bulkWrite(bulkOps);
      return res.json({ message: 'Sub-specialities updated (multi)', modifiedCount: result.modifiedCount });
    } else {
      return res.status(400).json({ error: 'Invalid update structure' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT: Update by filter (single/many)
exports.updateSubSpeciality = async (req, res) => {
  const filter = req.query;
  const updateData = req.body;
  if (!Object.keys(filter).length) return res.status(400).json({ error: 'No filter provided' });
  if (!Object.keys(updateData).length) return res.status(400).json({ error: 'No update data provided' });

  try {
    const result = await SubSpeciality.updateMany(filter, { $set: updateData });
    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: 'No matching subspecialities found to update' });
    }
    const updated = await SubSpeciality.find(filter);
    return res.json({
      message: 'Sub-speciality(s) updated',
      updatedCount: result.modifiedCount,
      updatedSubSpecialities: updated.length === 1 ? updated[0] : updated,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE: By subSpecialityID
exports.deleteSubSpecialityById = async (req, res) => {
  try {
    const subSpecialityID = Number(req.params.id);
    const deleted = await SubSpeciality.findOneAndDelete({ subSpecialityID });
    if (!deleted) return res.status(404).json({ message: 'Sub-speciality not found' });
    return res.json({ message: 'Sub-speciality deleted', subSpeciality: deleted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE: By filter
exports.deleteSubSpecialitiesByFilter = async (req, res) => {
  try {
    const { filter } = req.body;
    if (!filter || typeof filter !== 'object') return res.status(400).json({ error: 'Provide valid filter' });
    const result = await SubSpeciality.deleteMany(filter);
    if (!result.deletedCount) return res.status(404).json({ message: 'No subspecialities matched filter' });
    return res.json({ message: 'Sub-specialities deleted', deletedCount: result.deletedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE: Bulk delete by comma-separated IDs
exports.bulkDeleteSubSpecialitiesByIds = async (req, res) => {
  try {
    const idsParam = req.params.ids;
    if (!idsParam) return res.status(400).json({ error: 'No IDs provided' });
    const ids = idsParam.split(',').map(id => Number(id.trim())).filter(id => !isNaN(id));
    if (!ids.length) return res.status(400).json({ error: 'No valid IDs provided' });
    const result = await SubSpeciality.deleteMany({ subSpecialityID: { $in: ids } });
    if (!result.deletedCount) return res.status(404).json({ message: 'No subspecialities found for provided IDs' });
    res.json({ message: 'Sub-specialities deleted', deletedCount: result.deletedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
