require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const connectDB = require('./config/db');
const { updateExpiredAppointments } = require('./utils/appointmentStatusUpdater');

// ---------------- Routes ----------------
const authRoutes = require('./routes/authRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const patientRoutes = require('./routes/patientRoutes');
const specialityRoutes = require('./routes/specialityRoutes');
const healthPackageRoutes = require('./routes/healthPackageRoutes');
const subSpecialityRoutes = require('./routes/subSpecialityRoutes');
const userRoutes = require('./routes/userRoutes');
const userRoleRoutes = require('./routes/userRoleRoutes');
const doctorSlotRoutes  = require('./routes/doctorSlotRoutes');
const moduleRoutes = require('./routes/moduleRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');

// ---------------- Connect to MongoDB ----------------
connectDB();

// ---------------- Express App ----------------
const app = express();

// ---------------- Middleware ----------------
app.use(cors());
app.use(express.json());
app.use(helmet()); // Security headers
app.use(morgan('dev')); // Logging

// Rate limiting: 100 requests per 15 minutes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// ---------------- API Routes ----------------
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/specialities', specialityRoutes);
app.use('/api/health-packages', healthPackageRoutes);
app.use('/api/sub-specialities', subSpecialityRoutes);
app.use('/api/users', userRoutes);
app.use('/api/user-roles', userRoleRoutes);
app.use('/api/doctor-slots', doctorSlotRoutes);
app.use('/api/modules', moduleRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/appointments', appointmentRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

// Schedule automatic appointment status updates
// Run every 5 minutes to check for expired appointments (less frequent to reduce noise)
// Set AUTO_UPDATE_APPOINTMENTS=false in .env to disable automatic updates

// ------This block should be inserted again

if (process.env.AUTO_UPDATE_APPOINTMENTS !== 'false') {
  setInterval(async () => {
    try {
      await updateExpiredAppointments();
    } catch (error) {
      console.error('❌ Scheduled appointment status update failed:', error);
    }
  }, 24 * 3600000); // 3600000ms = 1 hour

  console.log('🔄 Automatic appointment status updater started (runs every day)');
} else {
  console.log('⏸️  Automatic appointment status updates disabled');
}
