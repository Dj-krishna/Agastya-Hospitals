import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
// import Home from "./pages/Home";
// import About from "./pages/About";
// import Specialties from "./components/Specialties/Specialties";
// import FindDoctor from "./components/Doctors/FindDoctor";
// import Patient from "./pages/Patient";
// import Blog from "./pages/Blog";
// import HealthPackages from "./components/HealthPackages/HealthPackages";
// import Careers from "./pages/Careers";
// import BookAppointment from "./components/pages/BookAppointment";
import "./App.css";
import PatientCare from "./components/FooterPages/PatientCare";
import NewsAndUpdates from "./components/FooterPages/NewsAndUpdates";
import ContactUs from "./components/FooterPages/ContactUs";
import PrivacyPolicy from "./components/FooterPages/PrivacyPolicy";
import TermsAndConditions from "./components/FooterPages/TermsAndConditions";
import FreeSecondOpinionForm from "./pages/FreeSecondOpinionForm";
import MedicalReports from "./pages/MedicalReports";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DoctorProfile from "./components/pages/DoctorProfile";
import Leadership from "./pages/Leadership";
import Achievements from "./pages/Achievements";
import AwardsAndRecongnition from "./pages/AwardsAndRecongnition";
import Gallery from "./pages/Gallery";
import InternationalPatient from "./pages/InternationalPatient";
import { routes } from "./AppRoutes";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Routes>
          {routes.map(({ path, component: Component }, i) => (
            <Route key={path} path={path} element={<Component />} />
          ))}
        </Routes>
      </main>
      <Footer />
      <ToastContainer autoClose={3000} theme="colored" />
    </div>
  );
}

export default App;
