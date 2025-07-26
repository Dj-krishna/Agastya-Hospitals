const mongoose = require('mongoose');

const userDetailSchema = new mongoose.Schema({
  userID: { type: Number, required: true, unique: true },
  userName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  mobile: { type: String, required: true },
  isActive: { type: Boolean, required: true },
  roleID: { type: Number, required: true }
}, {
  versionKey: false  // disables __v column when POST request is sent
});

module.exports = mongoose.model('UserDetail', userDetailSchema, 'userDetails');