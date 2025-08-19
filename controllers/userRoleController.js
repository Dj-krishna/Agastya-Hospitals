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

// GET: all or filtered user roles (enriched with userNames)
exports.getUserRoles = async (req, res) => {
  try {
    const filter = buildUserRoleFilter(req.query);
    const roles = await UserRole.aggregate([
      { $match: filter },
      {
        $lookup: {
          from: 'users',
          localField: 'roleID',
          foreignField: 'roleID',
          as: 'usersForRole'
        }
      },
      {
        $addFields: {
          userNames: {
            $map: {
              input: '$usersForRole',
              as: 'u',
              in: '$$u.userName'
            }
          },
          usersCount: { $size: '$usersForRole' }
        }
      },
      { $project: { usersForRole: 0 } }
    ]);

    if (!roles.length) {
      return res.status(404).json({ message: 'No user roles found.' });
    }

    res.json(roles.length === 1 ? roles[0] : roles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET: single by roleID (enriched with userNames)
exports.getUserRoleById = async (req, res) => {
  try {
    const roleID = Number(req.params.id);
    const roles = await UserRole.aggregate([
      { $match: { roleID } },
      {
        $lookup: {
          from: 'users',
          localField: 'roleID',
          foreignField: 'roleID',
          as: 'usersForRole'
        }
      },
      {
        $addFields: {
          userNames: {
            $map: { input: '$usersForRole', as: 'u', in: '$$u.userName' }
          },
          usersCount: { $size: '$usersForRole' }
        }
      },
      { $project: { usersForRole: 0 } }
    ]);
    if (!roles.length) {
      return res.status(404).json({ message: 'User role not found.' });
    }
    res.json(roles[0]);
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

    // SINGLE INSERT
    if (!Array.isArray(payload)) {
      if (await exists(payload.roleName)) {
        return res.status(409).json({ error: 'A role with this name already exists.' });
      }

      // Save first without roleID
      let saved = new UserRole(payload);
      saved = await saved.save();

      // Assign roleID only after successful save
      if (!saved.roleID) {
        const nextID = await getNextRoleID();
        saved.roleID = nextID;
        await saved.save();
      }

      return res.status(201).json(saved);
    }

    // BULK INSERT
    const names = payload.map(r => r.roleName);
    const dbRoles = await UserRole.find({ roleName: { $in: names } }, { roleName: 1 });
    const dbNames = new Set(dbRoles.map(r => r.roleName));
    const duplicateNames = names.filter((name, idx) => names.indexOf(name) !== idx);

    const errors = [];
    const insertedRoles = [];

    for (const role of payload) {
      if (dbNames.has(role.roleName)) {
        errors.push({ roleName: role.roleName, error: 'Duplicate name in DB.' });
        continue;
      }
      if (duplicateNames.includes(role.roleName)) {
        errors.push({ roleName: role.roleName, error: 'Duplicate name in request payload.' });
        continue;
      }

      // Save first without roleID
      let saved = new UserRole(role);
      saved = await saved.save();

      // Assign roleID only after successful save
      if (!saved.roleID) {
        const nextID = await getNextRoleID();
        saved.roleID = nextID;
        await saved.save();
      }

      insertedRoles.push(saved);
    }

    if (insertedRoles.length === 0) {
      return res.status(409).json({ error: 'No roles inserted due to duplicates.', details: errors });
    }

    const response = { inserted: insertedRoles };
    if (errors.length) response.errors = errors;

    res.status(errors.length > 0 ? 207 : 201).json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// bulkUpdateUserRoles: removed per requirement

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
