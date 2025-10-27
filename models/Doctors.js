const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  doctorID: { type: Number, required: true, unique: true },
  fullName: { type: String, required: true },
  countryCode: { type: String, required: true }, 
  mobile: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  medicalRegNumber: { type: String}, 
  designation: { type: String},
  departmentID: { type: Number, required: true },        // links to Departments.departmentID
  speciality: [{ type: Number }],
  yearsOfExperience: { type: String },
  languagesKnown: { type: [String] },
  expertise: { type: String }, 
  servicesOffered: { type: [String] },
  consultingLocation: { type: String },
  education: { type: [String] },
  qualification: { type: [String] },
  experienceDescription: { type: String }, 
  awardsAndAchievements: { type: String }, 
  researchAndPublications: { type: String },
  opTimings: { type: [String] },
  gender: { type: String, enum: ['Male', 'Female', 'Others'] },
  profilePicture: { type: String, default: null },
  about: { type: String }
}, {
  versionKey: false  // disables __v column when POST request is sent
});

module.exports = mongoose.model('Doctor', doctorSchema); 
 
