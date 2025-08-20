const Department = require('../models/Departments');
const getNextSequence = require('../utils/getNextSequence');

// ------------------- UTILITY -------------------
const buildDepartmentFilter = (query) => {
  const filter = {};
  if (!query) return filter;

  for (const key in query) {
    const value = query[key];
    if (value === undefined || value === '') continue;
    if (key === 'departmentID') filter[key] = Number(value);
    else if (key === 'departmentName') filter[key] = { $regex: value, $options: 'i' };
    else filter[key] = value;
  }
  return filter;
};

// ------------------- GET -------------------
exports.getDepartments = async (req, res) => {
  try {
    const filter = buildDepartmentFilter(req.query);
    const departments = await Department.find(filter);
    if (!departments.length) return res.status(404).json({ message: 'No departments found.' });
    
    // If filtering by departmentID, return single object, otherwise return array
    if (req.query.departmentID) {
      res.json(departments[0]);
    } else {
      res.json(departments);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ------------------- POST -------------------
exports.addDepartment = async (req, res) => {
  try {
    const payload = Array.isArray(req.body) ? req.body : [req.body];
    const departmentsToInsert = [];
    const errors = [];

    for (const department of payload) {
      // Validate name
      if (!department.departmentName) {
        errors.push({ department, error: 'departmentName is required.' });
        continue;
      }

      // Check DB duplicate
      const exists = await Department.exists({ departmentName: department.departmentName });
      if (exists) {
        errors.push({ departmentName: department.departmentName, error: 'Already exists in DB.' });
        continue;
      }

      // Assign departmentID only after validation
      if (!department.departmentID) department.departmentID = await getNextSequence('departmentID');
      departmentsToInsert.push(department);
    }

    if (!departmentsToInsert.length) {
      return res.status(409).json({ message: 'No departments inserted.', errors });
    }

    const inserted = await Department.insertMany(departmentsToInsert);
    const response = { inserted };
    if (errors.length) response.errors = errors;
    res.status(errors.length ? 207 : 201).json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ------------------- PUT -------------------
exports.updateDepartment = async (req, res) => {
  try {
    const filter = buildDepartmentFilter(req.query);
    const updateData = req.body;

    if (!Object.keys(filter).length) return res.status(400).json({ error: 'No filter provided.' });
    if (!Object.keys(updateData).length) return res.status(400).json({ error: 'No update data provided.' });

    const result = await Department.updateMany(filter, { $set: updateData });
    if (result.modifiedCount === 0) return res.status(404).json({ message: 'No matching departments found.' });

    const updated = await Department.find(filter);
    res.json({
      message: 'Department(s) updated',
      updatedCount: result.modifiedCount,
      updatedDepartments: updated.length === 1 ? updated[0] : updated,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ------------------- DELETE -------------------
exports.deleteDepartments = async (req, res) => {
  try {
    let filter = {};

    // Bulk IDs from params
    if (req.params.ids) {
      const ids = req.params.ids
        .split(',')
        .map(id => Number(id.trim()))
        .filter(id => !isNaN(id));
      if (!ids.length) return res.status(400).json({ error: 'No valid IDs provided' });
      filter = { departmentID: { $in: ids } };
    }

    // Single or multiple IDs from query
    else if (req.query.departmentID) {
      if (typeof req.query.departmentID === 'string' && req.query.departmentID.includes(',')) {
        const ids = req.query.departmentID
          .split(',')
          .map(id => Number(id.trim()))
          .filter(id => !isNaN(id));
        filter = { departmentID: { $in: ids } };
      } else {
        filter = { departmentID: Number(req.query.departmentID) };
      }
    }

    // Other query filters
    else if (Object.keys(req.query).length > 0) {
      filter = buildDepartmentFilter(req.query);
    }

    // Body filter
    else if (req.body.filter) {
      if (typeof req.body.filter !== 'object') return res.status(400).json({ error: 'Provide valid filter' });
      filter = req.body.filter;
    }

    else {
      return res.status(400).json({ error: 'No filter provided. Use query params, body filter, or /bulk/:ids' });
    }

    // Fetch documents before deleting
    const toDelete = await Department.find(filter);
    if (!toDelete.length) return res.status(404).json({ message: 'No departments found matching the criteria' });

    const result = await Department.deleteMany(filter);
    if (result.deletedCount === 0) return res.status(404).json({ message: 'No departments were deleted' });

    // If only one item deleted, send that item back
    if (
      (req.query.departmentID && !String(req.query.departmentID).includes(',')) ||
      (req.params.ids && req.params.ids.split(',').length === 1)
    ) {
      res.json({ message: 'Department deleted', department: toDelete[0] });
    } else {
      res.json({
        message: 'Departments deleted',
        deletedCount: result.deletedCount,
        deletedDepartments: toDelete
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
