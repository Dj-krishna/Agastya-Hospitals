const express = require('express');  
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/Agastya')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const Doctor = require('./models/Doctors');
const Patient = require('./models/Patients');
const HealthPackage = require('./models/HealthPackages');
const UserRole = require('./models/UserRoles');
const UserDetail = require('./models/UserDetails');
const Speciality = require('./models/Specialities');
const SubSpeciality = require('./models/SubSpecialities');

// API: Get all doctors
app.get('/api/doctors', async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API: Get all patients
app.get('/api/patients', async (req, res) => {
  try {
    const patients = await Patient.find();
    res.json(patients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API: Get all health packages
app.get('/api/health-packages', async (req, res) => {
  try {
    const packages = await HealthPackage.find();
    res.json(packages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API: Get all user roles
app.get('/api/user-roles', async (req, res) => {
  try {
    const roles = await UserRole.find();
    res.json(roles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API: Get all user details
app.get('/api/user-details', async (req, res) => {
  try {
    const details = await UserDetail.find();
    res.json(details);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API: Get all Specialities
app.get('/api/specialities', async (req, res) => {
  try {
    const specialities = await Speciality.find();
    res.json(specialities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API: Get all Sub-Specialities
app.get('/api/sub-specialities', async (req, res) => {
  try {
    const subspecialities = await SubSpeciality.find();
    res.json(subspecialities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API: Get all user details and roles
app.get('/api/user-fullinfo', async (req, res) => {
  try {
    const info = await UserDetail.aggregate([
      {
        $lookup: {
          from: 'userRoles', 
          localField: 'roleID',
          foreignField: 'roleID',
          as: 'roleInfo'
        }
      },
      {
        $unwind: '$roleInfo' // Flatten the array
      },
      {
        $project: {
          userID: 1,
          userName: 1,
          email: 1,
          password: 1,
          mobile: 1,
          isActive: 1,
          roleID: 1,
          roleName: '$roleInfo.roleName'  // Add roleName from joined data
        }
      }
    ]);

    res.json(info);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ Single, final listen call
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
