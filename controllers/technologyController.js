const Technology = require('../models/Technologies');
const getNextSequence = require('../utils/getNextSequence');

// Safe file URL extraction (ImageKit or Multer)
const getFileUrl = (fileArr) => {
  if (!fileArr || !Array.isArray(fileArr) || fileArr.length === 0) return null;
  const f = fileArr[0];
  return f.url || f.path || f.location || null;
};

// Validate and normalize technology input
const validateAndNormalizeTechnology = async (technology, isUpdate = false) => {
  const errors = [];
  let normalizedTechnology = { ...technology };

  // Required fields only for create
  if (!isUpdate) {
    if (!normalizedTechnology.technologyName) errors.push('technologyName is required');
  }

  return { normalizedTechnology, errors };
};

// Build filter from query for search
const buildTechnologyFilter = (query) => {
  const filter = {};
  const regexMatchFields = ['technologyName', 'speciality'];

  for (const key in query) {
    const value = query[key];
    if (!value) continue;

    if (key === 'technologyID') {
      filter[key] = Number(value);
    } else if (regexMatchFields.includes(key)) {
      filter[key] = { $regex: value, $options: 'i' };
    } else {
      filter[key] = { $regex: value, $options: 'i' };
    }
  }
  return filter;
};

// GET /technologies
exports.getTechnologies = async (req, res) => {
  try {
    const filter = buildTechnologyFilter(req.query);
    const technologies = await Technology.find(filter).sort({ technologyName: 1 });

    if (technologies.length === 0) {
      return res.status(404).json({ success: false, message: 'No technologies found matching the criteria.', data: [] });
    }

    if (req.query.technologyID) {
      res.json({ success: true, message: 'Technology retrieved successfully', data: technologies[0] });
    } else {
      res.json({ success: true, message: 'Technologies retrieved successfully', count: technologies.length, data: technologies });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// POST /technologies
exports.addTechnology = async (req, res) => {
  try {
    let payload = req.body;
    if (!payload || typeof payload !== 'object') {
      return res.status(400).json({ success: false, error: 'Invalid request body' });
    }

    const { normalizedTechnology, errors } = await validateAndNormalizeTechnology(payload);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, error: 'Validation failed', details: errors });
    }

    if (!normalizedTechnology.technologyID) {
      normalizedTechnology.technologyID = await getNextSequence('technologyID');
    }

    // Handle file uploads
    if (req.files && req.files.icon) {
      normalizedTechnology.icon = getFileUrl(req.files.icon);
    }

    const saved = await new Technology(normalizedTechnology).save();

    res.status(201).json({ success: true, message: 'Technology created successfully', data: saved });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// PUT /technologies/:technologyID
exports.updateTechnology = async (req, res) => {
  try {
    const technologyID = req.query.technologyID;
    if (!technologyID) {
      return res.status(400).json({ success: false, error: 'technologyID is required in query parameter' });
    }

    let updateData = { ...req.body };
    if (typeof updateData === 'string') {
      try {
        updateData = JSON.parse(updateData);
      } catch (e) {
        return res.status(400).json({ success: false, error: 'Invalid JSON in body' });
      }
    }

    delete updateData._id;
    delete updateData.technologyID;

    const { normalizedTechnology, errors } = await validateAndNormalizeTechnology(updateData, true);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, error: 'Validation failed', details: errors });
    }

    // Handle file uploads
    if (req.files && req.files.icon) {
      normalizedTechnology.icon = getFileUrl(req.files.icon);
    }

    const filter = { technologyID: Number(technologyID) };
    const result = await Technology.updateOne(filter, { $set: normalizedTechnology });

    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, message: 'No technology found to update' });
    }

    const updatedTechnology = await Technology.findOne(filter);

    res.json({ success: true, message: 'Technology updated successfully', data: updatedTechnology });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// DELETE /technologies
exports.deleteTechnologies = async (req, res) => {
  try {
    let filter = {};
    if (req.params.ids) {
      const ids = req.params.ids.split(',').map((id) => Number(id.trim())).filter((id) => !isNaN(id));
      filter = { technologyID: { $in: ids } };
    } else if (req.query.technologyID) {
      filter = { technologyID: Number(req.query.technologyID) };
    } else if (req.body.filter) {
      filter = req.body.filter;
    } else {
      return res.status(400).json({ success: false, error: 'No filter provided.' });
    }

    const toDelete = await Technology.find(filter);
    if (toDelete.length === 0) {
      return res.status(404).json({ success: false, message: 'No technologies found' });
    }

    const result = await Technology.deleteMany(filter);

    res.json({
      success: true,
      message: result.deletedCount === 1 ? 'Technology deleted successfully' : 'Technologies deleted successfully',
      deletedCount: result.deletedCount,
      data: toDelete,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
