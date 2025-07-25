import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import MainApp from "./components/MainApp";
import Login from "./components/Login/Login";
import PrivateRoute from "./components/PrivateRoute";
import Dashboard from "./components/pages/Dashboard";
import Doctors from "./components/pages/Doctors/Doctors";
import Specialities from "./components/pages/Specialities/Specialities";
import Departments from "./components/pages/Departments";
import Technologies from "./components/pages/Technologies";
import Appointments from "./components/pages/Appointments";
import Patients from "./components/pages/Patients";
import HealthPackages from "./components/pages/HealthPackages";
import Enquiries from "./components/pages/Enquiries";
import Blog from "./components/pages/Blog";
import Cms from "./components/pages/Cms";
import RolesPermissions from "./components/pages/RolesPermissions";
import Settings from "./components/pages/Settings";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "./slices/authSlice";

function App() {
  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = "/login";
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={<Login />}
        />
        {/* <Route path="/" element={<Navigate to="/dashboard" replace />} /> */}
        <Route
          path="/"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <MainApp onLogout={handleLogout} />
            </PrivateRoute>
          }
        >
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
        </Route>
      </Routes>
      {isAuthenticated && window.location.pathname === "/login" && (
        <Navigate to="/login" replace />
      )}
    </Router>
  );
}

export default App;
