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

// GET: all or filtered user roles (enriched with userNames) - handles all cases including by ID
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

    // If filtering by roleID, return single object, otherwise return array
    if (req.query.roleID) {
      res.json(roles[0]);
    } else {
      res.json(roles);
    }
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

// ------------------ DELETE ------------------
exports.deleteUserRoles = async (req, res) => {
  try {
    let filter = {};

    // Bulk IDs from params
    if (req.params.ids) {
      const ids = req.params.ids
        .split(',')
        .map(id => Number(id.trim()))
        .filter(id => !isNaN(id));
      if (!ids.length) return res.status(400).json({ error: 'No valid IDs provided' });
      filter = { roleID: { $in: ids } };
    }

    // Single or multiple IDs from query
    else if (req.query.roleID) {
      if (typeof req.query.roleID === 'string' && req.query.roleID.includes(',')) {
        const ids = req.query.roleID
          .split(',')
          .map(id => Number(id.trim()))
          .filter(id => !isNaN(id));
        filter = { roleID: { $in: ids } };
      } else {
        filter = { roleID: Number(req.query.roleID) };
      }
    }

    // Other query filters
    else if (Object.keys(req.query).length > 0) {
      filter = buildUserRoleFilter(req.query);
    }

    // Body filter
    else if (req.body.filter) {
      if (typeof req.body.filter !== 'object')
        return res.status(400).json({ error: 'Provide valid filter' });
      filter = req.body.filter;
    } else {
      return res.status(400).json({ error: 'No filter provided. Use query params, body filter, or /bulk/:ids' });
    }

    // Find documents before deletion
    const toDelete = await UserRole.find(filter);
    if (!toDelete.length)
      return res.status(404).json({ message: 'No user roles found matching the criteria' });

    const result = await UserRole.deleteMany(filter);
    if (result.deletedCount === 0)
      return res.status(404).json({ message: 'No user roles were deleted' });

    // Return single deleted object if only one deleted
    if (
      (req.query.roleID && !String(req.query.roleID).includes(',')) ||
      (req.params.ids && req.params.ids.split(',').length === 1)
    ) {
      res.json({ message: 'User role deleted', role: toDelete[0] });
    } else {
      res.json({
        message: 'User roles deleted',
        deletedCount: result.deletedCount,
        deletedUserRoles: toDelete
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

