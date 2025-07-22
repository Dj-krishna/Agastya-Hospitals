const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  patientID: { type: Number, required: true, unique: true },
  fullName: { type: String, required: true },
  dob: { type: Date, required: true },
  gender: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  profilePicture: { type: String },

  transactions: [
    {
      date: { type: Date, required: true },
      amount: { type: Number, required: true },
      type: { type: String, required: true },
      description: { type: String }
    }
  ],

  labRecords: [
    {
      testName: { type: String, required: true },
      result: { type: String, required: true },
      date: { type: Date, required: true },
      description: { type: String }
    }
  ],

  visits: [
    {
      date: { type: Date, required: true },
      reason: { type: String, required: true },
      doctor: { type: String },
      description: { type: String }
    }
  ],
  doctorID: { type: Number, required: true },
  packageIDs: [{ type: Number }]
}, { strict: true });

module.exports = mongoose.model('Patient', patientSchema);
