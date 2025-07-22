const mongoose = require('mongoose');

const healthPackageSchema = new mongoose.Schema({
  packageID: { type: Number, required: true, unique: true },        
  packageName: { type: String, required: true },       
  price: { type: Number, required: true },            
  discountPrice: { type: Number },                     
  totalLabTests: { type: Number, required: true },     
  allTestNames: { type: [String], required: true }     
}, { strict: true });

module.exports = mongoose.model('HealthPackage', healthPackageSchema, 'healthPackages');
