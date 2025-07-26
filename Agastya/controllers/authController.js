const User = require('../models/Users');
const Role = require('../models/UserRoles');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'my_local_secret_key'; // Keep this secret and safe

// Signup
exports.register = async (req, res) => {
  try {
    console.log("Register Body:", req.body);

    const { userName, email, password, mobile, isActive, roleID } = req.body;

    // 1. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Generate new userID
    const lastUser = await User.findOne({}).sort({ userID: -1 });
    const userID = lastUser ? lastUser.userID + 1 : 1;

    // 4. Create user object
    const user = new User({
      userID,
      userName,
      email,
      password: hashedPassword,
      mobile,
      isActive,
      roleID
    });

    await user.save();

    // 5. Get role name
    const role = await Role.findOne({ roleID });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        userID,
        userName,
        email,
        mobile,
        isActive,
        roleID,
        roleName: role ? role.roleName : 'Unknown'
      }
    });
  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Login Controller
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    // 3. Generate token
    const token = jwt.sign({ userID: user.userID }, JWT_SECRET, { expiresIn: '1h' });

    // 4. Get role name
    const role = await Role.findOne({ roleID: user.roleID });

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        userID: user.userID,
        userName: user.userName,
        email: user.email,
        mobile: user.mobile,
        isActive: user.isActive,
        roleID: user.roleID,
        roleName: role ? role.roleName : 'Unknown'
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Forgot Password Controller
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Simulation only – in production, send email
    res.status(200).json({ message: `Reset link sent to ${email} (simulation)` });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
