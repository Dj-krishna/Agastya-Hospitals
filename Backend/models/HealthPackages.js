const mongoose = require('mongoose');

const healthPackageSchema = new mongoose.Schema({
  packageID: { type: Number, required: true, unique: true },
  packageName: { type: String, required: true },
  price: { type: Number },
  discountType: { type: String, enum: ['Fixed', 'Percentage'] },
  discountAmount: { type: Number },
  photo: { type: String, default: null },
  totalLabTests: { type: Number },
  coveredTests: [{ type: String }],
  ageGroup: { type: String },
  idealFor: { type: String, enum: ['Male', 'Female', 'Children'] },
  description: { type: String },
  guidelines: { type: String },
  createdBy: { type: String, default: 'admin' },
  updatedBy: { type: String, default: 'admin' }
}, {
  timestamps: true,
  versionKey: false
});

module.exports = mongoose.model('HealthPackage', healthPackageSchema, 'healthPackages');
