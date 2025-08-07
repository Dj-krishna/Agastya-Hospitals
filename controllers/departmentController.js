const Department = require('../models/Departments');
const getNextSequence = require('../utils/getNextSequence');

// Utility: build filter from query params
const buildDepartmentFilter = (query) => {
  const filter = {};
  if (!query) return filter;

  for (const key in query) {
    const value = query[key];
    if (value === undefined || value === '') continue;
    if (key === 'departmentID') {
      filter[key] = Number(value);
    } else if (key === 'departmentName') {
      filter[key] = { $regex: value, $options: 'i' };
    } else {
      filter[key] = value;
    }
  }
  return filter;
};

// GET: all or filtered departments
exports.getDepartments = async (req, res) => {
  try {
    const filter = buildDepartmentFilter(req.query);
    const departments = await Department.find(filter);

    if (!departments.length) {
      return res.status(404).json({ message: 'No departments found.' });
    }

    res.json(departments.length === 1 ? departments[0] : departments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET: single by departmentID
exports.getDepartmentById = async (req, res) => {
  try {
    const departmentID = Number(req.params.id);
    const department = await Department.findOne({ departmentID });
    if (!department) {
      return res.status(404).json({ message: 'Department not found.' });
    }
    res.json(department);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST: add one or many departments
exports.addDepartment = async (req, res) => {
  try {
    const payload = req.body;
    const getNextDeptID = async () => await getNextSequence('departmentID');

    const exists = async (departmentName) => await Department.exists({ departmentName });

    if (!Array.isArray(payload)) {
      if (await exists(payload.departmentName)) {
        return res.status(409).json({ error: 'A department with this name already exists.' });
      }
      if (!payload.departmentID) payload.departmentID = await getNextDeptID();
      const newDepartment = new Department(payload);
      const saved = await newDepartment.save();
      return res.status(201).json(saved);
    }

    // Bulk insert
    const names = payload.map(r => r.departmentName);
    const dbDepartments = await Department.find({ departmentName: { $in: names } }, { departmentName: 1 });
    const dbNames = new Set(dbDepartments.map(r => r.departmentName));
    const duplicateNames = names.filter((name, idx) => names.indexOf(name) !== idx);

    const errors = [];
    const departmentsToInsert = [];
    for (const department of payload) {
      if (dbNames.has(department.departmentName)) {
        errors.push({ departmentName: department.departmentName, error: 'Duplicate name in DB.' });
        continue;
      }
      if (duplicateNames.includes(department.departmentName)) {
        errors.push({ departmentName: department.departmentName, error: 'Duplicate name in request payload.' });
        continue;
      }
      if (!department.departmentID) department.departmentID = await getNextDeptID();
      departmentsToInsert.push(department);
    }

    if (!departmentsToInsert.length) {
      return res.status(409).json({ error: 'No departments inserted due to duplicates.', details: errors });
    }

    const inserted = await Department.insertMany(departmentsToInsert);
    const response = { inserted };
    if (errors.length) response.errors = errors;
    res.status(errors.length > 0 ? 207 : 201).json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT: bulk update departments
exports.bulkUpdateDepartments = async (req, res) => {
  const { filter, updateFields, updates } = req.body;

  try {
    if (filter && updateFields) {
      const result = await Department.updateMany(filter, { $set: updateFields });
      return res.json({ message: 'Departments updated', modifiedCount: result.modifiedCount });
    } else if (Array.isArray(updates)) {
      const bulkOps = updates.map(u => ({
        updateOne: { filter: u.filter, update: { $set: u.updateFields } }
      }));
      const result = await Department.bulkWrite(bulkOps);
      return res.json({ message: 'Departments updated (multi)', modifiedCount: result.modifiedCount });
    } else {
      return res.status(400).json({ error: 'Invalid update structure.' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT: update departments by query filter
exports.updateDepartment = async (req, res) => {
  const filter = req.query;
  const updateData = req.body;

  if (!Object.keys(filter).length) {
    return res.status(400).json({ error: 'No filter provided.' });
  }
  if (!Object.keys(updateData).length) {
    return res.status(400).json({ error: 'No update data provided.' });
  }

  try {
    const result = await Department.updateMany(filter, { $set: updateData });
    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: 'No matching departments found to update.' });
    }
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

// DELETE: delete single department by departmentID
exports.deleteDepartmentById = async (req, res) => {
  try {
    const departmentID = Number(req.params.id);
    const deleted = await Department.findOneAndDelete({ departmentID });
    if (!deleted) {
      return res.status(404).json({ message: 'Department not found.' });
    }
    res.json({ message: 'Department deleted', department: deleted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE: delete multiple departments by filter in body
exports.deleteDepartmentsByFilter = async (req, res) => {
  try {
    const { filter } = req.body;
    if (!filter || typeof filter !== 'object') {
      return res.status(400).json({ error: 'Provide valid filter.' });
    }
    const result = await Department.deleteMany(filter);
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'No departments matched filter.' });
    }
    res.json({ message: 'Departments deleted', deletedCount: result.deletedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE: bulk delete by comma-separated departmentIDs in path
exports.bulkDeleteDepartmentsByIds = async (req, res) => {
  try {
    const idsParam = req.params.ids;
    if (!idsParam) {
      return res.status(400).json({ error: 'No IDs provided.' });
    }
    const ids = idsParam.split(',').map(id => Number(id.trim())).filter(id => !isNaN(id));
    if (ids.length === 0) {
      return res.status(400).json({ error: 'No valid IDs provided.' });
    }
    const result = await Department.deleteMany({ departmentID: { $in: ids } });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'No departments found for provided IDs.' });
    }
    res.json({ message: 'Departments deleted', deletedCount: result.deletedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
