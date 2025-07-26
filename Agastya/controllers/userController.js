const User = require('../models/Users');

// Get users with optional filters
exports.getUsers = async (req, res) => {
  try {
    const query = req.query || {};
    const filter = {};

    const exactMatchFields = ['userID', 'roleID', 'isActive'];
    const caseInsensitiveFields = ['userName', 'email', 'mobile'];

    for (const key in query) {
      const value = query[key];

      if (exactMatchFields.includes(key)) {
        // Convert to Number or Boolean
        if (key === 'isActive') {
          filter[key] = value === 'true';
        } else {
          filter[key] = Number(value);
        }
      } else if (caseInsensitiveFields.includes(key)) {
        // Case-insensitive partial match
        filter[key] = { $regex: value, $options: 'i' };
      }
    }

    const users = await User.find(filter);

    if (users.length === 0) {
      return res.status(404).json({ message: 'No matching users found' });
    }

    return res.json(users.length === 1 ? users[0] : users);
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};
