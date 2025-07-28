const UserRole = require('../models/UserRoles');
const getNextSequence = require('../utils/getNextSequence');

// Utility: build filter from query params
const buildUserRoleFilter = (query) => {
  const filter = {};
  if (!query) return filter;

  for (const key in query) {
    const value = query[key];
    if (value === undefined || value === '') continue;
    if (key === 'roleID') {
      filter[key] = Number(value);
    } else if (key === 'roleName') {
      filter[key] = { $regex: value, $options: 'i' };
    } else {
      filter[key] = value;
    }
  }

  return filter;
};

// GET: all or filtered user roles
exports.getUserRoles = async (req, res) => {
  try {
    const filter = buildUserRoleFilter(req.query);
    const roles = await UserRole.find(filter);

    if (!roles.length) {
      return res.status(404).json({ message: 'No user roles found.' });
    }

    res.json(roles.length === 1 ? roles[0] : roles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET: single by roleID
exports.getUserRoleById = async (req, res) => {
  try {
    const roleID = Number(req.params.id);
    const role = await UserRole.findOne({ roleID });
    if (!role) {
      return res.status(404).json({ message: 'User role not found.' });
    }
    res.json(role);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST: add one or many user roles
exports.addUserRole = async (req, res) => {
  try {
    const payload = req.body;
    const getNextRoleID = async () => await getNextSequence('roleID');

    // Check uniqueness for roleName
    const exists = async (roleName) => await UserRole.exists({ roleName });

    if (!Array.isArray(payload)) {
      if (await exists(payload.roleName)) {
        return res.status(409).json({ error: 'A role with this name already exists.' });
      }
      if (!payload.roleID) payload.roleID = await getNextRoleID();
      const newRole = new UserRole(payload);
      const saved = await newRole.save();
      return res.status(201).json(saved);
    }

    // Bulk insert
    const names = payload.map(r => r.roleName);
    const dbRoles = await UserRole.find({ roleName: { $in: names } }, { roleName: 1 });
    const dbNames = new Set(dbRoles.map(r => r.roleName));
    const duplicateNames = names.filter((name, idx) => names.indexOf(name) !== idx);

    const errors = [];
    const rolesToInsert = [];
    for (const role of payload) {
      if (dbNames.has(role.roleName)) {
        errors.push({ roleName: role.roleName, error: 'Duplicate name in DB.' });
        continue;
      }
      if (duplicateNames.includes(role.roleName)) {
        errors.push({ roleName: role.roleName, error: 'Duplicate name in request payload.' });
        continue;
      }
      if (!role.roleID) role.roleID = await getNextRoleID();
      rolesToInsert.push(role);
    }

    if (!rolesToInsert.length) {
      return res.status(409).json({ error: 'No roles inserted due to duplicates.', details: errors });
    }

    const inserted = await UserRole.insertMany(rolesToInsert);
    const response = { inserted };
    if (errors.length) response.errors = errors;
    res.status(errors.length > 0 ? 207 : 201).json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT: bulk update user roles
exports.bulkUpdateUserRoles = async (req, res) => {
  const { filter, updateFields, updates } = req.body;

  try {
    if (filter && updateFields) {
      const result = await UserRole.updateMany(filter, { $set: updateFields });
      return res.json({ message: 'User roles updated', modifiedCount: result.modifiedCount });
    } else if (Array.isArray(updates)) {
      const bulkOps = updates.map(u => ({
        updateOne: { filter: u.filter, update: { $set: u.updateFields } }
      }));
      const result = await UserRole.bulkWrite(bulkOps);
      return res.json({ message: 'User roles updated (multi)', modifiedCount: result.modifiedCount });
    } else {
      return res.status(400).json({ error: 'Invalid update structure.' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT: update user roles by query filter
exports.updateUserRole = async (req, res) => {
  const filter = req.query;
  const updateData = req.body;

  if (!Object.keys(filter).length) {
    return res.status(400).json({ error: 'No filter provided.' });
  }
  if (!Object.keys(updateData).length) {
    return res.status(400).json({ error: 'No update data provided.' });
  }

  try {
    const result = await UserRole.updateMany(filter, { $set: updateData });
    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: 'No matching user roles found to update.' });
    }
    const updated = await UserRole.find(filter);
    res.json({
      message: 'User role(s) updated',
      updatedCount: result.modifiedCount,
      updatedUserRoles: updated.length === 1 ? updated[0] : updated,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE: delete single user role by roleID
exports.deleteUserRoleById = async (req, res) => {
  try {
    const roleID = Number(req.params.id);
    const deleted = await UserRole.findOneAndDelete({ roleID });
    if (!deleted) {
      return res.status(404).json({ message: 'User role not found.' });
    }
    res.json({ message: 'User role deleted', role: deleted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE: delete multiple user roles by filter in body
exports.deleteUserRolesByFilter = async (req, res) => {
  try {
    const { filter } = req.body;
    if (!filter || typeof filter !== 'object') {
      return res.status(400).json({ error: 'Provide valid filter.' });
    }
    const result = await UserRole.deleteMany(filter);
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'No user roles matched filter.' });
    }
    res.json({ message: 'User roles deleted', deletedCount: result.deletedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE: bulk delete by comma-separated roleIDs in path
exports.bulkDeleteUserRolesByIds = async (req, res) => {
  try {
    const idsParam = req.params.ids;
    if (!idsParam) {
      return res.status(400).json({ error: 'No IDs provided.' });
    }
    const ids = idsParam.split(',').map(id => Number(id.trim())).filter(id => !isNaN(id));
    if (ids.length === 0) {
      return res.status(400).json({ error: 'No valid IDs provided.' });
    }
    const result = await UserRole.deleteMany({ roleID: { $in: ids } });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'No user roles found for provided IDs.' });
    }
    res.json({ message: 'User roles deleted', deletedCount: result.deletedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
