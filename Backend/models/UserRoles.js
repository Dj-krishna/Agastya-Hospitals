const mongoose = require('mongoose');

const userRoleSchema = new mongoose.Schema({
  roleID: { type: Number, required: true, unique: true },
  roleName: { type: String, required: true }, // e.g., Admin, Manager, Receptionist
  defaultModules: [{ type: String }]          // list of module names like 'Appointments', 'Patients'
}, {
  timestamps: true,
  versionKey: false
});

module.exports = mongoose.model('UserRole', userRoleSchema, 'userRoles');
