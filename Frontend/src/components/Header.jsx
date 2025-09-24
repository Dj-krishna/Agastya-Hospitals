import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const Header = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Navigation items
  const navItems = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About Us" },
    { path: "/specialties", label: "Specialties" },
    { path: "/find-doctor", label: "Find a Doctor" },
    { path: "/international-patient", label: "Patient" },
    { path: "/blog", label: "Blog" },
    { path: "/health-packages", label: "Health Packages" },
    { path: "/careers", label: "Careers" },
  ];

  const nonHeaderPaths = [
    { path: "/book-appointment", label: "Book Appointment" },
    { path: "/patient-care", label: "Patient Care" },
    { path: "/news-and-updates", label: "News & Updates" },
    { path: "/contact-us", label: "Contact Us" },
    { path: "/privacy-policy", label: "Privacy Policy" },
    { path: "/terms-and-conditions", label: "Terms & Conditions" },
    { path: "/free-second-opinion", label: "Free Second Opinion" },
    { path: "/medical-reports", label: "Medical Reports" },
    { path: "/doctor/profile", label: "Doctor Profile" },
    { path: "/leadership-team", label: "Leadership Team" },
    { path: "/achievements", label: "Achievements" },
    { path: "/awards-recognition", label: "Awards & Recognition" },
    { path: "/gallery", label: "Gallery" },
    { path: "/blog-details", label: "Blog Details" },
  ];

  const aboutDropdown = [
    { path: "/leadership-team", label: "Leadership Team" },
    { path: "/achievements", label: "Achievements" },
    { path: "/awards-recognition", label: "Awards & Recognition" },
    { path: "/gallery", label: "Gallery" },
  ];

  const allNavItems = [...navItems, ...nonHeaderPaths, ...aboutDropdown];

  // Derive page title from pathname
  const currentPage =
    allNavItems.find((item) => item.path === pathname)?.label || "";

  return (
    <header className="bg-white shadow-sm">
      {/* Top Bar */}
      <div className="py-2">
        <div className="container d-flex justify-between items-center top-infonavigation">
          <div className="d-flex items-center space-x-4">
            <span className="appointment-details">
              <span>24x7 Appointment Helpline - </span>
              040 65 108 108, &nbsp;+91 9459 108 108
            </span>
          </div>
          <div className="d-flex items-center space-x-4">
            <Link to="/patient" className="patientlogin">
              <img src="https://res.cloudinary.com/sdk28cdn/image/upload/v1758392814/agastya/patient-login.svg" />
              Patient Login
            </Link>
            <button
              className="bookappointment d-flex items-center space-x-1"
              onClick={() => navigate("/book-appointment")}
            >
              <i className="lni lni-calendar-days icon"></i>
              <span>Book Appointment</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav
        className={`container-fluid mx-auto px-2 pt-4 pb-0 main-navigation ${
          currentPage && currentPage !== "Home" ? "banner" : ""
        }`}
      >
        <div className="container d-flex justify-between items-center position-relative z-3">
          {/* Logo */}
          <div className="d-flex items-center">
            <Link to="/" className="text-2xl font-bold text-hospital-blue">
              <img
                src="https://res.cloudinary.com/sdk28cdn/image/upload/v1756301086/agastya/agastyahospitals-logo.svg"
                alt="Agastya Hospitals"
              />
            </Link>
          </div>

          {/* Navigation Links */}
          <ul className="d-flex items-center space-x-8">
            {navItems.map(({ path, label }) => (
              <li
                key={path}
                className={`nav-item position-relative ${
                  label === "About Us" ? "dropdown" : ""
                }`}
              >
                <Link
                  to={path}
                  className={`hover:text-blue-600 inline-flex align-items-center ${
                    pathname === path ? "font-semibold text-blue-700" : ""
                  }`}
                >
                  <span>{label}</span>
                  {label === "About Us" && (
                    <>
                      &nbsp;&nbsp;
                      <span>
                        <FaChevronDown className="text-muted" />
                      </span>
                    </>
                  )}
                </Link>
                {label === "About Us" && (
                  <ul className="dropdown-menu shadow">
                    {aboutDropdown.map((item) => (
                      <li key={item.path}>
                        <Link to={item.path} className="dropdown-item">
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Banner & Breadcrumb */}
        {currentPage && currentPage !== "Home" && (
          <div className="container">
            <div className="row">
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center">
                <h2 className="banner-title mt-5">{currentPage}</h2>
              </div>
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                <div className="breadcrumb">
                  <Link to="/">Home</Link> <span>/</span>
                  <span style={{ color: "#000000" }}>{currentPage}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
