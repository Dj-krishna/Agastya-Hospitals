const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  appointmentID: { type: Number, required: true, unique: true },
  doctorID: { type: Number, required: true },
  patientID: { type: Number, required: true },
  date: { type: Date, required: true },
  startTime: { type: String, required: true }, // "10:00"
  endTime: { type: String, required: true },   // "10:30"
  status: { type: String, enum: ["booked", "completed", "cancelled"], default: "booked" }
}, { timestamps: true, versionKey: false });

// Prevent double booking on same doctor, date, and slot
appointmentSchema.index({ doctorID: 1, date: 1, startTime: 1, endTime: 1 }, { unique: true });

module.exports = mongoose.model('Appointment', appointmentSchema, 'appointments');