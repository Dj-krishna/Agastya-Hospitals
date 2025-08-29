import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-sm">
      {/* Top Bar */}
      <div className="py-2">
        <div className="container flex justify-between items-center top-infonavigation">
          <div className="flex items-center space-x-4">
            <span className="appointment-details">
              <span>24x7 Appointment Helpline - </span> 040 65 108 108, &nbsp;
              +91 9459 108 108
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/patient" className="patientlogin">
              Patient Login
            </Link>
            <button
              className="bookappointment"
              onClick={() => navigate("/book-appointment")}
            >
              <i class="lni lni-calendar-days icon"></i> Book Appointment
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="container mx-auto px-2 py-4 main-navigation">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <div className="text-2xl font-bold text-hospital-blue">
              <img
                src={
                  "https://res.cloudinary.com/sdk28cdn/image/upload/v1756301086/agastya/agastyahospitals-logo.svg"
                }
                alt="Agastya Hospitals"
              />
            </div>
          </div>
          {/* Left Navigation */}
          <div className="flex items-center space-x-8">
            <Link to="/">Home</Link>
            <Link to="/about">About Us</Link>
            <Link to="/specialties">Specialties</Link>
            <Link to="/find-doctor">Find a Doctor</Link>
            {/* </div> */}

            {/* Right Navigation */}
            {/* <div className="flex items-center space-x-8"> */}
            <Link to="/patient">Patient</Link>
            <Link to="/blog">Blog</Link>
            <Link to="/health-packages">Health Packages</Link>
            <Link to="/careers">Careers</Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
