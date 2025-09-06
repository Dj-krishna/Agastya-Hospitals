import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Specialties from "./pages/Specialties";
import FindDoctor from "./pages/FindDoctor";
import Patient from "./pages/Patient";
import Blog from "./pages/Blog";
import HealthPackages from "./pages/HealthPackages";
import Careers from "./pages/Careers";
import BookAppointment from "./components/pages/BookAppointment";
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

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/specialties" element={<Specialties />} />
          <Route path="/find-doctor" element={<FindDoctor />} />
          <Route path="/patient" element={<Patient />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/health-packages" element={<HealthPackages />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/book-appointment" element={<BookAppointment />} />
          <Route path="/patient-care" element={<PatientCare />} />
          <Route path="/news-and-updates" element={<NewsAndUpdates />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route
            path="/terms-and-conditions"
            element={<TermsAndConditions />}
          />
          <Route
            path="/free-second-opinion"
            element={<FreeSecondOpinionForm />}
          />
          <Route path="/medical-reports" element={<MedicalReports />} />
        </Routes>
      </main>
      <Footer />
      <ToastContainer autoClose={3000} theme="colored" />
    </div>
  );
}

export default App;
