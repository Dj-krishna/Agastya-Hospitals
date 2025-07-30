const HeroSection = () => {
  return (
    <section className="bg-gradient-to-r from-blue-50 to-white py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h1 className="text-5xl font-bold text-gray-900 mb-8 leading-tight">
              Transforming lives, Restoring your health
            </h1>
            <div className="flex flex-wrap gap-4">
              <button className="btn-primary">Book a Doctor</button>
              <button className="btn-primary">Consultation</button>
              <button className="btn-primary">View All</button>
              <button className="btn-primary">Get a Quote</button>
            </div>
          </div>

          {/* Right Content - Doctor Image */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <div className="w-80 h-96 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-4xl">👨‍⚕️</span>
                  </div>
                  <p className="text-gray-600">Doctor with stethoscope</p>
                  <p className="text-sm text-gray-500 mt-2">Professional healthcare provider</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection 