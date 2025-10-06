import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { setBreadcrumb } from "../slices/breadcrumbSlice";
import { fetchSpecialties } from "../slices/specialtySlice";
import { useEffect } from "react";
import SideMenu from "./common/SideMenu";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { specialties, loading: isLoading } = useSelector(
    (state) => state.specialties
  );

  useEffect(() => {
    dispatch(fetchSpecialties());
  }, [dispatch]);

  const sortedData = Array.isArray(specialties?.data)
    ? [...specialties?.data].map((item) => {
        return {
          path: item.specialityName.toLowerCase().replace(" ", "-"),
          label: item.specialityName,
          id: item.specialityID,
        };
      })
    : [];
  const { pathname } = useLocation();
  console.log("PATHNAME::: ", pathname);

  const trail = useSelector((state) => state.breadcrumb.trail) || [];

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

  const specialtiesDropdown = sortedData.length > 0 ? sortedData : [];
  const dropdownItems = {
    "About Us": aboutDropdown,
    Specialties: specialtiesDropdown,
  };

  const allNavItems = [
    ...navItems,
    ...nonHeaderPaths,
    ...aboutDropdown,
    ...sortedData,
  ];

  // Derive page title from pathname
  const currentPage =
    allNavItems.find((item) => item.path === pathname)?.label || "";

  useEffect(() => {
    // Reset breadcrumb to Home if on root, or set based on pathname
    if (pathname === "/") {
      dispatch(setBreadcrumb(["Home"]));
    } else {
      // Find label for current path
      const allNavItems = [
        ...navItems,
        ...nonHeaderPaths,
        ...aboutDropdown,
        ...sortedData,
      ];
      const current = allNavItems.find(
        (item) => item.path === location.pathname
      );
      if (current) {
        dispatch(setBreadcrumb(["Home", current.label]));
      }
    }
  }, [pathname]);

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
            <Link
              // to="/patient"
              className="patientlogin"
              // onClick={() => {
              //   dispatch(setBreadcrumb(["Home", "Patient Login"]));
              //   window.scrollTo({ top: 0, behavior: "smooth" });
              // }}
              to="#"
              onClick={(e) => {
                e.preventDefault();
                dispatch(setBreadcrumb(["Home"]));
                window.scrollTo({ top: 0, behavior: "smooth" });
                window.open(
                  "https://agastya-hospitals-adminpage.onrender.com",
                  "_blank"
                );
              }}
            >
              <img src="https://res.cloudinary.com/sdk28cdn/image/upload/v1758392814/agastya/patient-login.svg" />
              Patient Login
            </Link>
            <button
              className="bookappointment d-flex items-center space-x-1"
              onClick={() => {
                dispatch(setBreadcrumb(["Home", "Book Appointment"]));
                window.scrollTo({ top: 0, behavior: "smooth" });
                navigate("/book-appointment");
              }}
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
          // currentPage && currentPage !== "Home"
          trail.some((nav) => nav !== "Home") ? "banner" : ""
        }`}
      >
        <div className="container d-flex justify-between items-center position-relative z-3">
          {/* Logo */}
          <div className="d-flex items-center">
            <Link
              to="/"
              className="text-2xl font-bold text-hospital-blue"
              onClick={() => {
                dispatch(setBreadcrumb(["Home"]));
              }}
            >
              <img
                src="https://res.cloudinary.com/sdk28cdn/image/upload/v1756301086/agastya/agastyahospitals-logo.svg"
                alt="Agastya Hospitals"
              />
            </Link>
          </div>
          <SideMenu
            navItems={navItems}
            dropdownItems={dropdownItems}
            pathname={pathname}
          />

          {/* Navigation Links */}
          <div className="side_menu_responsive_desktop">
            <ul className="d-flex items-center space-x-8">
              {navItems.map(({ path, label }) => (
                <li
                  key={path}
                  className={`nav-item position-relative ${
                    label === "About Us" || label === "Specialties"
                      ? "dropdown"
                      : ""
                  }`}
                >
                  <Link
                    to={path}
                    className={`hover:text-blue-600 inline-flex align-items-center ${
                      pathname === path ? "font-semibold text-blue-700" : ""
                    }`}
                    onClick={() => {
                      dispatch(setBreadcrumb(["Home", label]));
                    }}
                  >
                    <span>{label}</span>
                    {(label === "About Us" || label === "Specialties") && (
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
                      {dropdownItems[label].map((item) => (
                        <li key={item.path}>
                          <Link
                            to={item.path}
                            className="dropdown-item"
                            onClick={() => {
                              dispatch(
                                setBreadcrumb(["Home", "About Us", item.label])
                              );
                            }}
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                  {label === "Specialties" && (
                    <div className="row m-0 specialties-list dropdown-menu shadow">
                      {dropdownItems[label].map((item) => (
                        <div
                          className="col-lg-4 col-md-4 col-sm-6 col-xs-12"
                          key={item.path}
                        >
                          <Link
                            to={`/${item.id}`}
                            state={{ specialityID: item.id }}
                            className="dropdown-item"
                            onClick={() => {
                              // navigate(`/${item.id}`),
                              //   {
                              //     state: {
                              //       specialityID: item.id,
                              //     },
                              //   };
                              dispatch(setBreadcrumb(["Home", item.label]));
                            }}
                          >
                            {item.label}
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Banner & Breadcrumb */}
        {currentPage !== "Home" && (
          <div className="container">
            <div className="row">
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center">
                <h2 className="banner-title mt-5">{currentPage}</h2>
              </div>
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                <div className="breadcrumb">
                  {Array.isArray(trail) &&
                    trail.map((crumb, index) => (
                      <span key={index} className="flex items-center gap-2">
                        {index < trail.length - 1 ? (
                          <Link
                            to="/"
                            onClick={() => dispatch(setBreadcrumb(["Home"]))}
                          >
                            {crumb}
                          </Link>
                        ) : (
                          <span className="f-w-600">{crumb}</span>
                        )}
                        {index < trail.length - 1 && <span>/</span>}
                      </span>
                    ))}
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
