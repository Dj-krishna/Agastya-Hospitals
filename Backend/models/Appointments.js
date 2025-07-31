const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  appointmentID: { type: Number, required: true, unique: true },
  doctorID: { type: Number, required: true },
  fromDate: { type: Date, required: true },
  toDate: { type: Date, required: true },
  morningSlot: [{ type: String }],  // Stored as ["09:00", "09:30", ...]
  eveningSlot: [{ type: String }],
  timeSlotInterval: { type: Number, default: 30 },
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true,
  versionKey: false
});

module.exports = mongoose.model('Appointment', appointmentSchema);
