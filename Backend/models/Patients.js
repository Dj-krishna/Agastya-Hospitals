const mongoose = require('mongoose');


const patientSchema = new mongoose.Schema({
  UHID: { type: String, unique: true },
  patientID: { type: Number, required: true, unique: true },
  fullName: { type: String, required: true },
  dob: { type: Date },
  gender: { type: String },
  email: { type: String },
  countryCode: { type: String, required: true }, 
  bloodGroup: { 
    type: String,
    enum: ['A+', 'A−', 'B+', 'B−', 'AB+', 'AB−', 'O+', 'O−']
  },
  mobile: { type: String, required: true  },
  altMobile: { type: String }, 
  address: { type: String },
  profilePicture: { type: String, default: null },
  pastHistory: { type: String },
  medicalRecords: { type: [String], default: [] },
  doctorID: { type: Number },
  packageIDs: [{ type: Number }]
}, {
  timestamps: true,
  versionKey: false  // disables __v column when POST request is sent
});

module.exports = mongoose.model('Patient', patientSchema);
