const mongoose = require('mongoose');


const specialitySchema = new mongoose.Schema({
  specialityID: { type: Number, required: true, unique: true },
  specialityName: { type: String, required: true },
  icon: { type: String },                         // single icon image
  banner: { type: [String] },                       // single banner image
  displayOrder: { type: Number },                // order on home page
  doctor: { type: Number },  // single doctorID
  shortDescription: { type: String },
  pageDescription: { type: String },
  seoMetaData: { type: String, default: function() { return this.specialityName; } },                // keywords, meta, etc.
  urlSlug: { type: String},
  isNavigationDisplay: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  createdBy: { type: String},
  updatedBy: { type: String}
}, {
  timestamps: true, // adds createdAt and updatedAt
  versionKey: false  // disables __v column when POST request is sent
});

module.exports = mongoose.model('Speciality', specialitySchema);