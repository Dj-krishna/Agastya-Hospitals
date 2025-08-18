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

// Returns array of Dates (normalized to UTC midnight)
const getDateRange = (start, end) => {
  const dates = [];
  let current = new Date(start);
  current.setUTCHours(0,0,0,0);
  end = new Date(end);
  end.setUTCHours(0,0,0,0);

  while (current <= end) {
    dates.push(new Date(current));
    current.setUTCDate(current.getUTCDate() + 1);
  }
  return dates;
};

// ------------------ GET ALL SLOTS ------------------
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
                es => es.date.toISOString().slice(0,10) === d.toISOString().slice(0,10)
              );
              return existing ? existing : { date: d, morningSlot: [], eveningSlot: [] };
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

// ------------------ GET SLOT BY ID ------------------
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

// ------------------ POST ADD SLOTS ------------------
exports.addSlots = async (req, res) => {
  try {
    const payload = Array.isArray(req.body) ? req.body : [req.body];
    const getNextSlotID = async () => await getNextSequence('slotID');

    const processedSlots = [];

    for (const slot of payload) {
      const interval = slot.timeSlotInterval || 30;

      const scheduleArray = slot.schedule?.length ? slot.schedule : [{
        fromDate: slot.fromDate,
        toDate: slot.toDate,
        morningSlot: slot.morningSlot,
        eveningSlot: slot.eveningSlot
      }];

      let existingSlot = await DoctorSlot.findOne({ doctorID: slot.doctorID });
      if (!existingSlot) {
        existingSlot = new DoctorSlot({
          slotID: await getNextSlotID(),
          doctorID: slot.doctorID,
          schedule: [],
          timeSlotInterval: interval,
          isActive: slot.isActive ?? true,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }

      for (const range of scheduleArray) {
        const from = new Date(range.fromDate);
        const to = new Date(range.toDate);

        const overlappingRange = existingSlot.schedule.find(r =>
          new Date(r.fromDate).getTime() === from.getTime() &&
          new Date(r.toDate).getTime() === to.getTime()
        );

        // Build eachSchedule for **all dates in range**
        const eachSchedule = getDateRange(from, to).map(date => ({
          date,
          morningSlot: range.morningSlot?.from && range.morningSlot?.to
            ? generateTimeSlots(range.morningSlot.from, range.morningSlot.to, interval)
            : [],
          eveningSlot: range.eveningSlot?.from && range.eveningSlot?.to
            ? generateTimeSlots(range.eveningSlot.from, range.eveningSlot.to, interval)
            : [],
        }));

        if (overlappingRange) {
          eachSchedule.forEach(newDateSchedule => {
            const existingDate = overlappingRange.eachSchedule.find(
              es => es.date.toISOString().slice(0,10) === newDateSchedule.date.toISOString().slice(0,10)
            );
            if (existingDate) {
              existingDate.morningSlot = newDateSchedule.morningSlot.length ? newDateSchedule.morningSlot : existingDate.morningSlot;
              existingDate.eveningSlot = newDateSchedule.eveningSlot.length ? newDateSchedule.eveningSlot : existingDate.eveningSlot;
            } else {
              overlappingRange.eachSchedule.push(newDateSchedule);
            }
          });
        } else {
          existingSlot.schedule.push({ fromDate: from, toDate: to, eachSchedule });
        }
      }

      existingSlot.updatedAt = new Date();
      await existingSlot.save();
      processedSlots.push(existingSlot);
    }

    res.status(201).json(processedSlots.length === 1 ? processedSlots[0] : processedSlots);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ------------------ PUT UPDATE SLOTS ------------------
exports.updateSlot = async (req, res) => {
  const slotID = req.body.slotID || Number(req.query.slotID);
  const { fromDate, toDate, morningSlot, eveningSlot, timeSlotInterval } = req.body;

  if (!slotID || !(fromDate && toDate)) {
    return res.status(400).json({ error: 'slotID and fromDate/toDate are required' });
  }

  try {
    const slot = await DoctorSlot.findOne({ slotID });
    if (!slot) return res.status(404).json({ message: 'Slot not found' });

    const start = new Date(fromDate);
    const end = new Date(toDate);
    const interval = timeSlotInterval || slot.timeSlotInterval || 30;

    // Build a map of all existing dates for quick lookup
    const dateMap = {};
    slot.schedule.forEach(range => {
      range.eachSchedule.forEach(es => {
        const key = es.date.toISOString().slice(0, 10);
        dateMap[key] = { range, es };
      });
    });

    // Process each date in the update range
    getDateRange(start, end).forEach(d => {
      const key = d.toISOString().slice(0, 10);
      if (dateMap[key]) {
        // Date exists → overwrite
        if (morningSlot) dateMap[key].es.morningSlot = morningSlot;
        if (eveningSlot) dateMap[key].es.eveningSlot = eveningSlot;
      } else {
        // Date does not exist → try to insert into an overlapping range
        let inserted = false;
        for (const range of slot.schedule) {
          const rangeStart = new Date(range.fromDate);
          const rangeEnd = new Date(range.toDate);
          if (d >= rangeStart && d <= rangeEnd) {
            range.eachSchedule.push({
              date: d,
              morningSlot: morningSlot || [],
              eveningSlot: eveningSlot || []
            });
            inserted = true;
            break;
          }
        }
        // If no overlapping range, create a new schedule object
        if (!inserted) {
          slot.schedule.push({
            fromDate: d,
            toDate: d,
            eachSchedule: [{
              date: d,
              morningSlot: morningSlot || [],
              eveningSlot: eveningSlot || []
            }]
          });
        }
      }
    });

    slot.timeSlotInterval = interval;
    slot.updatedAt = new Date();
    await slot.save();

    res.json({ message: 'Schedule updated successfully', slot });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ------------------ DELETE FUNCTIONS ------------------
// Delete slot by slotID
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

// Bulk delete slots
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

// Delete specific date from schedule
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
