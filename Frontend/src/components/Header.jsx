import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <header className="bg-white shadow-sm">
      {/* Top Bar */}
      <div className="bg-gray-100 py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">24x7 Appointment Helpline: +91 9492 88 1134</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/patient" className="text-hospital-blue hover:text-hospital-dark-blue">
              Patient Login
            </Link>
            <button className="btn-red text-sm">
              Book Appointment
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Left Navigation */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-hospital-blue">Home</Link>
            <Link to="/about" className="text-gray-700 hover:text-hospital-blue">About Us</Link>
            <Link to="/specialties" className="text-gray-700 hover:text-hospital-blue">Specialties</Link>
            <Link to="/find-doctor" className="text-gray-700 hover:text-hospital-blue">Find a Doctor</Link>
          </div>

          {/* Logo */}
          <div className="flex items-center">
            <div className="text-2xl font-bold text-hospital-blue">
              <span className="text-hospital-red">●</span> AGASTYA -HOSPITALS-
            </div>
          </div>

          {/* Right Navigation */}
          <div className="flex items-center space-x-8">
            <Link to="/patient" className="text-gray-700 hover:text-hospital-blue">Patient</Link>
            <Link to="/blog" className="text-gray-700 hover:text-hospital-blue">Blog</Link>
            <Link to="/health-packages" className="text-gray-700 hover:text-hospital-blue">Health Packages</Link>
            <Link to="/careers" className="text-gray-700 hover:text-hospital-blue">Careers</Link>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header 