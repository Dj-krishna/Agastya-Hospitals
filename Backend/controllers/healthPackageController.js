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

// GET all or filtered (enriched with usage counts by patients) - handles all cases including by ID
exports.getHealthPackages = async (req, res) => {
  try {
    const filter = buildPackageFilter(req.query);
    const packages = await HealthPackage.aggregate([
      { $match: filter },
      {
        $lookup: {
          from: 'patients',
          localField: 'packageID',
          foreignField: 'packageIDs',
          as: 'patientsWithPackage'
        }
      },
      { $addFields: { patientsCount: { $size: '$patientsWithPackage' } } },
      { $project: { patientsWithPackage: 0 } },
      { $sort: { packageID: 1 } }
    ]);
    
    if (!packages.length) {
      return res.status(404).json({ message: 'No health packages found.' });
    }
    
    // If filtering by packageID, return single object, otherwise return array
    if (req.query.packageID) {
      res.json(packages[0]);
    } else {
      res.json(packages);
    }
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

// bulkUpdateHealthPackages: removed per requirement

// ------------------ DELETE ------------------
exports.deleteHealthPackages = async (req, res) => {
  try {
    let filter = {};

    // Bulk IDs from params
    if (req.params.ids) {
      const ids = req.params.ids
        .split(',')
        .map(id => Number(id.trim()))
        .filter(id => !isNaN(id));
      if (!ids.length) return res.status(400).json({ error: 'No valid IDs provided' });
      filter = { packageID: { $in: ids } };
    }

    // Single or multiple IDs from query
    else if (req.query.packageID) {
      if (typeof req.query.packageID === 'string' && req.query.packageID.includes(',')) {
        const ids = req.query.packageID
          .split(',')
          .map(id => Number(id.trim()))
          .filter(id => !isNaN(id));
        filter = { packageID: { $in: ids } };
      } else {
        filter = { packageID: Number(req.query.packageID) };
      }
    }

    // Other query filters
    else if (Object.keys(req.query).length > 0) {
      filter = buildPackageFilter(req.query);
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
    const toDelete = await HealthPackage.find(filter);
    if (!toDelete.length)
      return res.status(404).json({ message: 'No health packages found matching the criteria' });

    const result = await HealthPackage.deleteMany(filter);
    if (result.deletedCount === 0)
      return res.status(404).json({ message: 'No health packages were deleted' });

    // If single delete → return single object
    if (
      (req.query.packageID && !String(req.query.packageID).includes(',')) ||
      (req.params.ids && req.params.ids.split(',').length === 1)
    ) {
      res.json({ message: 'Package deleted', package: toDelete[0] });
    } else {
      res.json({
        message: 'Packages deleted',
        deletedCount: result.deletedCount,
        deletedPackages: toDelete
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

