const Module = require('../models/Modules');
const getNextSequence = require('../utils/getNextSequence');

// Utility: build filter from query params
const buildModuleFilter = (query) => {
  const filter = {};
  if (!query) return filter;

  for (const key in query) {
    const value = query[key];
    if (value === undefined || value === '') continue;
    if (key === 'moduleID') {
      filter[key] = Number(value);
    } else if (key === 'moduleName') {
      filter[key] = { $regex: value, $options: 'i' };
    } else {
      filter[key] = value;
    }
  }
  return filter;
};

// GET: all or filtered modules (enriched with count of users using the module) - handles all cases including by ID
exports.getModules = async (req, res) => {
  try {
    const filter = buildModuleFilter(req.query);
    const modules = await Module.aggregate([
      { $match: filter },
      {
        $lookup: {
          from: 'users',
          localField: 'moduleID',
          foreignField: 'modules',
          as: 'usersUsingModule'
        }
      },
      { $addFields: { usersCount: { $size: '$usersUsingModule' } } },
      { $project: { usersUsingModule: 0 } }
    ]);

    if (!modules.length) {
      return res.status(404).json({ message: 'No modules found.' });
    }

    // If filtering by moduleID, return single object, otherwise return array
    if (req.query.moduleID) {
      res.json(modules[0]);
    } else {
      res.json(modules);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST: add one or many modules
exports.addModule = async (req, res) => {
  try {
    const payload = req.body;
    const getNextModuleID = async () => await getNextSequence('moduleID');

    // Check uniqueness for moduleName
    const exists = async (moduleName) => await Module.exists({ moduleName });

    if (!Array.isArray(payload)) {
      if (await exists(payload.moduleName)) {
        return res.status(409).json({ error: 'A module with this name already exists.' });
      }
      if (!payload.moduleID) payload.moduleID = await getNextModuleID();
      const newModule = new Module(payload);
      const saved = await newModule.save();
      return res.status(201).json(saved);
    }

    // Bulk insert
    const names = payload.map(r => r.moduleName);
    const dbModules = await Module.find({ moduleName: { $in: names } }, { moduleName: 1 });
    const dbNames = new Set(dbModules.map(r => r.moduleName));
    const duplicateNames = names.filter((name, idx) => names.indexOf(name) !== idx);

    const errors = [];
    const modulesToInsert = [];
    for (const module of payload) {
      if (dbNames.has(module.moduleName)) {
        errors.push({ moduleName: module.moduleName, error: 'Duplicate name in DB.' });
        continue;
      }
      if (duplicateNames.includes(module.moduleName)) {
        errors.push({ moduleName: module.moduleName, error: 'Duplicate name in request payload.' });
        continue;
      }
      if (!module.moduleID) module.moduleID = await getNextModuleID();
      modulesToInsert.push(module);
    }

    if (!modulesToInsert.length) {
      return res.status(409).json({ error: 'No modules inserted due to duplicates.', details: errors });
    }

    const inserted = await Module.insertMany(modulesToInsert);
    const response = { inserted };
    if (errors.length) response.errors = errors;
    res.status(errors.length > 0 ? 207 : 201).json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// bulkUpdateModules: removed per requirement

// PUT: update modules by query filter
exports.updateModule = async (req, res) => {
  const filter = req.query;
  const updateData = req.body;

  if (!Object.keys(filter).length) {
    return res.status(400).json({ error: 'No filter provided.' });
  }
  if (!Object.keys(updateData).length) {
    return res.status(400).json({ error: 'No update data provided.' });
  }

  try {
    const result = await Module.updateMany(filter, { $set: updateData });
    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: 'No matching modules found to update.' });
    }
    const updated = await Module.find(filter);
    res.json({
      message: 'Module(s) updated',
      updatedCount: result.modifiedCount,
      updatedModules: updated.length === 1 ? updated[0] : updated,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ------------------ DELETE ------------------
exports.deleteModules = async (req, res) => {
  try {
    let filter = {};

    // Bulk IDs from params
    if (req.params.ids) {
      const ids = req.params.ids
        .split(',')
        .map(id => Number(id.trim()))
        .filter(id => !isNaN(id));
      if (!ids.length) return res.status(400).json({ error: 'No valid IDs provided' });
      filter = { moduleID: { $in: ids } };
    }

    // Single or multiple IDs from query
    else if (req.query.moduleID) {
      if (typeof req.query.moduleID === 'string' && req.query.moduleID.includes(',')) {
        const ids = req.query.moduleID
          .split(',')
          .map(id => Number(id.trim()))
          .filter(id => !isNaN(id));
        filter = { moduleID: { $in: ids } };
      } else {
        filter = { moduleID: Number(req.query.moduleID) };
      }
    }

    // Other query filters
    else if (Object.keys(req.query).length > 0) {
      filter = buildModuleFilter(req.query);
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
    const toDelete = await Module.find(filter);
    if (!toDelete.length)
      return res.status(404).json({ message: 'No modules found matching the criteria' });

    const result = await Module.deleteMany(filter);
    if (result.deletedCount === 0)
      return res.status(404).json({ message: 'No modules were deleted' });

    // If single delete → return single doc
    if (
      (req.query.moduleID && !String(req.query.moduleID).includes(',')) ||
      (req.params.ids && req.params.ids.split(',').length === 1)
    ) {
      res.json({ message: 'Module deleted', module: toDelete[0] });
    } else {
      res.json({
        message: 'Modules deleted',
        deletedCount: result.deletedCount,
        deletedModules: toDelete
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

