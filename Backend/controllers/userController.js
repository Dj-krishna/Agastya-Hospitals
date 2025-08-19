const User = require('../models/Users');
const UserRole = require('../models/UserRoles');
const Module = require('../models/Modules');
const getNextSequence = require('../utils/getNextSequence');

// 🔧 Build filter from request query
const buildUserFilter = (query) => {
  const filter = {};
  const numFields = ['userID', 'roleID'];

  for (const key in query) {
    const value = query[key];
    if (!value) continue;

    if (numFields.includes(key) && !isNaN(value)) {
      filter[key] = Number(value);
    } else if (['modules'].includes(key)) {
      filter[key] = { $elemMatch: { $regex: value, $options: 'i' } };
    } else {
      filter[key] = { $regex: value, $options: 'i' };
    }
  }
  return filter;
};

// 🔍 Aggregation to join role and modules
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
  { $project: { roleData: 0, moduleDetails: 0 } }
];

// 🔁 Transform modules into { id: name }
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

// GET /users (enriched with roleName and moduleNames already in pipeline)
exports.getUsers = async (req, res) => {
  try {
    const filter = buildUserFilter(req.query);
    const users = await User.aggregate(userWithRoleAndModulesLookup(filter));
    if (users.length === 0) return res.status(404).json({ message: 'No users found.' });

    const transformed = users.map(transformModules);
    res.json(transformed.length === 1 ? transformed[0] : transformed);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /users/:id (enriched with roleName and moduleNames already in pipeline)
exports.getUserById = async (req, res) => {
  try {
    const userID = Number(req.params.id);
    const data = await User.aggregate(userWithRoleAndModulesLookup({ userID }));
    if (data.length === 0) return res.status(404).json({ message: 'User not found.' });

    const transformed = transformModules(data[0]);
    res.json(transformed);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /users
exports.addUser = async (req, res) => {
  try {
    const payload = req.body;
    const getNextUserID = async () => await getNextSequence('userID');
    const emailExists = async (email) => await User.exists({ email });

    // SINGLE INSERT
    if (!Array.isArray(payload)) {
      if (await emailExists(payload.email)) {
        return res.status(409).json({ error: 'A user with this email already exists.' });
      }

      let saved = new User(payload);
      saved = await saved.save(); // save first

      // Only now increment userID if not provided
      if (!saved.userID) {
        const nextID = await getNextUserID();
        saved.userID = nextID;
        await saved.save(); // update with userID
      }

      const enriched = await User.aggregate(userWithRoleAndModulesLookup({ userID: saved.userID }));
      return res.status(201).json(transformModules(enriched[0]));
    }

    // BULK INSERT
    const emails = payload.map(user => user.email);
    const existingUsers = await User.find({ email: { $in: emails } }, { email: 1 });
    const existingEmails = new Set(existingUsers.map(user => user.email));
    const duplicateEmails = emails.filter((email, idx) => emails.indexOf(email) !== idx);
    const errors = [];
    const insertedUsers = [];

    for (const user of payload) {
      if (existingEmails.has(user.email)) {
        errors.push({ email: user.email, error: 'Email already exists in database.' });
        continue;
      }
      if (duplicateEmails.includes(user.email)) {
        errors.push({ email: user.email, error: 'Duplicate email in request payload.' });
        continue;
      }

      // Save first without userID
      let saved = new User(user);
      saved = await saved.save();

      // Increment userID only after successful save
      if (!saved.userID) {
        const nextID = await getNextUserID();
        saved.userID = nextID;
        await saved.save();
      }

      insertedUsers.push(saved);
    }

    if (insertedUsers.length === 0) {
      return res.status(409).json({ error: 'No users inserted', details: errors });
    }

    const ids = insertedUsers.map(u => u.userID);
    const enriched = await User.aggregate(userWithRoleAndModulesLookup({ userID: { $in: ids } }));
    const transformed = enriched.map(transformModules);

    let response = { inserted: transformed };
    if (errors.length > 0) response.errors = errors;

    res.status(errors.length > 0 ? 207 : 201).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// PUT /users
exports.updateUser = async (req, res) => {
  const filter = req.query;
  const updateData = req.body;

  if (!Object.keys(filter).length) return res.status(400).json({ error: 'No filter provided' });
  if (!Object.keys(updateData).length) return res.status(400).json({ error: 'No update data provided' });

  try {
    const result = await User.updateMany(filter, { $set: updateData });
    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: 'No matching users found to update' });
    }

    const updated = await User.aggregate(userWithRoleAndModulesLookup(buildUserFilter(filter)));
    const transformed = updated.map(transformModules);

    return res.json({
      message: 'User(s) updated',
      updatedCount: result.modifiedCount,
      updatedUsers: transformed
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// bulkUpdateUsers: removed per requirement

// DELETE /users/:id
exports.deleteUserById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const deleted = await User.findOneAndDelete({ userID: id });

    if (!deleted) return res.status(404).json({ message: 'User not found' });

    const enriched = await User.aggregate(userWithRoleAndModulesLookup({ userID: id }));
    res.json({ message: 'User deleted', user: transformModules(enriched[0] || deleted) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /users
exports.deleteUsersByFilter = async (req, res) => {
  try {
    const { filter } = req.body;
    if (!filter || typeof filter !== 'object') {
      return res.status(400).json({ error: 'Provide valid filter' });
    }

    const toDelete = await User.aggregate(userWithRoleAndModulesLookup(filter));
    const result = await User.deleteMany(filter);

    if (result.deletedCount === 0) return res.status(404).json({ message: 'No users matched filter' });

    res.json({
      message: 'Users deleted',
      deletedCount: result.deletedCount,
      deletedUsers: toDelete.map(transformModules)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /users/bulk/:ids
exports.bulkDeleteUsersByIds = async (req, res) => {
  try {
    const ids = req.params.ids.split(',').map(id => Number(id.trim())).filter(id => !isNaN(id));
    if (ids.length === 0) return res.status(400).json({ error: 'No valid IDs provided' });

    const toDelete = await User.aggregate(userWithRoleAndModulesLookup({ userID: { $in: ids } }));
    const result = await User.deleteMany({ userID: { $in: ids } });

    if (result.deletedCount === 0) return res.status(404).json({ message: 'No users found for provided IDs' });

    res.json({
      message: 'Users deleted',
      deletedCount: result.deletedCount,
      deletedUsers: toDelete.map(transformModules)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
