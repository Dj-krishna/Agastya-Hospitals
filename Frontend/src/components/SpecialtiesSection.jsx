const SpecialtiesSection = () => {
  const specialties = [
    {
      id: 1,
      name: "General Medicine",
      description: "Comprehensive medical care for all ages",
      icon: "🏥",
      active: false
    },
    {
      id: 2,
      name: "Interventional Pulmonology",
      description: "Advanced respiratory care and procedures",
      icon: "🫁",
      active: true
    },
    {
      id: 3,
      name: "Nephrology & Urology",
      description: "Kidney and urinary system specialists",
      icon: "🫘",
      active: false
    },
    {
      id: 4,
      name: "Cardiology",
      description: "Heart and cardiovascular health",
      icon: "❤️",
      active: false
    },
    {
      id: 5,
      name: "Neurology",
      description: "Brain and nervous system care",
      icon: "🧠",
      active: false
    },
    {
      id: 6,
      name: "Orthopedics",
      description: "Bone and joint specialists",
      icon: "🦴",
      active: false
    }
  ]

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <span className="text-2xl mr-2">→</span>
            <h2 className="text-3xl font-bold text-gray-900">Our Specialties</h2>
          </div>
          <a href="/specialties" className="text-hospital-blue hover:text-hospital-dark-blue font-medium">
            View All Specialties
          </a>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-4">
          {specialties.map((specialty) => (
            <div
              key={specialty.id}
              className={`flex-shrink-0 w-64 p-6 rounded-lg border-2 transition-all duration-200 ${
                specialty.active
                  ? 'bg-hospital-blue text-white border-hospital-blue'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-hospital-blue'
              }`}
            >
              <div className="text-4xl mb-4">{specialty.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{specialty.name}</h3>
              <p className={`text-sm ${specialty.active ? 'text-blue-100' : 'text-gray-600'}`}>
                {specialty.description}
              </p>
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="flex justify-center mt-4">
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            <div className="w-2 h-2 bg-hospital-blue rounded-full"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SpecialtiesSection 