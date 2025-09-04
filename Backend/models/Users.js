const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userID: { type: Number, required: true, unique: true },
  userName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  rawPassword: { type: String },
  countryCode: { type: String, required: true }, 
  mobile: { type: String, required: true },
  isActive: { type: Boolean, required: true },
  roleID: { type: Number, default: 3 },                // default roleID
  modules: { type: [Number], default: [1, 5] },
  whatsAppNumber: { type: String }
}, {
  timestamps: true,
  versionKey: false  // disables __v column when POST request is sent
});

module.exports = mongoose.model('User', userSchema);