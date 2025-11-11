import ContactUs from "./components/FooterPages/ContactUs";
import NewsAndUpdates from "./components/FooterPages/NewsAndUpdates";
import PatientCare from "./components/FooterPages/PatientCare";
import PrivacyPolicy from "./components/FooterPages/PrivacyPolicy";
import TermsAndConditions from "./components/FooterPages/TermsAndConditions";
import BookAppointment from "./components/pages/BookAppointment";
import DoctorProfile from "./components/pages/DoctorProfile";
import About from "./pages/About";
import Achievements from "./pages/Achievements";
import AwardsAndRecongnition from "./pages/AwardsAndRecongnition";
import Blog from "./pages/Blog";
import BlogDetails from "./pages/BlogDetails";
import Careers from "./pages/Careers";
import FindDoctor from "./pages/FindDoctor";
import FreeSecondOpinionForm from "./pages/FreeSecondOpinionForm";
import Gallery from "./pages/Gallery";
import HealthPackages from "./pages/HealthPackages";
import Home from "./pages/Home";
import InternationalPatient from "./pages/InternationalPatient";
import Leadership from "./pages/Leadership";
import MedicalReports from "./pages/MedicalReports";
import Patient from "./pages/Patient";
import Specialties from "./pages/Specialties";
import SpecialtyDetails from "./pages/SpecialtyDetails";

export const routes = [
  { path: "/", component: Home },
  { path: "/about", component: About },
  { path: "/specialties", component: Specialties },
  { path: "/find-doctor", component: FindDoctor },
  { path: "/patient", component: Patient },
  { path: "/blog", component: Blog },
  { path: "/health-packages", component: HealthPackages },
  { path: "/careers", component: Careers },
  { path: "/book-appointment", component: BookAppointment },
  { path: "/patient-care", component: PatientCare },
  { path: "/news-and-updates", component: NewsAndUpdates },
  { path: "/contact-us", component: ContactUs },
  { path: "/privacy-policy", component: PrivacyPolicy },
  { path: "/terms-and-conditions", component: TermsAndConditions },
  { path: "/free-second-opinion", component: FreeSecondOpinionForm },
  { path: "/medical-reports", component: MedicalReports },
  { path: "/:id", component: DoctorProfile },
  { path: "/leadership-team", component: Leadership },
  { path: "/achievements", component: Achievements },
  { path: "/awards-recognition", component: AwardsAndRecongnition },
  { path: "/international-patient", component: InternationalPatient },
  { path: "/blog-details", component: BlogDetails },
  { path: "/:id", component: SpecialtyDetails },
  { path: "/gallery", component: Gallery },
];
