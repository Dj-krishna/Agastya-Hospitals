require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');


const authRoutes = require('./routes/authRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const patientRoutes = require('./routes/patientRoutes');
const specialityRoutes = require('./routes/specialityRoutes');
const healthPackageRoutes = require('./routes/healthPackageRoutes');
const subSpecialityRoutes = require('./routes/subSpecialityRoutes');
const userRoutes = require('./routes/userRoutes');
const userRoleRoutes = require('./routes/userRoleRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');

connectDB(); // Connect to MongoDB

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/specialities', specialityRoutes);
app.use('/api/health-packages', healthPackageRoutes);
app.use('/api/sub-specialities', subSpecialityRoutes);
app.use('/api/users', userRoutes);
app.use('/api/user-roles', userRoleRoutes);
app.use('/api/appointments', appointmentRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
