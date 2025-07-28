const mongoose = require('mongoose');

const userRoleSchema = new mongoose.Schema({
  roleID: { type: Number, required: true, unique: true },
  roleName: { type: String, required: true }
}, {
  versionKey: false  // disables __v column when POST request is sent
});

module.exports = mongoose.model('UserRole', userRoleSchema, 'userRoles');
