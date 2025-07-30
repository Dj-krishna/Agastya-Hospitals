import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-hospital-dark-blue text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Specialties */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Specialties</h3>
            <ul className="space-y-2">
              <li><Link to="/specialties" className="hover:text-blue-200">Heart & Vascular Management</Link></li>
              <li><Link to="/specialties" className="hover:text-blue-200">Cardiac Sciences</Link></li>
              <li><Link to="/specialties" className="hover:text-blue-200">Joint Care</Link></li>
              <li><Link to="/specialties" className="hover:text-blue-200">ENT</Link></li>
              <li><Link to="/specialties" className="hover:text-blue-200">General Surgery</Link></li>
              <li><Link to="/specialties" className="hover:text-blue-200">Interventional Pulmonology</Link></li>
              <li><Link to="/specialties" className="hover:text-blue-200">Nephrology & Urology</Link></li>
              <li><Link to="/specialties" className="hover:text-blue-200">Neuro Sciences</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <ul className="space-y-2">
                  <li><Link to="/about" className="hover:text-blue-200">About Us</Link></li>
                  <li><Link to="/patient" className="hover:text-blue-200">Patient Care</Link></li>
                  <li><Link to="/blog" className="hover:text-blue-200">News & Updates</Link></li>
                  <li><Link to="/blog" className="hover:text-blue-200">Blogs</Link></li>
                </ul>
              </div>
              <div>
                <ul className="space-y-2">
                  <li><Link to="/contact" className="hover:text-blue-200">Contact Us</Link></li>
                  <li><Link to="/privacy" className="hover:text-blue-200">Privacy Policy</Link></li>
                  <li><Link to="/terms" className="hover:text-blue-200">Terms & Conditions</Link></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Contact Info</h3>
            <div className="space-y-4">
              <div>
                <p className="text-blue-200">Email:</p>
                <p>agastyahospitals@gmail.com</p>
              </div>
              <div>
                <p className="text-blue-200">Phone:</p>
                <p>+91 9492 88 1134</p>
              </div>
              <div className="bg-green-600 text-white p-3 rounded-lg">
                <p className="font-semibold">24x7 Appointment Helpline</p>
                <div className="flex items-center mt-2">
                  <span className="mr-2">📞</span>
                  <span>+91 9492 88 1134</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Copyright */}
      <div className="border-t border-blue-700 py-4">
        <div className="container mx-auto px-4 text-center text-blue-200">
          <p>&copy; 2024 Agastya Hospitals. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer 