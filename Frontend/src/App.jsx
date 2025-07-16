import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import './App.css'
import MainApp from './components/MainApp'
import Login from './components/Login'
import PrivateRoute from './components/PrivateRoute'
import Dashboard from './components/Dashboard'
import Doctors from './components/Doctors'
import Specialities from './components/Specialities'
import Departments from './components/Departments'
import Technologies from './components/Technologies'
import Appointments from './components/Appointments'
import Patients from './components/Patients'
import HealthPackages from './components/HealthPackages'
import Enquiries from './components/Enquiries'
import Blog from './components/Blog'
import Cms from './components/Cms'
import RolesPermissions from './components/RolesPermissions'
import Settings from './components/Settings'
import Logout from './components/Logout'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLogin={() => setIsAuthenticated(true)} />} />
        {/* <Route path="/" element={<Navigate to="/dashboard" replace />} /> */}
        <Route path="/" element={<PrivateRoute isAuthenticated={isAuthenticated}><MainApp /></PrivateRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/specialities" element={<Specialities />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/technologies" element={<Technologies />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/health-packages" element={<HealthPackages />} />
          <Route path="/enquiries" element={<Enquiries />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/cms" element={<Cms />} />
          <Route path="/roles-permissions" element={<RolesPermissions />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/logout" element={<Logout />} />
        </Route>
      </Routes>
      {isAuthenticated && window.location.pathname === '/login' && <Navigate to="/login" replace />}
    </Router>
  )
}

export default App
