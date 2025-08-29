import { Link, useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  return (
    // <footer className="bg-hospital-dark-blue text-white">
    //   <div className="container mx-auto px-4 py-12">
    //     <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    //       {/* Specialties */}
    //       <div>
    //         <h3 className="text-xl font-semibold mb-4">Specialties</h3>
    //         <ul className="space-y-2">
    //           <li><Link to="/specialties" className="hover:text-blue-200">Heart & Vascular Management</Link></li>
    //           <li><Link to="/specialties" className="hover:text-blue-200">Cardiac Sciences</Link></li>
    //           <li><Link to="/specialties" className="hover:text-blue-200">Joint Care</Link></li>
    //           <li><Link to="/specialties" className="hover:text-blue-200">ENT</Link></li>
    //           <li><Link to="/specialties" className="hover:text-blue-200">General Surgery</Link></li>
    //           <li><Link to="/specialties" className="hover:text-blue-200">Interventional Pulmonology</Link></li>
    //           <li><Link to="/specialties" className="hover:text-blue-200">Nephrology & Urology</Link></li>
    //           <li><Link to="/specialties" className="hover:text-blue-200">Neuro Sciences</Link></li>
    //         </ul>
    //       </div>

    //       {/* Quick Links */}
    //       <div>
    //         <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
    //         <div className="grid grid-cols-2 gap-4">
    //           <div>
    //             <ul className="space-y-2">
    //               <li><Link to="/about" className="hover:text-blue-200">About Us</Link></li>
    //               <li><Link to="/patient" className="hover:text-blue-200">Patient Care</Link></li>
    //               <li><Link to="/blog" className="hover:text-blue-200">News & Updates</Link></li>
    //               <li><Link to="/blog" className="hover:text-blue-200">Blogs</Link></li>
    //             </ul>
    //           </div>
    //           <div>
    //             <ul className="space-y-2">
    //               <li><Link to="/contact" className="hover:text-blue-200">Contact Us</Link></li>
    //               <li><Link to="/privacy" className="hover:text-blue-200">Privacy Policy</Link></li>
    //               <li><Link to="/terms" className="hover:text-blue-200">Terms & Conditions</Link></li>
    //             </ul>
    //           </div>
    //         </div>
    //       </div>

    //       {/* Contact Info */}
    //       <div>
    //         <h3 className="text-xl font-semibold mb-4">Contact Info</h3>
    //         <div className="space-y-4">
    //           <div>
    //             <p className="text-blue-200">Email:</p>
    //             <p>agastyahospitals@gmail.com</p>
    //           </div>
    //           <div>
    //             <p className="text-blue-200">Phone:</p>
    //             <p>+91 9492 88 1134</p>
    //           </div>
    //           <div className="bg-green-600 text-white p-3 rounded-lg">
    //             <p className="font-semibold">24x7 Appointment Helpline</p>
    //             <div className="flex items-center mt-2">
    //               <span className="mr-2">📞</span>
    //               <span>+91 9492 88 1134</span>
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>

    //   {/* Copyright */}
    //   <div className="border-t border-blue-700 py-4">
    //     <div className="container mx-auto px-4 text-center text-blue-200">
    //       <p>&copy; 2024 Agastya Hospitals. All rights reserved.</p>
    //     </div>
    //   </div>
    // </footer>

    <footer>
      <div className="footer-main container">
        <div className="row">
          <div className="col-lg-3 col-md-6 col-sm-12">
            <div className="widget">
              <h3>Specialities</h3>
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
                <li>
                  <a href="#" onClick={() => navigate("/about")}>
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" onClick={() => navigate("/patient-care")}>
                    Patient Care
                  </a>
                </li>
                <li>
                  <a href="#" onClick={() => navigate("/news-and-updates")}>
                    News & Updates
                  </a>
                </li>
                <li>
                  <a href="#" onClick={() => navigate("/careers")}>
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" onClick={() => navigate("/blog")}>
                    Blogs
                  </a>
                </li>
                <li>
                  <a href="#" onClick={() => navigate("/contact-us")}>
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" onClick={() => navigate("/privacy-policy")}>
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" onClick={() => navigate("/terms-and-conditions")}>
                    Terms & Conditions
                  </a>
                </li>
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
