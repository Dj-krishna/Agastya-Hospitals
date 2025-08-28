const DoctorsSection = () => {
  const specialties = [
    "Heart Center",
    "Cardiac Sciences", 
    "Joint Care",
    "General Surgery",
    "Vascular Surgery",
    "Critical Care",
    "ENT"
  ]

  const doctors = [
    {
      id: 1,
      name: "Dr. Walther White",
      title: "Head of Cardiology Department",
      affiliation: "University of Florida",
      image: "👨‍⚕️"
    },
    {
      id: 2,
      name: "Dr. Elizabeth",
      title: "Senior Cardiologist",
      affiliation: "University of Colorado",
      image: "👩‍⚕️"
    },
    {
      id: 3,
      name: "Dr. Michael Chen",
      title: "Interventional Cardiologist",
      affiliation: "Johns Hopkins University",
      image: "👨‍⚕️"
    }
  ]

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="row">
          <div className="col-lg-12 text-center mb-12">
            <h2 className="main-title-center">Our Expert Doctors For The Patients</h2>
          </div>
        </div>

        {/* Specialty Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {specialties.map((specialty, index) => (
            <button
              key={specialty}
              className={`specialty-tabpill ${
                index === 0
                  ? 'active'
                  : 'specialty-tabpill'
              }`}
            >
              {specialty}
            </button>
          ))}
        </div>

        {/* Doctors Carousel */}
        <div className="relative mt-12">
          {/* Navigation Arrows */}
          <button className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow z-10">
            <span className="text-2xl">←</span>
          </button>
          <button className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow z-10">
            <span className="text-2xl">→</span>
          </button>

          {/* Doctors Grid */}
          <div className="flex gap-8 overflow-x-auto pb-4">
            {doctors.map((doctor) => (
              <div
                key={doctor.id}
                className="flex-shrink-0 w-80 bg-white p-6 rounded-lg shadow-lg border border-gray-200"
              >
                <div className="text-center mb-6">
                  <div className="w-24 h-24 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-4xl">{doctor.image}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {doctor.name}
                  </h3>
                  <p className="text-gray-600 mb-2">{doctor.title}</p>
                  <p className="text-sm text-gray-500">{doctor.affiliation}</p>
                </div>
                <div className="text-center">
                  <button className="btn-primary w-full">
                    Book Appointment
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default DoctorsSection 