const mongoose = require('mongoose');

const subSpecialitySchema = new mongoose.Schema({
  subSpecialityID: { type: Number, required: true, unique: true },
  subSpecialityName: { type: String, required: true },
  specialityID: { type: Number, required: true },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true,
  versionKey: false  // disables __v column when POST request is sent
});

module.exports = mongoose.model('SubSpeciality', subSpecialitySchema, 'subSpecialities');