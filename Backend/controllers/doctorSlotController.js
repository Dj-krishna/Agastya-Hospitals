const DoctorSlot = require('../models/DoctorSlots');
const Appointment = require('../models/Appointments');
const getNextSequence = require('../utils/getNextSequence');

// ------------------ HELPERS ------------------
const generateTimeSlots = (start, end, interval) => {
  if (!start || !end) return [];
  const slots = [];
  let [sh, sm] = start.split(':').map(Number);
  let [eh, em] = end.split(':').map(Number);
  let current = new Date(0, 0, 0, sh, sm);
  const endTime = new Date(0, 0, 0, eh, em);
  while (current < endTime) {
    slots.push(
      `${String(current.getHours()).padStart(2, '0')}:${String(
        current.getMinutes()
      ).padStart(2, '0')}`
    );
    current.setMinutes(current.getMinutes() + interval);
  }
  return slots;
};

const normalizeDate = (d) => {
  const dt = new Date(d);
  dt.setUTCHours(0, 0, 0, 0);
  return dt;
};

const getDateRange = (start, end) => {
  const dates = [];
  let current = normalizeDate(start);
  end = normalizeDate(end);
  while (current <= end) {
    dates.push(new Date(current));
    current.setUTCDate(current.getUTCDate() + 1);
  }
  return dates;
};

const buildSlotFilter = (query) => {
  const filter = {};
  const numericFields = ['doctorID', 'slotID'];
  for (const key in query) {
    if (query[key])
      filter[key] = numericFields.includes(key)
        ? Number(query[key])
        : query[key];
  }
  return filter;
};

const validateSlotPayload = (slot) => {
  if (!slot.doctorID) return 'doctorID is required';
  if (!slot.schedule?.length && !(slot.fromDate && slot.toDate))
    return 'schedule array or fromDate/toDate required';
  return null;
};

