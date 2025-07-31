const mongoose = require('mongoose');

const healthPackageSchema = new mongoose.Schema({
  packageID: { type: Number, required: true, unique: true },
  packageName: { type: String, required: true },
  price: { type: Number, required: true },
  discountType: { type: String, enum: ['Fixed', 'Percentage'], required: true },
  discountAmount: { type: Number, required: true },
  discountPrice: { type: Number, required: true }, // final price after discount
  totalLabTests: { type: Number, required: true },
  allTestNames: [{ type: String }], // list of test names
  createdBy: { type: String, default: 'admin' },
  updatedBy: { type: String, default: 'admin' }
}, {
  timestamps: true,
  versionKey: false
});

module.exports = mongoose.model('HealthPackage', healthPackageSchema, 'healthPackages');
