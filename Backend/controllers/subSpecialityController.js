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

// GET all (or filter) - handles all cases including by ID
exports.getSubSpecialities = async (req, res) => {
  try {
    const filter = buildSubSpecialityFilter(req.query);
    const subSpecialities = await SubSpeciality.find(filter).sort({ subSpecialityName: 1 });
    if (!subSpecialities.length) return res.status(404).json({ message: 'No sub-specialities found.' });

    // Attach specialityName via lookup of specialities
    const specialityIDs = [...new Set(subSpecialities.map(s => s.specialityID))];
    const specialities = await require('../models/Specialities').find(
      { specialityID: { $in: specialityIDs } },
      { specialityID: 1, specialityName: 1, _id: 0 }
    );
    const spMap = new Map(specialities.map(sp => [sp.specialityID, sp.specialityName]));
    const enriched = subSpecialities.map(s => ({ ...s.toObject(), specialityName: spMap.get(s.specialityID) }));
    
    // If filtering by subSpecialityID, return single object, otherwise return array
    if (req.query.subSpecialityID) {
      res.json(enriched[0]);
    } else {
      res.json(enriched);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ADD - single or bulk (counter increments only after successful save)
exports.addSubSpeciality = async (req, res) => {
  try {
    const payload = req.body;

    const getNextID = async () => await getNextSequence('subSpecialityID');

    // Single add
    if (!Array.isArray(payload)) {
      const newDoc = new SubSpeciality(payload);
      const saved = await newDoc.save(); // save first
      if (!saved.subSpecialityID) {
        const nextID = await getNextID(); // increment counter only now
        saved.subSpecialityID = nextID;
        await saved.save(); // update with new ID
      }
      return res.status(201).json(saved);
    }

    // Bulk add
    const insertedDocs = [];
    for (const s of payload) {
      const newDoc = new SubSpeciality(s);
      const saved = await newDoc.save(); // save first
      if (!saved.subSpecialityID) {
        const nextID = await getNextID(); // increment counter only now
        saved.subSpecialityID = nextID;
        await saved.save();
      }
      insertedDocs.push(saved);
    }

    res.status(201).json(insertedDocs);

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

// bulkUpdateSubSpecialities: removed per requirement

// ------------------ DELETE ------------------
exports.deleteSubSpecialities = async (req, res) => {
  try {
    let filter = {};

    // Bulk IDs from params
    if (req.params.ids) {
      const ids = req.params.ids
        .split(',')
        .map(id => Number(id.trim()))
        .filter(id => !isNaN(id));
      if (!ids.length) return res.status(400).json({ error: 'No valid IDs provided' });
      filter = { subSpecialityID: { $in: ids } };
    }

    // Single or multiple IDs from query
    else if (req.query.subSpecialityID) {
      if (typeof req.query.subSpecialityID === 'string' && req.query.subSpecialityID.includes(',')) {
        const ids = req.query.subSpecialityID
          .split(',')
          .map(id => Number(id.trim()))
          .filter(id => !isNaN(id));
        filter = { subSpecialityID: { $in: ids } };
      } else {
        filter = { subSpecialityID: Number(req.query.subSpecialityID) };
      }
    }

    // Other query filters
    else if (Object.keys(req.query).length > 0) {
      filter = buildSubSpecialityFilter(req.query);
    }

    // Body filter
    else if (req.body.filter) {
      if (typeof req.body.filter !== 'object')
        return res.status(400).json({ error: 'Provide valid filter' });
      filter = req.body.filter;
    }

    else {
      return res.status(400).json({ error: 'No filter provided. Use query params, body filter, or /bulk/:ids' });
    }

    // Get docs before delete
    const toDelete = await SubSpeciality.find(filter);
    if (!toDelete.length)
      return res.status(404).json({ message: 'No sub-specialities found matching the criteria' });

    const result = await SubSpeciality.deleteMany(filter);
    if (result.deletedCount === 0)
      return res.status(404).json({ message: 'No sub-specialities were deleted' });

    // If only one deleted, return single doc
    if (
      (req.query.subSpecialityID && !String(req.query.subSpecialityID).includes(',')) ||
      (req.params.ids && req.params.ids.split(',').length === 1)
    ) {
      res.json({ message: 'Sub-speciality deleted', subSpeciality: toDelete[0] });
    } else {
      res.json({
        message: 'Sub-specialities deleted',
        deletedCount: result.deletedCount,
        deletedSubSpecialities: toDelete
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

