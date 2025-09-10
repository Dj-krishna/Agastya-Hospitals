require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const connectDB = require('./config/db');
const { updateExpiredAppointments } = require('./utils/appointmentStatusUpdater');

const authRoutes = require('./routes/authRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const patientRoutes = require('./routes/patientRoutes');
const specialityRoutes = require('./routes/specialityRoutes');
const healthPackageRoutes = require('./routes/healthPackageRoutes');
const subSpecialityRoutes = require('./routes/subSpecialityRoutes');
const userRoutes = require('./routes/userRoutes');
const userRoleRoutes = require('./routes/userRoleRoutes');
const doctorSlotRoutes = require('./routes/doctorSlotRoutes');
const moduleRoutes = require('./routes/moduleRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');

// Connect to MongoDB
connectDB();

const app = express();

// Global security, CORS, logging middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// ---------------- ROUTES ----------------

// Doctor routes (multipart handled via multer, no express.json())
app.use('/api/doctors', doctorRoutes);

// JSON-only routes
app.use('/api/auth', express.json(), authRoutes);
app.use('/api/patients', express.json(), patientRoutes);
app.use('/api/specialities', express.json(), specialityRoutes);
app.use('/api/health-packages', express.json(), healthPackageRoutes);
app.use('/api/sub-specialities', express.json(), subSpecialityRoutes);
app.use('/api/users', express.json(), userRoutes);
app.use('/api/user-roles', express.json(), userRoleRoutes);
app.use('/api/doctor-slots', express.json(), doctorSlotRoutes);
app.use('/api/modules', express.json(), moduleRoutes);
app.use('/api/departments', express.json(), departmentRoutes);
app.use('/api/appointments', express.json(), appointmentRoutes);

// ---------------- ERROR HANDLER ----------------
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  if (err.name === 'MulterError') {
    return res.status(400).json({ error: 'File upload error', details: err.message });
  }
  res.status(500).json({ error: 'Internal server error', details: err.message });
});

// ---------------- SERVER ----------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

// ---------------- SCHEDULER ----------------
if (process.env.AUTO_UPDATE_APPOINTMENTS !== 'false') {
  setInterval(async () => {
    try {
      await updateExpiredAppointments();
    } catch (error) {
      console.error('❌ Scheduled appointment status update failed:', error);
    }
  }, 24 * 3600000); // every 24 hours

  console.log('🔄 Automatic appointment status updater started (runs every day)');
} else {
  console.log('⏸️ Automatic appointment status updates disabled');
}
