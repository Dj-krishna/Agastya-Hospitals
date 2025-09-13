const mongoose = require('mongoose');

const technologySchema = new mongoose.Schema({
  technologyID: { type: Number, required: true, unique: true },
  technologyName: { type: String },
  icon: { type: String },
  speciality: { type: String }
}, {
  versionKey: false // Disable __v version key
});

module.exports = mongoose.model('Technology', technologySchema);