// ------------------ GET ------------------
exports.getSlots = async (req, res) => {
  try {
    const { doctorID, date, fromDate, toDate } = req.query;

    // Always fetch as plain objects
    let slots = await DoctorSlot.find(buildSlotFilter({ doctorID })).lean();

    if (date || (fromDate && toDate)) {
      const start = date ? normalizeDate(date) : normalizeDate(fromDate);
      const end = date ? normalizeDate(date) : normalizeDate(toDate);

      slots = slots
        .map((slot) => {
          const filteredSchedule = slot.schedule
            .map((range) => {
              const rs = normalizeDate(range.fromDate),
                re = normalizeDate(range.toDate);

              const overlapStart = start > rs ? start : rs;
              const overlapEnd = end < re ? end : re;

              const eachSchedule = getDateRange(overlapStart, overlapEnd).map(
                (d) => {
                  const existing = range.eachSchedule.find(
                    (es) =>
                      normalizeDate(es.date).toISOString() ===
                      d.toISOString()
                  );
                  return existing
                    ? existing
                    : { date: d, morningSlot: [], eveningSlot: [] };
                }
              );

              return { ...range, eachSchedule };
            })
            .filter((r) => r.eachSchedule.length > 0);

          return { ...slot, schedule: filteredSchedule };
        })
        .filter((s) => s.schedule.length > 0);
    }

    // Enrich with doctorName
    if (slots && slots.length) {
      const doctorIDs = [...new Set(slots.map((s) => s.doctorID))];
      const doctors = await require('../models/Doctors').find(
        { doctorID: { $in: doctorIDs } },
        { doctorID: 1, fullName: 1, _id: 0 }
      ).lean();

      const doctorMap = new Map(
        doctors.map((d) => [d.doctorID, d.fullName])
      );

      slots = slots.map((s) => ({
        ...s,
        doctorName: doctorMap.get(s.doctorID) || null,
      }));
    }

    res.status(200).json(slots);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ------------------ GET AVAILABLE SLOTS ------------------
exports.getAvailableSlots = async (req, res) => {
  try {
    const { doctorID, date } = req.query;
    if (!doctorID)
      return res.status(400).json({ error: 'doctorID query param is required' });

    const slotDoc = await DoctorSlot.findOne({ doctorID: Number(doctorID) });
    if (!slotDoc) return res.status(404).json({ error: 'No slots found' });

    const today = normalizeDate(new Date()); // today's date, no time

    // Prepare available slots array
    let available = [];

    if (date) {
      const normalizedDate = normalizeDate(date);
      if (normalizedDate < today) {
        return res.status(400).json({ error: 'Cannot fetch slots for past dates' });
      }

      const daySchedule = slotDoc.schedule.flatMap((range) =>
        range.eachSchedule.filter(
          (es) => normalizeDate(es.date).getTime() === normalizedDate.getTime()
        )
      );

      if (!daySchedule.length)
        return res.status(404).json({ error: 'No slots for this date' });

      const bookedAppointments = await Appointment.find({
        doctorID: Number(doctorID),
        date: normalizedDate,
        status: { $in: ['booked', 'completed'] },
      });

      const bookedTimes = new Set(bookedAppointments.map((a) => a.startTime));

      available = daySchedule.map((es) => ({
        date: es.date,
        morningSlot: es.morningSlot.filter((t) => !bookedTimes.has(t)),
        eveningSlot: es.eveningSlot.filter((t) => !bookedTimes.has(t)),
      }));
    } else {
      // No specific date: return all future slots only
      const bookedAppointments = await Appointment.find({
        doctorID: Number(doctorID),
        status: { $in: ['booked', 'completed'] },
      });

      const bookedMap = {};
      bookedAppointments.forEach((a) => {
        const key = normalizeDate(a.date).toISOString();
        if (!bookedMap[key]) bookedMap[key] = new Set();
        bookedMap[key].add(a.startTime);
      });

      slotDoc.schedule.forEach((range) => {
        range.eachSchedule.forEach((es) => {
          const slotDate = normalizeDate(es.date);
          if (slotDate >= today) { // filter out past dates
            const key = slotDate.toISOString();
            const bookedTimes = bookedMap[key] || new Set();
            available.push({
              date: es.date,
              morningSlot: es.morningSlot.filter((t) => !bookedTimes.has(t)),
              eveningSlot: es.eveningSlot.filter((t) => !bookedTimes.has(t)),
            });
          }
        });
      });
    }

    res.status(200).json({
      doctorID: Number(doctorID),
      available,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// ------------------ POST ------------------
exports.addSlots = async (req, res) => {
  try {
    const payload = Array.isArray(req.body) ? req.body : [req.body];
    const processedSlots = [];

    for (const slot of payload) {
      // 1. Validate payload
      const validationError = validateSlotPayload(slot);
      if (validationError)
        return res.status(400).json({ error: validationError });

      const interval = slot.timeSlotInterval || 30;
      const scheduleArray = slot.schedule?.length
        ? slot.schedule
        : [
            {
              fromDate: slot.fromDate,
              toDate: slot.toDate,
              morningSlot: slot.morningSlot,
              eveningSlot: slot.eveningSlot,
            },
          ];

      // 2. Check for existing slot document
      let existingSlot = await DoctorSlot.findOne({ doctorID: slot.doctorID });

      // 3. Check for overlapping dates before creating new slotID
      const existingDates = new Set();
      if (existingSlot) {
        existingSlot.schedule.forEach((r) =>
          r.eachSchedule.forEach((es) =>
            existingDates.add(normalizeDate(es.date).toISOString())
          )
        );
      }

      for (const range of scheduleArray) {
        const from = normalizeDate(range.fromDate);
        const to = normalizeDate(range.toDate);
        const overlappingDates = getDateRange(from, to)
          .map((d) => d.toISOString())
          .filter((d) => existingDates.has(d));

        if (overlappingDates.length)
          return res.status(400).json({
            error: 'Some dates exist. Please update in Manage Slots.',
            overlappingDates,
          });
      }

      // 4. Create new DoctorSlot if none exists (counter increment only now)
      if (!existingSlot) {
        existingSlot = new DoctorSlot({
          slotID: await getNextSequence('slotID'),
          doctorID: slot.doctorID,
          schedule: [],
          timeSlotInterval: interval,
          isActive: slot.isActive ?? true,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      // 5. Add new schedule ranges
      for (const range of scheduleArray) {
        const from = normalizeDate(range.fromDate);
        const to = normalizeDate(range.toDate);

        const eachSchedule = getDateRange(from, to).map((d) => ({
          date: d,
          morningSlot:
            range.morningSlot?.from && range.morningSlot?.to
              ? generateTimeSlots(range.morningSlot.from, range.morningSlot.to, interval)
              : [],
          eveningSlot:
            range.eveningSlot?.from && range.eveningSlot?.to
              ? generateTimeSlots(range.eveningSlot.from, range.eveningSlot.to, interval)
              : [],
        }));

        existingSlot.schedule.push({ fromDate: from, toDate: to, eachSchedule });
      }

      // 6. Update interval & timestamps
      existingSlot.timeSlotInterval = interval;
      existingSlot.updatedAt = new Date();

      await existingSlot.save();
      processedSlots.push(existingSlot);
    }

    res
      .status(201)
      .json(processedSlots.length === 1 ? processedSlots[0] : processedSlots);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ------------------ PUT ------------------
exports.updateSlot = async (req, res) => {
  try {
    const slotID = req.body.slotID || Number(req.query.slotID);
    if (!slotID || isNaN(slotID))
      return res.status(400).json({ error: 'Valid slotID required' });
    const { fromDate, toDate, morningSlot, eveningSlot, timeSlotInterval } = req.body;
    if (!(fromDate && toDate))
      return res.status(400).json({ error: 'fromDate/toDate required' });

    const slot = await DoctorSlot.findOne({ slotID });
    if (!slot) return res.status(404).json({ message: 'Slot not found' });

    const start = normalizeDate(fromDate),
      end = normalizeDate(toDate);
    const interval = timeSlotInterval || slot.timeSlotInterval || 30;

    const dateMap = {};
    slot.schedule.forEach((r) =>
      r.eachSchedule.forEach((es) => (dateMap[normalizeDate(es.date).toISOString()] = { range: r, es }))
    );

    getDateRange(start, end).forEach((d) => {
      const key = d.toISOString();
      if (dateMap[key]) {
        if (morningSlot) dateMap[key].es.morningSlot = morningSlot;
        if (eveningSlot) dateMap[key].es.eveningSlot = eveningSlot;
      } else {
        let inserted = false;
        for (const range of slot.schedule) {
          const rs = normalizeDate(range.fromDate),
            re = normalizeDate(range.toDate);
          if (d >= rs && d <= re) {
            range.eachSchedule.push({ date: d, morningSlot: morningSlot || [], eveningSlot: eveningSlot || [] });
            inserted = true;
            break;
          }
        }
        if (!inserted)
          slot.schedule.push({
            fromDate: d,
            toDate: d,
            eachSchedule: [{ date: d, morningSlot: morningSlot || [], eveningSlot: eveningSlot || [] }],
          });
      }
    });

    slot.timeSlotInterval = interval;
    slot.updatedAt = new Date();
    await slot.save();

    res.json({ message: 'Schedule updated successfully', slot });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ------------------ DELETE ------------------
exports.deleteSlots = async (req, res) => {
  try {
    let filter = {};

    // Bulk IDs from params
    if (req.params.ids) {
      const ids = req.params.ids
        .split(',')
        .map(id => Number(id.trim()))
        .filter(id => !isNaN(id));
      if (!ids.length) return res.status(400).json({ error: 'No valid IDs provided' });
      filter = { slotID: { $in: ids } };
    }

    // Single or multiple IDs from query
    else if (req.query.slotID) {
      if (typeof req.query.slotID === 'string' && req.query.slotID.includes(',')) {
        const ids = req.query.slotID
          .split(',')
          .map(id => Number(id.trim()))
          .filter(id => !isNaN(id));
        filter = { slotID: { $in: ids } };
      } else {
        filter = { slotID: Number(req.query.slotID) };
      }
    }

    // Other query filters
    else if (Object.keys(req.query).length > 0) {
      filter = buildSlotFilter(req.query);
    }

    // Body filter
    else if (req.body.filter) {
      if (typeof req.body.filter !== 'object')
        return res.status(400).json({ error: 'Provide valid filter' });
      filter = req.body.filter;
    }

    else {
      return res.status(400).json({ error: 'No filter provided. Use query params, body filter, or /bulk/:ids' });
    }

    // Get docs first
    const toDelete = await DoctorSlot.find(filter);
    if (!toDelete.length)
      return res.status(404).json({ message: 'No slots found matching the criteria' });

    const result = await DoctorSlot.deleteMany(filter);
    if (result.deletedCount === 0)
      return res.status(404).json({ message: 'No slots were deleted' });

    // For single delete, send back the deleted slot
    if (
      (req.query.slotID && !String(req.query.slotID).includes(',')) ||
      (req.params.ids && req.params.ids.split(',').length === 1)
    ) {
      res.json({ message: 'Slot deleted', slot: toDelete[0] });
    } else {
      res.json({
        message: 'Slots deleted',
        deletedCount: result.deletedCount,
        deletedSlots: toDelete
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ------------------ SPECIAL DELETE ------------------
exports.deleteScheduleDate = async (req, res) => {
  try {
    const { slotID, date } = req.body;
    if (!slotID || !date)
      return res.status(400).json({ error: 'slotID and date required' });

    const updateDate = normalizeDate(date);
    const result = await DoctorSlot.updateOne(
      { slotID },
      { $pull: { 'schedule.$[].eachSchedule': { date: updateDate } }, $set: { updatedAt: new Date() } }
    );

    if (result.modifiedCount === 0)
      return res
        .status(404)
        .json({ message: 'Date not found in schedule or slot not found' });

    res.json({ message: 'Schedule date removed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


