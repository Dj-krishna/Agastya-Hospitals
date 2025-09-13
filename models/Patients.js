const mongoose = require('mongoose');


const patientSchema = new mongoose.Schema({
  UHID: { type: String, unique: true },
  patientID: { type: Number, required: true, unique: true },
  fullName: { type: String, required: true },
  dob: { type: Date },
  gender: { type: String },
  email: { type: String},
  countryCode: { type: String, required: true }, 
  bloodGroup: { 
    type: String,
    enum: ['A+', 'A−', 'B+', 'B−', 'AB+', 'AB−', 'O+', 'O−'], // only allow these values
    required: false
  },
  mobile: { type: String},
  altMobile: { type: String }, 
  address: { type: String },
  profilePicture: { type: String, default: null },
  pastHistory: { type: String }, 
  transactions: [
    {
      date: { type: Date },
      amount: { type: Number },
      type: { type: String },
      description: { type: String }
    }
  ],
  labRecords: [
    {
      testName: { type: String },
      result: { type: String },
      date: { type: Date },
      description: { type: String }
    }
  ],
  visits: [
    {
      date: { type: Date },
      reason: { type: String },
      doctor: { type: String },
      description: { type: String }
    }
  ],
  doctorID: { type: Number, required: true },
  packageIDs: [{ type: Number }]
}, {
  timestamps: true,
  versionKey: false  // disables __v column when POST request is sent
});

module.exports = mongoose.model('Patient', patientSchema);
