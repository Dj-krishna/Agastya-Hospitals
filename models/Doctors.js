const mongoose = require('mongoose'); 

const doctorSchema = new mongoose.Schema({
  doctorID: { type: Number, required: true, unique: true },
  fullName: { type: String, required: true },
  designation: { type: String, required: true },
  specialty: { type: [String], required: true },
  email: { type: String, required: true },
  gender: String,
  phone: String,
  about: String,
  achievements: [String],
  profilePicture: String
}, {
  versionKey: false  // disables __v column when POST request is sent
});

module.exports = mongoose.model('Doctor', doctorSchema); 
 