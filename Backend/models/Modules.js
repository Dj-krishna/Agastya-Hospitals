const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema({
  moduleID: { type: Number, required: true, unique: true },
  moduleName: { type: String, required: true }
}, {
  timestamps: true,
  versionKey: false
});

module.exports = mongoose.model('Module', moduleSchema, 'modules');
