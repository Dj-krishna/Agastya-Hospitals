const mongoose = require('mongoose');

const subSpecialitySchema = new mongoose.Schema({
  subSpecialityID: { type: Number, required: true, unique: true },
  subSpecialityName: { type: String, required: true },
  specialityID: { type: Number, required: true },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('SubSpeciality', subSpecialitySchema, 'subSpecialities');
