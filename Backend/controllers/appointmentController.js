const Appointment = require("../models/Appointments");
const DoctorSlot = require("../models/DoctorSlots");   // ⬅️ import doctor slots
const getNextSequence = require("../utils/getNextSequence");

const normalizeDate = d => { const dt = new Date(d); dt.setUTCHours(0,0,0,0); return dt; };

// ------------------ HELPERS ------------------
const buildAppointmentFilter = query => {
  const filter = {};
  const numericFields = ['doctorID','patientID','appointmentID'];
  for(const key in query){
    if(query[key]) {
      filter[key] = numericFields.includes(key) ? Number(query[key]) : query[key];
    }
  }
  return filter;
};

// ------------------ GET ------------------

// Get all appointments with optional filters (joined with doctor/patient names)
exports.getAppointments = async (req, res) => {
  try {
    const filter = buildAppointmentFilter(req.query);
    if (req.query.date) {
      filter.date = normalizeDate(req.query.date);
    }

    const appointments = await Appointment.aggregate([
      { $match: filter },
      {
        $lookup: {
          from: 'doctors',
          localField: 'doctorID',
          foreignField: 'doctorID',
          as: 'doctor'
        }
      },
      { $unwind: { path: '$doctor', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'patients',
          localField: 'patientID',
          foreignField: 'patientID',
          as: 'patient'
        }
      },
      { $unwind: { path: '$patient', preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          doctorName: '$doctor.fullName',
          patientName: '$patient.fullName'
        }
      },
      { $project: { doctor: 0, patient: 0 } }
    ]);

    res.status(200).json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single appointment by ID (joined with doctor/patient names)
exports.getAppointmentById = async (req, res) => {
  try {
    const appointmentID = Number(req.params.id);
    if (isNaN(appointmentID)) return res.status(400).json({ error: 'Invalid appointmentID' });

    const rows = await Appointment.aggregate([
      { $match: { appointmentID } },
      {
        $lookup: {
          from: 'doctors',
          localField: 'doctorID',
          foreignField: 'doctorID',
          as: 'doctor'
        }
      },
      { $unwind: { path: '$doctor', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'patients',
          localField: 'patientID',
          foreignField: 'patientID',
          as: 'patient'
        }
      },
      { $unwind: { path: '$patient', preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          doctorName: '$doctor.fullName',
          patientName: '$patient.fullName'
        }
      },
      { $project: { doctor: 0, patient: 0 } }
    ]);

    if (!rows.length) return res.status(404).json({ message: 'Appointment not found' });
    res.status(200).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ------------------ NEW SPECIAL GET ------------------

// Get available slots for a doctor on a specific date
exports.getAvailableSlots = async (req, res) => {
  try {
    const doctorID = Number(req.query.doctorID);
    const date = normalizeDate(req.query.date);

    if (!doctorID || !date) {
      return res.status(400).json({ error: "doctorID and date required" });
    }

    // 1. Get doctor's slot schedule
    const doctorSlots = await DoctorSlot.findOne({ doctorID, isActive: true });
    if (!doctorSlots) return res.status(404).json({ message: "No slots found for doctor" });

    // find schedule for that date
    const scheduleRange = doctorSlots.schedule.find(
      r => date >= normalizeDate(r.fromDate) && date <= normalizeDate(r.toDate)
    );
    if (!scheduleRange) return res.status(404).json({ message: "No schedule for this date" });

    const daySchedule = scheduleRange.eachSchedule.find(
      d => normalizeDate(d.date).getTime() === date.getTime()
    );
    if (!daySchedule) return res.status(404).json({ message: "No slots for this day" });

    // merge morning + evening
    let allSlots = [
      ...daySchedule.morningSlot,
      ...daySchedule.eveningSlot
    ];

    // 2. Get already booked/completed appointments for this doctor/date
    const bookedAppointments = await Appointment.find({
      doctorID,
      date,
      status: { $in: ["booked","completed"] }
    });

    const bookedSet = new Set(
      bookedAppointments.map(a => `${a.startTime}-${a.endTime}`)
    );

    // 3. Filter out booked slots
    const availableSlots = [];
    for (let i=0; i < allSlots.length-1; i++) {
      const start = allSlots[i];
      const end   = allSlots[i+1];
      const slotKey = `${start}-${end}`;
      if (!bookedSet.has(slotKey)) {
        availableSlots.push({ startTime: start, endTime: end });
      }
    }

    res.json({
      doctorID,
      date,
      availableSlots
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ------------------ POST ------------------

// Create a new appointment
exports.addAppointment = async (req, res) => {
  try {
    const { doctorID, patientID, date, startTime, endTime } = req.body;
    if (!doctorID || !patientID || !date || !startTime || !endTime) {
      return res.status(400).json({ error: "doctorID, patientID, date, startTime, endTime required" });
    }

    // Prevent double booking
    const existing = await Appointment.findOne({
      doctorID,
      date: normalizeDate(date),
      startTime,
      endTime,
      status: { $in: ["booked","completed"] }
    });
    if (existing) return res.status(400).json({ error: "Slot already booked" });

    const appointmentID = await getNextSequence("appointmentID");
    const appointment = new Appointment({
      appointmentID,
      doctorID,
      patientID,
      date: normalizeDate(date),
      startTime,
      endTime,
      status: "booked" // default here
    });

    await appointment.save();
    res.status(201).json(appointment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ------------------ PUT ------------------

// Update appointment
exports.updateAppointment = async (req, res) => {
  try {
    const appointmentID = Number(req.params.id);
    if (isNaN(appointmentID)) return res.status(400).json({ error: 'Invalid appointmentID' });

    const updated = await Appointment.findOneAndUpdate(
      { appointmentID },
      req.body,
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Appointment not found' });

    res.json({ message: 'Appointment updated successfully', appointment: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ------------------ DELETE ------------------

// Delete by ID
exports.deleteAppointmentById = async (req, res) => {
  try {
    const appointmentID = Number(req.params.id);
    if (isNaN(appointmentID)) return res.status(400).json({ error: 'Invalid appointmentID' });

    const deleted = await Appointment.findOneAndDelete({ appointmentID });
    if (!deleted) return res.status(404).json({ message: 'Appointment not found' });

    res.json({ message: 'Appointment deleted', appointment: deleted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete many by filter
exports.deleteAppointmentsByFilter = async (req, res) => {
  try {
    const { filter } = req.body;
    if (!filter || typeof filter !== 'object') return res.status(400).json({ error: 'Provide valid filter' });
    if (!Object.keys(filter).length) return res.status(400).json({ error: 'Empty filter not allowed' });

    const result = await Appointment.deleteMany(filter);
    if (result.deletedCount === 0) return res.status(404).json({ message: 'No appointments matched filter' });

    res.json({ message: 'Appointments deleted', deletedCount: result.deletedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ------------------ SPECIAL ------------------

// Cancel appointment (soft delete)
exports.cancelAppointment = async (req, res) => {
  try {
    const appointmentID = Number(req.params.id);
    if (isNaN(appointmentID)) return res.status(400).json({ error: 'Invalid appointmentID' });

    const cancelled = await Appointment.findOneAndUpdate(
      { appointmentID },
      { status: "cancelled" },
      { new: true }
    );
    if (!cancelled) return res.status(404).json({ message: 'Appointment not found' });

    res.json({ message: 'Appointment cancelled', appointment: cancelled });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Complete appointment (mark done)
exports.completeAppointment = async (req, res) => {
  try {
    const appointmentID = Number(req.params.id);
    if (isNaN(appointmentID)) return res.status(400).json({ error: 'Invalid appointmentID' });

    const completed = await Appointment.findOneAndUpdate(
      { appointmentID },
      { status: "completed" },
      { new: true }
    );
    if (!completed) return res.status(404).json({ message: 'Appointment not found' });

    res.json({ message: 'Appointment marked completed', appointment: completed });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
