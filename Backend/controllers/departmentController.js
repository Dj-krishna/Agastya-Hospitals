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
    res.json(departments.length === 1 ? departments[0] : departments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getDepartmentById = async (req, res) => {
  try {
    const departmentID = Number(req.params.id);
    if (isNaN(departmentID)) return res.status(400).json({ error: 'Invalid departmentID' });
    const department = await Department.findOne({ departmentID });
    if (!department) return res.status(404).json({ message: 'Department not found.' });
    res.json(department);
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
exports.deleteDepartmentById = async (req, res) => {
  try {
    const departmentID = Number(req.params.id);
    if (isNaN(departmentID)) return res.status(400).json({ error: 'Invalid departmentID' });

    const deleted = await Department.findOneAndDelete({ departmentID });
    if (!deleted) return res.status(404).json({ message: 'Department not found.' });

    res.json({ message: 'Department deleted', department: deleted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteDepartmentsByFilter = async (req, res) => {
  try {
    const { filter } = req.body;
    if (!filter || typeof filter !== 'object') return res.status(400).json({ error: 'Provide valid filter.' });

    const result = await Department.deleteMany(filter);
    if (result.deletedCount === 0) return res.status(404).json({ message: 'No departments matched filter.' });

    res.json({ message: 'Departments deleted', deletedCount: result.deletedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.bulkDeleteDepartmentsByIds = async (req, res) => {
  try {
    const ids = req.params.ids
      ?.split(',')
      .map((id) => Number(id.trim()))
      .filter((id) => !isNaN(id));

    if (!ids || !ids.length) return res.status(400).json({ error: 'No valid IDs provided.' });

    const result = await Department.deleteMany({ departmentID: { $in: ids } });
    if (result.deletedCount === 0) return res.status(404).json({ message: 'No departments found for provided IDs.' });

    res.json({ message: 'Departments deleted', deletedCount: result.deletedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// bulkUpdateDepartments: removed per requirement