const mongoose = require('mongoose');

const specialitySchema = new mongoose.Schema({
  specialityID: { type: Number, required: true, unique: true },
  specialityName: { type: String, required: true },
  icon: { type: String },
  doctorID: { type: Number, required: true },
  shortDescription: { type: String },
  pageDescription: { type: String },
  banner: { type: String },
  isActive: { type: Boolean, default: true },
  isNavigationDisplay: { type: Boolean, default: false },
  createdBy: { type: String, required: true },
  updatedBy: { type: String, required: true }
}, {
  timestamps: true, // adds createdAt and updatedAt
  versionKey: false  // disables __v column when POST request is sent
});

module.exports = mongoose.model('Speciality', specialitySchema);