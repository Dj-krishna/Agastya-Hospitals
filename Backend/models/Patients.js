const mongoose = require('mongoose');

const fileRefSchema = new mongoose.Schema({
  fileId: { type: mongoose.Schema.Types.ObjectId, index: true },
  filename: String,
  contentType: String,
  length: Number,
  uploadDate: Date,
  bucket: { type: String, enum: ['images', 'videos'] }
}, { _id: false });

const patientSchema = new mongoose.Schema({
  UHID: { type: String, unique: true },
  patientID: { type: Number, required: true, unique: true },
  fullName: { type: String, required: true },
  dob: { type: Date, required: true },
  gender: { type: String, required: true },
  email: { type: String, required: true },
  countryCode: { type: String, required: true }, 
  bloodGroup: { 
    type: String,
    enum: ['A+', 'A−', 'B+', 'B−', 'AB+', 'AB−', 'O+', 'O−'], // only allow these values
    required: false
  },
  mobile: { type: String, required: true, unique: true},
  altMobile: { type: String }, 
  address: { type: String, required: true },
  profilePicture: { type: String },
  profileImageGfs: fileRefSchema,
  pastHistory: { type: String }, 
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
}, {
  timestamps: true,
  versionKey: false  // disables __v column when POST request is sent
});

module.exports = mongoose.model('Patient', patientSchema);
