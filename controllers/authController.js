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

    // Check if user already exists (mobile + countryCode)
    const existingUser = await User.findOne({ mobile, countryCode });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Use default roleID if not provided
    const effectiveRoleID = roleID || 3;

    // Validate role
    const role = await Role.findOne({ roleID: effectiveRoleID });
    if (!role) return res.status(400).json({ message: 'Invalid roleID' });

    // Assign modules: use provided, role default, or fallback [1,5]
    const assignedModules = Array.isArray(modules) && modules.length > 0
      ? modules
      : (role.defaultModules && role.defaultModules.length > 0 ? role.defaultModules : [1, 5]);

    // WhatsApp number defaults to mobile if not provided
    const whatsApp = whatsAppNumber && whatsAppNumber.trim() !== '' ? whatsAppNumber : mobile;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate userID
    const userID = await getNextSequence('userID');

    // Create new user
    const newUser = new User({
      userID,
      userName,
      email: email || '', // optional
      password: hashedPassword,
      mobile,
      whatsAppNumber: whatsApp,
      countryCode,
      isActive: isActive === undefined ? true : isActive,
      roleID: effectiveRoleID,
      modules: assignedModules
    });

    await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      {
        userID: newUser.userID,
        email: newUser.email,
        mobile: newUser.mobile,
        countryCode: newUser.countryCode,
        roleID: newUser.roleID,
        modules: assignedModules,
        isActive: newUser.isActive,
        roleName: role.roleName
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Send response
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        userID: newUser.userID,
        userName: newUser.userName,
        email: newUser.email,
        mobile: newUser.mobile,
        whatsAppNumber: newUser.whatsAppNumber,
        countryCode: newUser.countryCode,
        isActive: newUser.isActive,
        roleID: newUser.roleID,
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


// ============================== FORGOT PASSWORD (VERIFY + RESET IN ONE) ==============================
exports.forgotPassword = async (req, res) => {
  try {
    const { mobile, countryCode, newPassword, confirmPassword } = req.body;

    if (!mobile || !countryCode || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: 'Mobile, countryCode, newPassword, confirmPassword are required' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Find user
    const user = await User.findOne({ mobile, countryCode });
    if (!user) {
      return res.status(404).json({ message: 'Invalid mobile number or country code' });
    }

    // Reset password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.rawPassword = newPassword; // optional, like you’re doing in registration
    await user.save();

    res.status(200).json({
      message: 'Password reset successfully',
      user: {
        userID: user.userID,
        userName: user.userName,
        mobile: user.mobile,
        countryCode: user.countryCode,
        email: user.email
      }
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
