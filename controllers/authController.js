const User = require('../models/Users');
const Role = require('../models/UserRoles');
const getNextSequence = require('../utils/getNextSequence');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_key';

// ============================== REGISTER ==============================
exports.register = async (req, res) => {
  try {
    const { userName, email, password, mobile, isActive, roleID, modules, whatsAppNumber, countryCode } = req.body;

    const existingUser = await User.findOne({ email: { $regex: `^${email}$`, $options: 'i' } });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const role = await Role.findOne({ roleID });
    if (!role) return res.status(400).json({ message: 'Invalid roleID' });

    const assignedModules = Array.isArray(modules) && modules.length > 0 ? modules : role.defaultModules || [];

    const hashedPassword = await bcrypt.hash(password, 10);

    const userID = await getNextSequence('userID');

    const newUser = new User({
      userID,
      userName,
      email,
      password: hashedPassword,
      rawPassword: password, // for testing only ⚠️ remove in production
      mobile,
      whatsAppNumber,
      countryCode,
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
        rawPassword: password, // testing only
        whatsAppNumber,
        countryCode,
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

    const user = await User.findOne({ email: { $regex: `^${email}$`, $options: 'i' } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

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
        countryCode: user.countryCode,
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

    const user = await User.findOne({ email: { $regex: `^${email}$`, $options: 'i' } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({
      message: `Reset link sent to ${email} (simulation)`
    });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ============================== UPDATE PASSWORD ==============================
exports.updatePassword = async (req, res) => {
  try {
    const { userID } = req.user; // Populated by JWT middleware
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: 'Current, new, and confirm passwords are required' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'New password and confirm password do not match' });
    }

    const user = await User.findOne({ userID });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Current password is incorrect' });

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Use updateOne to avoid validation errors on other required fields
    await User.updateOne({ userID }, { $set: { password: hashedNewPassword, rawPassword: newPassword } });

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Update password error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
