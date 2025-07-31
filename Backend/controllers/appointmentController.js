const Appointment = require('../models/Appointments');
const getNextSequence = require('../utils/getNextSequence');

// Helper: Generate time slots in HH:mm format
const generateTimeSlots = (start, end, interval) => {
  const slots = [];
  let [startHour, startMin] = start.split(':').map(Number);
  let [endHour, endMin] = end.split(':').map(Number);

  let current = new Date(0, 0, 0, startHour, startMin);
  const endTime = new Date(0, 0, 0, endHour, endMin);

  while (current < endTime) {
    const hh = String(current.getHours()).padStart(2, '0');
    const mm = String(current.getMinutes()).padStart(2, '0');
    slots.push(`${hh}:${mm}`);
    current.setMinutes(current.getMinutes() + interval);
  }

  return slots;
};

// Utility to build filters from query
const buildAppointmentFilter = (query) => {
  const filter = {};
  const numericFields = ['doctorID', 'appointmentID'];

  for (const key in query) {
    const value = query[key];
    if (!value) continue;

    if (numericFields.includes(key)) {
      filter[key] = Number(value);
    } else {
      filter[key] = value;
    }
  }
  return filter;
};

// GET: Fetch appointments
exports.getAppointments = async (req, res) => {
  try {
    const filter = buildAppointmentFilter(req.query);
    const appointments = await Appointment.find(filter);
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET: Fetch by appointmentID
exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findOne({ appointmentID: Number(req.params.id) });
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST: Add single or bulk appointment
exports.addAppointments = async (req, res) => {
  try {
    const payload = req.body;

    const getNextAppointmentID = async () => {
      return await getNextSequence('appointmentID');
    };

    const processAppointment = async (appt) => {
      if (!appt.appointmentID) {
        appt.appointmentID = await getNextAppointmentID();
      }

      const interval = appt.timeSlotInterval || 30;

      if (appt.morningSlot && appt.morningSlot.from && appt.morningSlot.to) {
        appt.morningSlot = generateTimeSlots(appt.morningSlot.from, appt.morningSlot.to, interval);
      }

      if (appt.eveningSlot && appt.eveningSlot.from && appt.eveningSlot.to) {
        appt.eveningSlot = generateTimeSlots(appt.eveningSlot.from, appt.eveningSlot.to, interval);
      }

      appt.createdAt = appt.createdAt || new Date();
      appt.updatedAt = new Date();

      return appt;
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

// PUT: Update appointment by filter
exports.updateAppointment = async (req, res) => {
  const filter = req.query;
  const updateData = req.body;

  if (!Object.keys(filter).length || !Object.keys(updateData).length) {
    return res.status(400).json({ error: 'Filter and update data required' });
  }

  try {
    updateData.updatedAt = new Date();
    const result = await Appointment.updateMany(filter, { $set: updateData });
    const updatedAppointments = await Appointment.find(filter);
    res.json({
      message: 'Appointment(s) updated',
      updatedCount: result.modifiedCount,
      updatedAppointments
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE: Delete by appointmentID
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

// DELETE: Bulk delete by filter
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
