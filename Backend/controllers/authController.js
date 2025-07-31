const User = require('../models/Users');
const Role = require('../models/UserRoles');
const Counter = require('../models/Counter');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_key';

// ============================== REGISTER ==============================
exports.register = async (req, res) => {
  try {
    const {
      userName,
      email,
      password,
      mobile,
      isActive,
      roleID,
      modules,
      whatsAppNumber
    } = req.body;

    // 1. Check if user already exists (case-insensitive)
    const existingUser = await User.findOne({
      email: { $regex: `^${email}$`, $options: 'i' }
    });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 2. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Get next userID from counter collection
    const counter = await Counter.findOneAndUpdate(
      { _id: 'userID' },
      { $inc: { sequence_value: 1 } },
      { new: true, upsert: true }
    );
    const userID = counter.sequence_value;

    // 4. Validate role and get default modules
    const role = await Role.findOne({ roleID });
    if (!role) {
      return res.status(400).json({ message: 'Invalid roleID' });
    }

    const assignedModules =
      Array.isArray(modules) && modules.length > 0
        ? modules
        : role.defaultModules || [];

    // 5. Create new user
    const newUser = new User({
      userID,
      userName,
      email,
      password: hashedPassword,
      rawPassword: password, // only for testing purpose
      mobile,
      whatsAppNumber,
      isActive: isActive === undefined ? true : isActive,
      roleID,
      modules: assignedModules
    });

    await newUser.save();

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        userID,
        userName,
        email,
        mobile,
        rawPassword: password, // included in response for testing
        whatsAppNumber,
        isActive: newUser.isActive,
        roleID,
        roleName: role.roleName,
        modules: assignedModules
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ============================== LOGIN ==============================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email: { $regex: `^${email}$`, $options: 'i' }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const role = await Role.findOne({ roleID: user.roleID });

    const token = jwt.sign(
      {
        userID: user.userID,
        email: user.email,
        roleID: user.roleID,
        modules: user.modules,
        isActive: user.isActive,
        roleName: role ? role.roleName : undefined
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        userID: user.userID,
        userName: user.userName,
        email: user.email,
        mobile: user.mobile,
        whatsAppNumber: user.whatsAppNumber,
        isActive: user.isActive,
        roleID: user.roleID,
        roleName: role ? role.roleName : 'Unknown',
        modules: user.modules
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ============================== FORGOT PASSWORD ==============================
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({
      email: { $regex: `^${email}$`, $options: 'i' }
    });

    if (!user) return res.status(404).json({ message: 'User not found' });

    // Simulated response
    res.status(200).json({
      message: `Reset link sent to ${email} (simulation)`
    });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
