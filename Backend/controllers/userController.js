const UserDetail = require('../models/Users');
const UserRole = require('../models/UserRoles');
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

// Compose aggregation for joining to UserRole
const userWithRoleLookup = (match = {}) => ([
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
  { $addFields: { roleName: '$roleData.roleName' } },
  { $project: { roleData: 0, password: 0 } } // Remove internal fields, never show password!
]);

// GET: all or filtered with roleName
exports.getUsers = async (req, res) => {
  try {
    const filter = buildUserFilter(req.query);
    const data = await UserDetail.aggregate(userWithRoleLookup(filter));
    if (data.length === 0) {
      return res.status(404).json({ message: 'No users found.' });
    }
    res.json(data.length === 1 ? data[0] : data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET: user by userID with roleName
exports.getUserById = async (req, res) => {
  try {
    const userID = Number(req.params.id);
    const data = await UserDetail.aggregate(userWithRoleLookup({ userID }));
    if (!data.length) return res.status(404).json({ message: 'User not found.' });
    res.json(data[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST: add one or many users (enforce unique email)
exports.addUser = async (req, res) => {
  try {
    const payload = req.body;
    const getNextUserID = async () => await getNextSequence('userID');
    const emailExists = async (email) => UserDetail.exists({ email });

    // Add single
    if (!Array.isArray(payload)) {
      if (await emailExists(payload.email)) {
        return res.status(409).json({ error: 'User with this email already exists.' });
      }
      if (!payload.userID) payload.userID = await getNextUserID();
      const newUser = new UserDetail(payload);
      const saved = await newUser.save();
      // Join roleName on the fly
      const withRole = await UserDetail.aggregate(userWithRoleLookup({ userID: saved.userID }));
      return res.status(201).json(withRole[0]);
    }

    // Bulk
    const emails = payload.map(u => u.email);
    const existing = await UserDetail.find({ email: { $in: emails } }, { email: 1 });
    const existingEmails = new Set(existing.map(e => e.email));
    const duplicateEmails = emails.filter((email, i) => emails.indexOf(email) !== i);

    const errors = [];
    const items = [];
    for (const user of payload) {
      if (existingEmails.has(user.email)) {
        errors.push({ email: user.email, error: 'Already exists in DB.' });
        continue;
      }
      if (duplicateEmails.includes(user.email)) {
        errors.push({ email: user.email, error: 'Duplicate in request.' });
        continue;
      }
      if (!user.userID) user.userID = await getNextUserID();
      items.push(user);
    }
    if (!items.length) {
      return res.status(409).json({ error: 'No users inserted.', details: errors });
    }
    await UserDetail.insertMany(items);
    // Fetch with join
    const userIDs = items.map(u => u.userID);
    const withRoles = await UserDetail.aggregate(userWithRoleLookup({ userID: { $in: userIDs } }));
    let response = { inserted: withRoles };
    if (errors.length) response.errors = errors;
    res.status(errors.length ? 207 : 201).json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT: Bulk update
exports.bulkUpdateUsers = async (req, res) => {
  const { filter, updateFields, updates } = req.body;
  try {
    if (filter && updateFields) {
      const result = await UserDetail.updateMany(filter, { $set: updateFields });
      return res.json({ message: 'Users updated', modifiedCount: result.modifiedCount });
    } else if (Array.isArray(updates)) {
      const bulkOps = updates.map(u => ({
        updateOne: { filter: u.filter, update: { $set: u.updateFields } }
      }));
      const result = await UserDetail.bulkWrite(bulkOps);
      return res.json({ message: 'Users updated (multi)', modifiedCount: result.modifiedCount });
    } else {
      return res.status(400).json({ error: 'Invalid update structure' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT: update by filter
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
    // Return all updated documents with roleName joined
    const updated = await UserDetail.aggregate(userWithRoleLookup(filter));
    return res.json({
      message: 'User(s) updated',
      updatedCount: result.modifiedCount,
      updatedUsers: updated.length === 1 ? updated[0] : updated
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE: By userID
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

// DELETE: By filter
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

// DELETE: Bulk by comma-separated IDs
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
