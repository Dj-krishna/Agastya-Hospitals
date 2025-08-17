const mongoose = require('mongoose');

// Sub-schema for each day within a range
const eachScheduleSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    morningSlot: [{ type: String }], // e.g., ["09:00", "09:30"]
    eveningSlot: [{ type: String }], // e.g., ["15:00", "15:30"]
  },
  { _id: false }
);

// Sub-schema for a schedule range
const scheduleRangeSchema = new mongoose.Schema(
  {
    fromDate: { type: Date, required: true },
    toDate: { type: Date, required: true },
    eachSchedule: [eachScheduleSchema], // auto-generated daily slots
  },
  { _id: false }
);

// Main DoctorSlot schema
const slotSchema = new mongoose.Schema(
  {
    slotID: { type: Number, required: true, unique: true },
    doctorID: { type: Number, required: true },
    schedule: [scheduleRangeSchema], // Multiple ranges
    timeSlotInterval: { type: Number, default: 30 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model('DoctorSlot', slotSchema, 'doctorSlots');
