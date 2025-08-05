// controllers/appointmentController.js

const Appointment = require('../models/Appointments');
const getNextSequence = require('../utils/getNextSequence');

// Helper: generate slot times
const generateTimeSlots = (start, end, interval) => {
  const slots = [];
  let [sh, sm] = start.split(':').map(Number);
  let [eh, em] = end.split(':').map(Number);
  let current = new Date(0, 0, 0, sh, sm);
  const endTime = new Date(0, 0, 0, eh, em);

  while (current < endTime) {
    const hh = String(current.getHours()).padStart(2, '0');
    const mm = String(current.getMinutes()).padStart(2, '0');
    slots.push(`${hh}:${mm}`);
    current.setMinutes(current.getMinutes() + interval);
  }
  return slots;
};

// Helper: build filter from query
const buildAppointmentFilter = (query) => {
  const filter = {};
  const numericFields = ['doctorID', 'appointmentID'];
  for (const key in query) {
    const value = query[key];
    if (!value) continue;
    filter[key] = numericFields.includes(key) ? Number(value) : value;
  }
  return filter;
};

// Helper: get all dates from fromDate to toDate
const getDateRange = (start, end) => {
  const dates = [];
  let current = new Date(start);
  end = new Date(end);
  while (current <= end) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
};

// GET: All appointments
exports.getAppointments = async (req, res) => {
  try {
    const filter = buildAppointmentFilter(req.query);
    const appointments = await Appointment.find(filter);
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET: Appointment by ID
exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findOne({ appointmentID: Number(req.params.id) });
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST: Create appointments with schedule
exports.addAppointments = async (req, res) => {
  try {
    const payload = req.body;
    const getNextAppointmentID = async () => await getNextSequence('appointmentID');

    const processAppointment = async (appt) => {
      if (!appt.appointmentID) appt.appointmentID = await getNextAppointmentID();

      const interval = appt.timeSlotInterval || 30;
      const schedule = [];
      const from = new Date(appt.fromDate);
      const to = new Date(appt.toDate);
      const dateRange = getDateRange(from, to);

      dateRange.forEach(date => {
        const entry = { date };
        entry.morningSlot = (appt.morningSlot?.from && appt.morningSlot?.to)
          ? generateTimeSlots(appt.morningSlot.from, appt.morningSlot.to, interval)
          : [];
        entry.eveningSlot = (appt.eveningSlot?.from && appt.eveningSlot?.to)
          ? generateTimeSlots(appt.eveningSlot.from, appt.eveningSlot.to, interval)
          : [];
        schedule.push(entry);
      });

      return {
        appointmentID: appt.appointmentID,
        doctorID: appt.doctorID,
        fromDate: from,
        toDate: to,
        schedule,
        timeSlotInterval: interval,
        isActive: appt.isActive ?? true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    };

    if (!Array.isArray(payload)) {
      const processed = await processAppointment(payload);
      const saved = await new Appointment(processed).save();
      return res.status(201).json(saved);
    }

    const processedAppointments = await Promise.all(payload.map(processAppointment));
    const inserted = await Appointment.insertMany(processedAppointments);
    res.status(201).json(inserted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT: Update specific schedule date slots
exports.updateAppointment = async (req, res) => {
  const { appointmentID, date, morningSlot, eveningSlot } = req.body;
  if (!appointmentID || !date) {
    return res.status(400).json({ error: 'appointmentID and date are required' });
  }
  try {
    const appointment = await Appointment.findOne({ appointmentID });
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    const updateDate = new Date(date);
    const existing = appointment.schedule.find(d =>
      new Date(d.date).toISOString().slice(0, 10) === updateDate.toISOString().slice(0, 10)
    );

    if (existing) {
      if (morningSlot) existing.morningSlot = morningSlot;
      if (eveningSlot) existing.eveningSlot = eveningSlot;
    } else {
      appointment.schedule.push({ date: updateDate, morningSlot, eveningSlot });
    }

    appointment.updatedAt = new Date();
    await appointment.save();
    res.json({ message: 'Schedule updated for date', appointment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE: Delete full appointment by ID
exports.deleteAppointmentById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const deleted = await Appointment.findOneAndDelete({ appointmentID: id });
    if (!deleted) return res.status(404).json({ message: 'Appointment not found' });
    res.json({ message: 'Appointment deleted', appointment: deleted });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE: Bulk delete appointments by filter
exports.deleteAppointmentsByFilter = async (req, res) => {
  try {
    const { filter } = req.body;
    if (!filter || typeof filter !== 'object') {
      return res.status(400).json({ error: 'Provide valid filter' });
    }
    const result = await Appointment.deleteMany(filter);
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'No appointments matched filter' });
    }
    res.json({ message: 'Appointments deleted', deletedCount: result.deletedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE: Remove specific date from schedule
exports.deleteScheduleDate = async (req, res) => {
  const { appointmentID, date } = req.body;
  if (!appointmentID || !date) {
    return res.status(400).json({ error: 'appointmentID and date are required' });
  }
  try {
    const result = await Appointment.updateOne(
      { appointmentID },
      { $pull: { schedule: { date: new Date(date) } }, $set: { updatedAt: new Date() } }
    );
    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: 'Date not found in schedule or appointment not found' });
    }
    res.json({ message: 'Schedule date removed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
