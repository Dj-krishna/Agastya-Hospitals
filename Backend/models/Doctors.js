const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  doctorID: { type: Number, required: true, unique: true },
  fullName: { type: String, required: true },
  mobile: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  medicalRegNumber: { type: String, required: true },
  department: { type: String, required: true },
  designation: { type: String, required: true },
  speciality: { type: [String], required: true },
  yearsOfExperience: { type: String },
  languagesKnown: { type: [String] },
  expertise: { type: String }, 
  servicesOffered: { type: [String] },
  consultingLocation: { type: String },
  educationQualification: { type: [String] },
  experienceDescription: { type: String }, 
  awardsAndAchievements: { type: String }, 
  researchAndPublications: { type: String },
  opTimings: { type: [String] },
  gender: { type: String, enum: ['Male', 'Female', 'Others'] },
  profilePicture: { type: String },
  about: { type: String }
}, {
  versionKey: false  // disables __v column when POST request is sent
});

module.exports = mongoose.model('Doctor', doctorSchema); 
 

