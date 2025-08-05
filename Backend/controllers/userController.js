const UserDetail = require('../models/Users');
const UserRole = require('../models/UserRoles');
const Module = require('../models/Modules');
const getNextSequence = require('../utils/getNextSequence');

// Helper to build filters from req.query
const buildUserFilter = (query) => {
  const filter = {};
  const numFields = ['userID', 'roleID'];
  for (const key in query) {
    const value = query[key];
    if (value === undefined || value === '') continue;
    if (numFields.includes(key)) {
      filter[key] = Number(value);
    } else if (key === 'userName' || key === 'email') {
      filter[key] = { $regex: value, $options: 'i' };
    } else if (key === 'isActive') {
      filter[key] = value === 'true' ? true : value === 'false' ? false : value;
    } else {
      filter[key] = value;
    }
  }
  return filter;
};

// Compose aggregation pipeline joining UserRole and Modules
const userWithRoleAndModulesLookup = (match = {}) => [
  { $match: match },
  {
    $lookup: {
      from: 'userRoles',
      localField: 'roleID',
      foreignField: 'roleID',
      as: 'roleData'
    }
  },
  { $unwind: { path: '$roleData', preserveNullAndEmptyArrays: true } },
  {
    $lookup: {
      from: 'modules',
      localField: 'modules',
      foreignField: 'moduleID',
      as: 'moduleDetails'
    }
  },
  {
    $addFields: {
      roleName: '$roleData.roleName',
      moduleNames: {
        $cond: [
          { $isArray: '$moduleDetails' },
          { $map: { input: '$moduleDetails', as: 'm', in: '$$m.moduleName' } },
          []
        ]
      }
    }
  },
  { $project: { roleData: 0, moduleDetails: 0, password: 0 } }
];

// Helper to transform modules array into key-value object
const transformModules = (user) => {
  if (Array.isArray(user.modules) && Array.isArray(user.moduleNames)) {
    const mapped = {};
    user.modules.forEach((id, idx) => {
      mapped[id] = user.moduleNames[idx] || 'Unknown';
    });
    user.modules = mapped;
    delete user.moduleNames;
  }
  return user;
};

exports.getUsers = async (req, res) => {
  try {
    const filter = buildUserFilter(req.query);
    const users = await UserDetail.aggregate(userWithRoleAndModulesLookup(filter));
    if (users.length === 0) return res.status(404).json({ message: 'No users found.' });

    const transformed = users.map(transformModules);
    res.json(transformed.length === 1 ? transformed[0] : transformed);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const userID = Number(req.params.id);
    const data = await UserDetail.aggregate(userWithRoleAndModulesLookup({ userID }));
    if (data.length === 0) return res.status(404).json({ message: 'User not found.' });

    const transformed = transformModules(data[0]);
    res.json(transformed);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.bulkUpdateUsers = async (req, res) => {
  const { filter, updateFields, updates } = req.body;
  try {
    if (filter && updateFields) {
      const result = await UserDetail.updateMany(filter, { $set: updateFields });
      const updated = await UserDetail.aggregate(userWithRoleAndModulesLookup(filter));
      const transformed = updated.map(transformModules);
      return res.json({ message: 'Users updated', modifiedCount: result.modifiedCount, updatedUsers: transformed });
    } else if (Array.isArray(updates)) {
      const bulkOps = updates.map(u => ({
        updateOne: { filter: u.filter, update: { $set: u.updateFields } }
      }));
      const result = await UserDetail.bulkWrite(bulkOps);
      return res.json({ message: 'Users updated successfully', modifiedCount: result.modifiedCount });
    } else {
      return res.status(400).json({ error: 'Invalid update structure' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateUser = async (req, res) => {
  const filter = req.query;
  const updateData = req.body;
  if (!Object.keys(filter).length) return res.status(400).json({ error: 'No filter provided' });
  if (!Object.keys(updateData).length) return res.status(400).json({ error: 'No update data provided' });
  try {
    const result = await UserDetail.updateMany(filter, { $set: updateData });
    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: 'No matching users found to update' });
    }
    const updated = await UserDetail.aggregate(userWithRoleAndModulesLookup(buildUserFilter(filter)));
    const transformed = updated.map(transformModules);
    return res.json({
      message: 'User(s) updated',
      updatedCount: result.modifiedCount,
      updatedUsers: transformed.length === 1 ? transformed[0] : transformed
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteUserById = async (req, res) => {
  try {
    const userID = Number(req.params.id);
    const deleted = await UserDetail.findOneAndDelete({ userID });
    if (!deleted) return res.status(404).json({ message: 'User not found' });
    return res.json({ message: 'User deleted', user: deleted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteUsersByFilter = async (req, res) => {
  try {
    const { filter } = req.body;
    if (!filter || typeof filter !== 'object') return res.status(400).json({ error: 'Provide valid filter' });
    const result = await UserDetail.deleteMany(filter);
    if (result.deletedCount === 0) return res.status(404).json({ message: 'No users matched filter' });
    return res.json({ message: 'Users deleted', deletedCount: result.deletedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.bulkDeleteUsersByIds = async (req, res) => {
  try {
    const idsParam = req.params.ids;
    if (!idsParam) return res.status(400).json({ error: 'No IDs provided' });
    const ids = idsParam.split(',').map(id => Number(id.trim())).filter(id => !isNaN(id));
    if (ids.length === 0) return res.status(400).json({ error: 'No valid IDs provided' });
    const result = await UserDetail.deleteMany({ userID: { $in: ids } });
    if (!result.deletedCount) return res.status(404).json({ message: 'No users found for provided IDs' });
    res.json({ message: 'Users deleted', deletedCount: result.deletedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
