const HealthPackage = require('../models/HealthPackages');
const getNextSequence = require('../utils/getNextSequence');

// Utility: build filter from query for GET
const buildHealthPackageFilter = (query) => {
  const filter = {};
  const numFields = ['packageID', 'price', 'discountPrice', 'totalLabTests'];
  for (const key in query) {
    const value = query[key];
    if (value === undefined || value === '') continue;
    if (numFields.includes(key)) {
      filter[key] = Number(value);
    } else if (key === 'packageName') {
      filter[key] = { $regex: value, $options: 'i' };
    } else if (key === 'allTestNames') {
      filter[key] = { allTestNames: { $in: Array.isArray(value) ? value : [value] }};
    } else {
      filter[key] = value;
    }
  }
  return filter;
};

// GET all or filtered packages
exports.getHealthPackages = async (req, res) => {
  try {
    const filter = buildHealthPackageFilter(req.query);
    const healthPackages = await HealthPackage.find(filter);
    if (!healthPackages.length) {
      return res.status(404).json({ message: 'No health packages found.' });
    }
    res.json(healthPackages.length === 1 ? healthPackages[0] : healthPackages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET single by packageID
exports.getHealthPackageById = async (req, res) => {
  try {
    const packageID = Number(req.params.id);
    const healthPackage = await HealthPackage.findOne({ packageID });
    if (!healthPackage) return res.status(404).json({ message: 'Health package not found.' });
    res.json(healthPackage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST add one or many
exports.addHealthPackage = async (req, res) => {
  try {
    const payload = req.body;
    const getNextPackageID = async () => await getNextSequence('packageID');

    // Uniqueness: Assume packageName should be unique.
    const exists = async (packageName) => {
      return await HealthPackage.exists({ packageName });
    };

    if (!Array.isArray(payload)) {
      if (await exists(payload.packageName)) {
        return res.status(409).json({ error: 'A package with this name already exists.' });
      }
      if (!payload.packageID) payload.packageID = await getNextPackageID();
      const newPackage = new HealthPackage(payload);
      const saved = await newPackage.save();
      return res.status(201).json(saved);
    }

    // Bulk insert
    const names = payload.map(hp => hp.packageName);
    const dbPkgs = await HealthPackage.find({ packageName: { $in: names } }, { packageName: 1 });
    const dbNames = new Set(dbPkgs.map(p => p.packageName));
    const duplicateNames = names.filter((name, idx) => names.indexOf(name) !== idx);

    const errors = [];
    const pkgsToInsert = [];
    for (const pkg of payload) {
      if (dbNames.has(pkg.packageName)) {
        errors.push({ packageName: pkg.packageName, error: 'Duplicate in DB.' });
        continue;
      }
      if (duplicateNames.includes(pkg.packageName)) {
        errors.push({ packageName: pkg.packageName, error: 'Duplicate in request payload.' });
        continue;
      }
      if (!pkg.packageID) pkg.packageID = await getNextPackageID();
      pkgsToInsert.push(pkg);
    }
    if (!pkgsToInsert.length) {
      return res.status(409).json({ error: 'No health packages inserted due to duplicates.', details: errors });
    }
    const inserted = await HealthPackage.insertMany(pkgsToInsert);
    let response = { inserted };
    if (errors.length) response.errors = errors;
    res.status(errors.length ? 207 : 201).json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT: Bulk update
exports.bulkUpdateHealthPackages = async (req, res) => {
  const { filter, updateFields, updates } = req.body;
  try {
    if (filter && updateFields) {
      const result = await HealthPackage.updateMany(filter, { $set: updateFields });
      return res.json({ message: 'Health packages updated', modifiedCount: result.modifiedCount });
    } else if (Array.isArray(updates)) {
      const bulkOps = updates.map(u => ({
        updateOne: { filter: u.filter, update: { $set: u.updateFields } }
      }));
      const result = await HealthPackage.bulkWrite(bulkOps);
      return res.json({ message: 'Health packages updated (multi)', modifiedCount: result.modifiedCount });
    } else {
      return res.status(400).json({ error: 'Invalid update structure' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT: update by filter (single or many)
exports.updateHealthPackage = async (req, res) => {
  const filter = req.query;
  const updateData = req.body;
  if (!Object.keys(filter).length) return res.status(400).json({ error: 'No filter provided' });
  if (!Object.keys(updateData).length) return res.status(400).json({ error: 'No update data provided' });

  try {
    const result = await HealthPackage.updateMany(filter, { $set: updateData });
    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: 'No matching health packages found to update' });
    }
    const updated = await HealthPackage.find(filter);
    return res.json({
      message: 'Health package(s) updated',
      updatedCount: result.modifiedCount,
      updatedPackages: updated.length === 1 ? updated[0] : updated,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE by packageID
exports.deleteHealthPackageById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const deleted = await HealthPackage.findOneAndDelete({ packageID: id });
    if (!deleted) return res.status(404).json({ message: 'Health package not found' });
    return res.json({ message: 'Health package deleted', healthPackage: deleted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE by filter
exports.deleteHealthPackagesByFilter = async (req, res) => {
  try {
    const { filter } = req.body;
    if (!filter || typeof filter !== 'object') return res.status(400).json({ error: 'Provide valid filter' });
    const result = await HealthPackage.deleteMany(filter);
    if (!result.deletedCount) return res.status(404).json({ message: 'No health packages matched filter' });
    return res.json({ message: 'Health packages deleted', deletedCount: result.deletedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE: bulk delete by comma-separated IDs
exports.bulkDeleteHealthPackagesByIds = async (req, res) => {
  try {
    const idsParam = req.params.ids;
    if (!idsParam) return res.status(400).json({ error: 'No IDs provided' });
    const ids = idsParam.split(',').map(id => Number(id.trim())).filter(id => !isNaN(id));
    if (!ids.length) return res.status(400).json({ error: 'No valid IDs provided' });
    const result = await HealthPackage.deleteMany({ packageID: { $in: ids } });
    if (!result.deletedCount) return res.status(404).json({ message: 'No health packages found for provided IDs' });
    res.json({ message: 'Health packages deleted', deletedCount: result.deletedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
