const HealthPackage = require('../models/HealthPackages');
const getNextSequence = require('../utils/getNextSequence');

// Auto-calculate discountPrice (if not provided or if auto mode)
function calculateDiscountPrice(pkg) {
  if (!pkg) return;
  if (pkg.discountType === 'Fixed') {
    pkg.discountPrice = Math.max(0, Number(pkg.price) - Number(pkg.discountAmount));
  } else if (pkg.discountType === 'Percentage') {
    pkg.discountPrice = Math.max(0, Number(pkg.price) - (Number(pkg.price) * Number(pkg.discountAmount) / 100));
  }
}

// Build filter from query
const buildPackageFilter = (query) => {
  const filter = {};
  for (const key in query) {
    let value = query[key];
    if (!value) continue;

    if (['packageID', 'price', 'totalLabTests', 'discountAmount', 'discountPrice'].includes(key)) {
      filter[key] = Number(value);
    } else if (['discountType', 'packageName', 'createdBy', 'updatedBy'].includes(key)) {
      filter[key] = { $regex: value, $options: 'i' };
    } else if (key === 'allTestNames') {
      filter[key] = { $in: value.split(',').map(s => s.trim()) };
    }
  }
  return filter;
};

// GET all or filtered
exports.getHealthPackages = async (req, res) => {
  try {
    const filter = buildPackageFilter(req.query);
    const packages = await HealthPackage.find(filter).sort({ packageID: 1 });
    res.json(packages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET by ID
exports.getHealthPackageById = async (req, res) => {
  try {
    const pkg = await HealthPackage.findOne({ packageID: Number(req.params.id) });
    if (!pkg) return res.status(404).json({ message: 'Health package not found' });
    res.json(pkg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ADD single or bulk
exports.addHealthPackage = async (req, res) => {
  try {
    const payload = req.body;

    const getNextPackageID = async () => await getNextSequence('packageID');

    // Single insert
    if (!Array.isArray(payload)) {
      if (!payload.packageID) payload.packageID = await getNextPackageID();
      if (!payload.discountPrice) calculateDiscountPrice(payload);

      const pkg = new HealthPackage(payload);
      const saved = await pkg.save();
      return res.status(201).json(saved);
    }

    // Bulk insert
    const toInsert = [];
    for (const pack of payload) {
      if (!pack.packageID) pack.packageID = await getNextPackageID();
      if (!pack.discountPrice) calculateDiscountPrice(pack);
      toInsert.push(pack);
    }
    const inserted = await HealthPackage.insertMany(toInsert);
    res.status(201).json(inserted);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE by filter
exports.updateHealthPackage = async (req, res) => {
  const filter = req.query;
  const updateData = req.body;
  if (!Object.keys(filter).length)
    return res.status(400).json({ error: 'No filter provided' });
  if (!Object.keys(updateData).length)
    return res.status(400).json({ error: 'No update data provided' });

  // If price/discount changed, recalc discountPrice
  if (updateData.price !== undefined || updateData.discountType !== undefined || updateData.discountAmount !== undefined) {
    calculateDiscountPrice(updateData);
  }

  try {
    const result = await HealthPackage.updateMany(filter, { $set: updateData });
    if (result.modifiedCount === 0)
      return res.status(404).json({ message: 'No matching packages found to update' });
    const updated = await HealthPackage.find(filter);
    res.json({ message: 'Package(s) updated', updatedCount: result.modifiedCount, updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// BULK UPDATE
exports.bulkUpdateHealthPackages = async (req, res) => {
  try {
    const { updates } = req.body;
    if (!Array.isArray(updates) || updates.length === 0)
      return res.status(400).json({ error: 'No updates provided' });

    const allowedFields = Object.keys(HealthPackage.schema.paths);
    const results = [];
    const warnings = [];

    for (const upd of updates) {
      const { filter, updateFields } = upd;
      if (!filter || !updateFields || typeof filter !== 'object' || typeof updateFields !== 'object') {
        warnings.push({ filter, error: 'Invalid update structure' });
        continue;
      }
      // Validate fields
      const invalidFields = Object.keys(updateFields).filter(f => !allowedFields.includes(f));
      if (invalidFields.length) {
        warnings.push({ filter, warning: `Invalid fields: ${invalidFields.join(', ')}` });
        continue;
      }
      // Recalculate discountPrice if needed
      if (updateFields.price !== undefined || updateFields.discountType !== undefined || updateFields.discountAmount !== undefined) {
        calculateDiscountPrice(updateFields);
      }
      const result = await HealthPackage.findOneAndUpdate(filter, { $set: updateFields }, { new: true });
      if (result) results.push(result);
      else warnings.push({ filter, warning: 'Package not found' });
    }

    res.json({ message: 'Bulk update completed', updated: results.length, results, warnings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE by ID
exports.deleteHealthPackageById = async (req, res) => {
  try {
    const deleted = await HealthPackage.findOneAndDelete({ packageID: Number(req.params.id) });
    if (!deleted)
      return res.status(404).json({ message: 'Health package not found' });
    res.json({ message: 'Package deleted', package: deleted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE by filter
exports.deleteHealthPackagesByFilter = async (req, res) => {
  try {
    const { filter } = req.body;
    if (!filter || typeof filter !== 'object')
      return res.status(400).json({ error: 'Provide valid filter' });
    const result = await HealthPackage.deleteMany(filter);
    if (result.deletedCount === 0)
      return res.status(404).json({ message: 'No packages matched filter' });
    res.json({ message: 'Packages deleted', deletedCount: result.deletedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// BULK DELETE by IDs
exports.bulkDeleteHealthPackagesByIds = async (req, res) => {
  try {
    const idsParam = req.params.ids;
    if (!idsParam)
      return res.status(400).json({ error: 'No IDs provided' });
    const ids = idsParam.split(',').map(id => Number(id.trim())).filter(id => !isNaN(id));
    if (ids.length === 0)
      return res.status(400).json({ error: 'No valid IDs provided' });
    const result = await HealthPackage.deleteMany({ packageID: { $in: ids } });
    if (result.deletedCount === 0)
      return res.status(404).json({ message: 'No packages found for provided IDs' });
    res.json({ message: 'Packages deleted', deletedCount: result.deletedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
