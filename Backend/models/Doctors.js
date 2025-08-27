const mongoose = require('mongoose');

const fileRefSchema = new mongoose.Schema({
	fileId: { type: mongoose.Schema.Types.ObjectId, index: true },
	filename: String,
	contentType: String,
	length: Number,
	uploadDate: Date,
	bucket: { type: String, enum: ['images', 'videos'] }
}, { _id: false });

const doctorSchema = new mongoose.Schema({
  doctorID: { type: Number, required: true, unique: true },
  fullName: { type: String, required: true },
  countryCode: { type: String, required: true }, 
  mobile: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  medicalRegNumber: { type: String, required: true }, 
  designation: { type: String, required: true },
  departmentID: { type: Number, required: true },        // links to Departments.departmentID
  speciality: [{ type: Number }],
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
  profileImageGfs: fileRefSchema,
  introVideoGfs: fileRefSchema,
  about: { type: String }
}, {
  versionKey: false  // disables __v column when POST request is sent
});

module.exports = mongoose.model('Doctor', doctorSchema); 
 