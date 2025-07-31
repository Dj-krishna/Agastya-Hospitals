const mongoose = require('mongoose');

const specialitySchema = new mongoose.Schema({
  specialityID: { type: Number, required: true, unique: true },
  specialityName: { type: String, required: true },
  icon: { type: String },                        // uploaded icon file name
  banner: { type: String },                      // banner file name
  displayOrder: { type: Number },                // order on home page
  doctorID: { type: Number, required: true },    // assumed single doctor for now
  shortDescription: { type: String },
  pageDescription: { type: String },
  seoMetaData: { type: String },                 // keywords, meta, etc.
  urlSlug: { type: String, required: true },
  isNavigationDisplay: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  createdBy: { type: String, required: true },
  updatedBy: { type: String, required: true }
}, {
  timestamps: true, // adds createdAt and updatedAt
  versionKey: false  // disables __v column when POST request is sent
});

module.exports = mongoose.model('Speciality', specialitySchema);