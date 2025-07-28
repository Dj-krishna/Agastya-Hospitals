const Speciality = require('../models/Specialities');
const getNextSequence = require('../utils/getNextSequence');

// Utility to build filter from query
const buildSpecialityFilter = (query) => {
  const filter = {};
  const exactMatchFields = ['specialityID', 'doctorID', 'isActive', 'isNavigationDisplay'];
  for (const key in query) {
    const value = query[key];
    if (value === undefined || value === '') continue;
    if (exactMatchFields.includes(key)) {
      filter[key] = typeof Speciality.schema.paths[key].instance === 'Boolean'
        ? value === 'true' // convert to boolean if needed
        : isNaN(value) ? value : Number(value);
    } else if (key === 'specialityName') {
      filter[key] = { $regex: value, $options: 'i' };
    } else {
      filter[key] = value;
    }
  }
  return filter;
};

// GET: fetch all/some specialities
exports.getSpecialities = async (req, res) => {
  try {
    const filter = buildSpecialityFilter(req.query);
    const specialities = await Speciality.find(filter);
    if (!specialities.length) {
      return res.status(404).json({ message: 'No Specialities found.' });
    }
    res.json(specialities.length === 1 ? specialities[0] : specialities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET: fetch by specialityID
exports.getSpecialityById = async (req, res) => {
  try {
    const specialityID = Number(req.params.id);
    const speciality = await Speciality.findOne({ specialityID });
    if (!speciality) return res.status(404).json({ message: 'Speciality not found.' });
    res.json(speciality);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST: add one/multiple specialities (auto-increment ID)
exports.addSpeciality = async (req, res) => {
  try {
    const payload = req.body;
    const getNextSpecialityID = async () => await getNextSequence('specialityID');

    // Helper: check for existing name + doctorID combo
    const exists = async (specialityName, doctorID) => {
      return await Speciality.exists({ specialityName, doctorID });
    };

    if (!Array.isArray(payload)) {
      if (await exists(payload.specialityName, payload.doctorID)) {
        return res.status(409).json({ error: 'This doctor already has a speciality with this name.' });
      }
      if (!payload.specialityID) payload.specialityID = await getNextSpecialityID();
      const newSpeciality = new Speciality(payload);
      const saved = await newSpeciality.save();
      return res.status(201).json(saved);
    }

    // Bulk insert logic
    const combos = payload.map(d => `${d.specialityName}|${d.doctorID}`);
    const dbSpecialities = await Speciality.find({ 
      $or: payload.map(d => ({ specialityName: d.specialityName, doctorID: d.doctorID }))
    }, { specialityName: 1, doctorID: 1 });
    const dbCombos = new Set(dbSpecialities.map(s => `${s.specialityName}|${s.doctorID}`));
    const duplicateCombos = combos.filter((c, idx) => combos.indexOf(c) !== idx);

    const errors = [];
    const specialitiesToInsert = [];
    for (const spec of payload) {
      const combo = `${spec.specialityName}|${spec.doctorID}`;
      if (dbCombos.has(combo)) {
        errors.push({ specialityName: spec.specialityName, doctorID: spec.doctorID, error: 'Duplicate in DB.' });
        continue;
      }
      if (duplicateCombos.includes(combo)) {
        errors.push({ specialityName: spec.specialityName, doctorID: spec.doctorID, error: 'Duplicate in payload.' });
        continue;
      }
      if (!spec.specialityID) spec.specialityID = await getNextSpecialityID();
      specialitiesToInsert.push(spec);
    }

    if (!specialitiesToInsert.length) {
      return res.status(409).json({ error: 'No specialities inserted because of duplicates.', details: errors });
    }
    const inserted = await Speciality.insertMany(specialitiesToInsert);
    let response = { inserted };
    if (errors.length) response.errors = errors;
    res.status(errors.length ? 207 : 201).json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT: bulk update or many-at-once
exports.bulkUpdateSpecialities = async (req, res) => {
  const { filter, updateFields, updates } = req.body;
  try {
    if (filter && updateFields) {
      const result = await Speciality.updateMany(filter, { $set: updateFields });
      return res.json({ message: 'Specialities updated', modifiedCount: result.modifiedCount });
    } else if (Array.isArray(updates)) {
      const bulkOps = updates.map(u => ({
        updateOne: { filter: u.filter, update: { $set: u.updateFields } }
      }));
      const result = await Speciality.bulkWrite(bulkOps);
      return res.json({ message: 'Specialities updated (multi)', modifiedCount: result.modifiedCount });
    } else {
      return res.status(400).json({ error: 'Invalid update structure' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT: update by filter (single or many)
exports.updateSpeciality = async (req, res) => {
  const filter = req.query;
  const updateData = req.body;
  if (!Object.keys(filter).length) return res.status(400).json({ error: 'No filter provided' });
  if (!Object.keys(updateData).length) return res.status(400).json({ error: 'No update data provided' });

  try {
    const result = await Speciality.updateMany(filter, { $set: updateData });
    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: 'No matching specialities found to update' });
    }
    const updated = await Speciality.find(filter);
    return res.json({
      message: 'Speciality(s) updated',
      updatedCount: result.modifiedCount,
      updatedSpecialities: updated.length === 1 ? updated[0] : updated,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE: by specialityID
exports.deleteSpecialityById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const deleted = await Speciality.findOneAndDelete({ specialityID: id });
    if (!deleted) return res.status(404).json({ message: 'Speciality not found' });
    return res.json({ message: 'Speciality deleted', speciality: deleted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE: by filter object
exports.deleteSpecialitiesByFilter = async (req, res) => {
  try {
    const { filter } = req.body;
    if (!filter || typeof filter !== 'object') return res.status(400).json({ error: 'Provide valid filter' });
    const result = await Speciality.deleteMany(filter);
    if (!result.deletedCount) return res.status(404).json({ message: 'No specialities matched filter' });
    return res.json({ message: 'Specialities deleted', deletedCount: result.deletedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE: bulk delete by comma-separated IDs
exports.bulkDeleteSpecialitiesByIds = async (req, res) => {
  try {
    const idsParam = req.params.ids;
    if (!idsParam) return res.status(400).json({ error: 'No IDs provided' });
    const ids = idsParam.split(',').map(id => Number(id.trim())).filter(id => !isNaN(id));
    if (!ids.length) return res.status(400).json({ error: 'No valid IDs provided' });
    const result = await Speciality.deleteMany({ specialityID: { $in: ids } });
    if (!result.deletedCount) return res.status(404).json({ message: 'No specialities found for provided IDs' });
    res.json({ message: 'Specialities deleted', deletedCount: result.deletedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

