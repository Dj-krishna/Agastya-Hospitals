const OutstandingCareSection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              We're known for outstanding Care
            </h2>
            
            {/* Surgeons Image */}
            <div className="mb-8">
              <div className="w-64 h-64 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full mx-auto lg:mx-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl">👨‍⚕️👩‍⚕️</span>
                  </div>
                  <p className="text-gray-600 text-sm">Surgeons in operation</p>
                </div>
              </div>
            </div>

            <p className="text-gray-600 mb-6 leading-relaxed">
              Located in the heart of Hyderabad, Agastya Hospitals has established itself as a premier healthcare institution, 
              known for its commitment to excellence and patient-centered care. Our state-of-the-art facilities and 
              experienced medical professionals ensure the highest quality of healthcare services.
            </p>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <span className="text-green-500 mr-3 mt-1">✓</span>
                <span className="text-gray-700">Highly qualified team of doctors and specialists</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3 mt-1">✓</span>
                <span className="text-gray-700">State-of-the-art facilities and cutting-edge technology</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3 mt-1">✓</span>
                <span className="text-gray-700">Commitment to affordable and accessible for all</span>
              </li>
            </ul>

            <div className="flex flex-wrap gap-4 mb-8">
              <button className="btn-primary flex items-center">
                <span className="mr-2">▶</span>
                Watch Video
              </button>
              <button className="btn-secondary flex items-center">
                <span className="mr-2">📍</span>
                Locate Us
              </button>
            </div>

            {/* Accreditation */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Accreditation & Recognition</h3>
              <div className="flex space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 text-sm">NABH</span>
                </div>
                <div className="w-16 h-16 bg-yellow-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 text-sm">NABL</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Statistics */}
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="grid grid-cols-2 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-hospital-blue mb-2">10,000+</div>
                <div className="text-gray-600">Happy Patients</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-hospital-blue mb-2">400+</div>
                <div className="text-gray-600">Surgeries Performed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-hospital-blue mb-2">15+</div>
                <div className="text-gray-600">Specialties</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-hospital-blue mb-2">50+</div>
                <div className="text-gray-600">Strong Clinical Team</div>
              </div>
            </div>
            
            {/* Separator lines */}
            <div className="hidden md:block">
              <div className="absolute top-1/2 left-0 w-full h-px bg-gray-300 transform -translate-y-1/2"></div>
              <div className="absolute top-0 left-1/2 w-px h-full bg-gray-300 transform -translate-x-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default OutstandingCareSection 