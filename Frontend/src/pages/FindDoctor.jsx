const FindDoctor = () => {
  const doctors = [
    {
      name: "Dr. Walther White",
      specialty: "Cardiology",
      title: "Head of Cardiology Department",
      affiliation: "University of Florida",
      image: "👨‍⚕️",
      available: true
    },
    {
      name: "Dr. Elizabeth",
      specialty: "Cardiology",
      title: "Senior Cardiologist",
      affiliation: "University of Colorado",
      image: "👩‍⚕️",
      available: true
    },
    {
      name: "Dr. Michael Chen",
      specialty: "Neurology",
      title: "Interventional Neurologist",
      affiliation: "Johns Hopkins University",
      image: "👨‍⚕️",
      available: false
    },
    {
      name: "Dr. Sarah Johnson",
      specialty: "Orthopedics",
      title: "Joint Replacement Specialist",
      affiliation: "Harvard Medical School",
      image: "👩‍⚕️",
      available: true
    }
  ]

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 text-center mb-12">
          Find a Doctor
        </h1>
        
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {doctors.map((doctor, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-lg border border-gray-200"
              >
                <div className="text-center mb-6">
                  <div className="w-24 h-24 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-4xl">{doctor.image}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {doctor.name}
                  </h3>
                  <p className="text-hospital-blue font-medium mb-1">
                    {doctor.specialty}
                  </p>
                  <p className="text-gray-600 text-sm mb-2">
                    {doctor.title}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {doctor.affiliation}
                  </p>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-sm font-medium ${
                    doctor.available ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {doctor.available ? 'Available' : 'Not Available'}
                  </span>
                </div>
                
                <button 
                  className={`w-full py-2 px-4 rounded-md font-medium ${
                    doctor.available 
                      ? 'bg-hospital-blue text-white hover:bg-hospital-dark-blue' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  } transition-colors duration-200`}
                  disabled={!doctor.available}
                >
                  {doctor.available ? 'Book Appointment' : 'Not Available'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FindDoctor 