import { Link, useNavigate, useLocation } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Navigation items
  const navItems = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About Us" },
    { path: "/specialties", label: "Specialties" },
    { path: "/find-doctor", label: "Find a Doctor" },
    { path: "/patient", label: "Patient" },
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
  ];

  const allNavItems = [...navItems, ...nonHeaderPaths];

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
        className={`container mx-auto px-2 pt-4 pb-0 main-navigation ${
          currentPage && currentPage !== "Home" ? "banner" : ""
        }`}
      >
        <div className="d-flex justify-between items-center position-relative z-3">
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
              <li key={path}>
                <Link
                  to={path}
                  className={`hover:text-blue-600 ${
                    pathname === path ? "font-semibold text-blue-700" : ""
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Banner & Breadcrumb */}
        {currentPage && currentPage !== "Home" && (
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
        )}
      </nav>
    </header>
  );
};

export default Header;
