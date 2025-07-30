const Patient = () => {
  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 text-center mb-12">
          Patient Portal
        </h1>
        
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Login Form */}
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Patient Login
              </h2>
              
              <form className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">Patient ID</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-hospital-blue"
                    placeholder="Enter your Patient ID"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Password</label>
                  <input
                    type="password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-hospital-blue"
                    placeholder="Enter your password"
                  />
                </div>
                
                <button className="w-full btn-primary">
                  Login
                </button>
              </form>
              
              <div className="mt-6 text-center">
                <a href="#" className="text-hospital-blue hover:text-hospital-dark-blue">
                  Forgot Password?
                </a>
              </div>
            </div>

            {/* Registration */}
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                New Patient Registration
              </h2>
              
              <p className="text-gray-600 mb-6">
                Register as a new patient to access our online services and manage your healthcare journey.
              </p>
              
              <button className="w-full btn-secondary">
                Register Now
              </button>
              
              <div className="mt-6 space-y-4">
                <h3 className="font-semibold text-gray-900">Patient Services:</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Book appointments online</li>
                  <li>• View medical records</li>
                  <li>• Access test results</li>
                  <li>• Manage prescriptions</li>
                  <li>• Pay bills online</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Patient 