import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchSpecialties } from "../slices/specialtySlice";
import { setBreadcrumb } from "../slices/breadcrumbSlice";

const quickLinks = [
  { label: "About Us", path: "/about" },
  { label: "Patient Care", path: "/patient-care" },
  { label: "News & Updates", path: "/news-and-updates" },
  { label: "Careers", path: "/careers" },
  { label: "Blogs", path: "/blog" },
  { label: "Contact Us", path: "/contact-us" },
  { label: "Privacy Policy", path: "/privacy-policy" },
  { label: "Terms & Conditions", path: "/terms-and-conditions" },
];

const Footer = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleNavigation = (path, label) => {
    dispatch(setBreadcrumb(["Home", label]));
    navigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" }); // scroll smoothly to top
  };
  useEffect(() => {
    dispatch(fetchSpecialties());
  }, [dispatch]);

  return (
    <footer>
      <div className="footer-main container">
        <div className="row">
          <div className="col-lg-3 col-md-6 col-sm-12">
            <div className="widget">
              <h3>Specialities</h3>
              {/* <ul>
                {specialties.data?.map((specialty) => (
                  <li key={specialty._id}>
                    <a
                      onClick={() =>
                        handleNavigation(`/specialties`)
                      }
                    >
                      {specialty.specialityName}
                    </a>
                  </li>
                ))}
              </ul> */}
              <ul>
                <li>
                  <a href="#">Anaesthesia & Pain Management</a>
                </li>
                <li>
                  <a href="#">Cardiac Sciences</a>
                </li>
                <li>
                  <a href="#">Critical care Team</a>
                </li>
                <li>
                  <a href="#">E.N.T</a>
                </li>
                <li>
                  <a href="#">General Medicine</a>
                </li>
                <li>
                  <a href="#">General Surgery</a>
                </li>
                <li>
                  <a href="#">Interventional Pulmonology</a>
                </li>
                <li>
                  <a href="#">Nephrology & Urology</a>
                </li>
                <li>
                  <a href="#">Neuro Sciences</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="col-lg-3 col-md-6 col-sm-12">
            <div className="widget">
              <h3>Quick Links</h3>
              <ul>
                {quickLinks.map((link) => (
                  <li key={link.path}>
                    <a
                      onClick={() => handleNavigation(link.path, link.label)}
                      style={{ cursor: "pointer" }}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="col-lg-3 col-md-6 col-sm-12">
            <div className="widget">
              <h3>Quick Links</h3>
              <ul>
                <li>
                  <a href="#">About Us</a>
                </li>
                <li>
                  <a href="#">International Patient</a>
                </li>
                <li>
                  <a href="#">Gallery</a>
                </li>
                <li>
                  <a href="#">Careers</a>
                </li>
                <li>
                  <a href="#">Blogs</a>
                </li>
                <li>
                  <a href="#">Contact Us</a>
                </li>
                <li>
                  <a href="#">Privacy Policy</a>
                </li>
                <li>
                  <a href="#">Terms & Conditions</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="col-lg-3 col-md-6 col-sm-12">
            <div className="widget">
              <h3>Contact Info</h3>
              <p>agastyahospitals@gmail.com</p>
              <p>+91 9876543210</p>
              <h5 className="mt-5">24×7 Appointment Helpline</h5>
              <div className="helpline">
                <span className="dot"></span> +91 40 65 108 108
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-copy">
        Copyright © 2025 Agastya Hospitals. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
