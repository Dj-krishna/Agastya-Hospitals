const DoctorSlot = require('../models/DoctorSlots');
const getNextSequence = require('../utils/getNextSequence');

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

const buildSlotFilter = (query) => {
  const filter = {};
  const numericFields = ['doctorID', 'slotID'];
  for (const key in query) {
    const value = query[key];
    if (!value) continue;
    filter[key] = numericFields.includes(key) ? Number(value) : value;
  }
  return filter;
};

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

// GET all slots with optional filters: doctorID, single date, or date range
exports.getSlots = async (req, res) => {
  try {
    const { doctorID, date, fromDate, toDate } = req.query;
    const filter = buildSlotFilter({ doctorID });

    let slots = await DoctorSlot.find(filter);

    if (date || (fromDate && toDate)) {
      const start = date ? new Date(date) : new Date(fromDate);
      const end = date ? new Date(date) : new Date(toDate);

      slots = slots.map(slot => {
        const filteredSchedule = slot.schedule
          .map(range => {
            const rangeStart = new Date(range.fromDate);
            const rangeEnd = new Date(range.toDate);
            const overlapStart = start > rangeStart ? start : rangeStart;
            const overlapEnd = end < rangeEnd ? end : rangeEnd;

            const datesInRange = getDateRange(overlapStart, overlapEnd);

            const eachSchedule = datesInRange.map(d => {
              const existing = range.eachSchedule.find(
                es => new Date(es.date).toISOString().slice(0,10) === d.toISOString().slice(0,10)
              );
              if (existing) return existing;
              return { date: d, morningSlot: [], eveningSlot: [] };
            });

            return { ...range.toObject(), eachSchedule };
          })
          .filter(range => range.eachSchedule.length > 0);

        return { ...slot.toObject(), schedule: filteredSchedule };
      }).filter(slot => slot.schedule.length > 0);
    }

    res.status(200).json(slots);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET slot by slotID
exports.getSlotById = async (req, res) => {
  try {
    const slotID = Number(req.params.id);
    const slot = await DoctorSlot.findOne({ slotID });
    if (!slot) return res.status(404).json({ message: 'Slot not found' });
    res.status(200).json(slot);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST: Add new slots (auto-generate eachSchedule)
exports.addSlots = async (req, res) => {
  try {
    const payload = req.body;
    const getNextSlotID = async () => await getNextSequence('slotID');

    const processSlot = async (slot) => {
      if (!slot.slotID) slot.slotID = await getNextSlotID();
      const interval = slot.timeSlotInterval || 30;

      // support root-level from/to slots if schedule not provided
      const scheduleArray = slot.schedule?.length ? slot.schedule : [{
        fromDate: slot.fromDate,
        toDate: slot.toDate,
        morningSlot: slot.morningSlot,
        eveningSlot: slot.eveningSlot
      }];

      const scheduleRanges = scheduleArray.map(range => {
        const from = new Date(range.fromDate);
        const to = new Date(range.toDate);
        const dates = getDateRange(from, to);

        const eachSchedule = dates.map(date => ({
          date,
          morningSlot: range.morningSlot?.from && range.morningSlot?.to
            ? generateTimeSlots(range.morningSlot.from, range.morningSlot.to, interval)
            : [],
          eveningSlot: range.eveningSlot?.from && range.eveningSlot?.to
            ? generateTimeSlots(range.eveningSlot.from, range.eveningSlot.to, interval)
            : [],
        }));

        return { fromDate: from, toDate: to, eachSchedule };
      });

      return {
        slotID: slot.slotID,
        doctorID: slot.doctorID,
        schedule: scheduleRanges,
        timeSlotInterval: interval,
        isActive: slot.isActive ?? true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    };

    if (!Array.isArray(payload)) {
      const processed = await processSlot(payload);
      const saved = await new DoctorSlot(processed).save();
      return res.status(201).json(saved);
    }

    const processedSlots = await Promise.all(payload.map(processSlot));
    const inserted = await DoctorSlot.insertMany(processedSlots);
    res.status(201).json(inserted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT: Update slot(s) with root-level from/to times
exports.updateSlot = async (req, res) => {
  const slotID = req.body.slotID || Number(req.query.slotID);
  const { date, fromDate, toDate, morningSlot, eveningSlot, timeSlotInterval } = req.body;

  if (!slotID || (!date && !(fromDate && toDate))) {
    return res.status(400).json({ error: 'slotID and date or fromDate/toDate are required' });
  }

  try {
    const slot = await DoctorSlot.findOne({ slotID });
    if (!slot) return res.status(404).json({ message: 'Slot not found' });

    const start = date ? new Date(date) : new Date(fromDate);
    const end = date ? new Date(date) : new Date(toDate);
    const interval = timeSlotInterval || slot.timeSlotInterval || 30;

    // Update overlapping ranges
    for (const range of slot.schedule) {
      const rangeStart = new Date(range.fromDate);
      const rangeEnd = new Date(range.toDate);
      const overlapStart = start > rangeStart ? start : rangeStart;
      const overlapEnd = end < rangeEnd ? end : rangeEnd;

      const datesToUpdate = getDateRange(overlapStart, overlapEnd);

      datesToUpdate.forEach(d => {
        const existing = range.eachSchedule.find(
          es => new Date(es.date).toISOString().slice(0,10) === d.toISOString().slice(0,10)
        );
        if (existing) {
          if (morningSlot) existing.morningSlot = generateTimeSlots(morningSlot.from, morningSlot.to, interval);
          if (eveningSlot) existing.eveningSlot = generateTimeSlots(eveningSlot.from, eveningSlot.to, interval);
        } else {
          range.eachSchedule.push({
            date: d,
            morningSlot: morningSlot ? generateTimeSlots(morningSlot.from, morningSlot.to, interval) : [],
            eveningSlot: eveningSlot ? generateTimeSlots(eveningSlot.from, eveningSlot.to, interval) : []
          });
        }
      });
    }

    // Add new range if no overlap
    const existingRanges = slot.schedule.map(r => ({ start: new Date(r.fromDate), end: new Date(r.toDate) }));
    const isOverlapping = existingRanges.some(r => end >= r.start && start <= r.end);

    if (!isOverlapping) {
      const datesExtra = getDateRange(start, end);
      slot.schedule.push({
        fromDate: start,
        toDate: end,
        eachSchedule: datesExtra.map(d => ({
          date: d,
          morningSlot: morningSlot ? generateTimeSlots(morningSlot.from, morningSlot.to, interval) : [],
          eveningSlot: eveningSlot ? generateTimeSlots(eveningSlot.from, eveningSlot.to, interval) : []
        }))
      });
    }

    slot.timeSlotInterval = interval;
    slot.updatedAt = new Date();
    await slot.save();

    res.json({ message: 'Schedule updated', slot });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// DELETE: Slot by slotID
exports.deleteSlotById = async (req, res) => {
  try {
    const slotID = Number(req.params.id);
    const deleted = await DoctorSlot.findOneAndDelete({ slotID });
    if (!deleted) return res.status(404).json({ message: 'Slot not found' });
    res.json({ message: 'Slot deleted', slot: deleted });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE: Bulk delete slots by filter
exports.deleteSlotsByFilter = async (req, res) => {
  try {
    const { filter } = req.body;
    if (!filter || typeof filter !== 'object') return res.status(400).json({ error: 'Provide valid filter' });

    const result = await DoctorSlot.deleteMany(filter);
    if (result.deletedCount === 0) return res.status(404).json({ message: 'No slots matched filter' });

    res.json({ message: 'Slots deleted', deletedCount: result.deletedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE: Remove specific date from schedule
exports.deleteScheduleDate = async (req, res) => {
  const { slotID, date } = req.body;
  if (!slotID || !date) return res.status(400).json({ error: 'slotID and date are required' });

  try {
    const updateDate = new Date(date);
    const result = await DoctorSlot.updateOne(
      { slotID },
      { $pull: { 'schedule.$[].eachSchedule': { date: updateDate } }, $set: { updatedAt: new Date() } }
    );

    if (result.modifiedCount === 0)
      return res.status(404).json({ message: 'Date not found in schedule or slot not found' });

    res.json({ message: 'Schedule date removed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
