const Specialties = () => {
  const specialties = [
    {
      name: "Heart & Vascular Management",
      description: "Comprehensive cardiac care with advanced diagnostic and treatment facilities",
      icon: "❤️"
    },
    {
      name: "Cardiac Sciences",
      description: "Expert cardiology services including interventional procedures",
      icon: "🫀"
    },
    {
      name: "Joint Care",
      description: "Specialized orthopedic care for joint-related conditions",
      icon: "🦴"
    },
    {
      name: "ENT",
      description: "Ear, Nose, and Throat specialists providing comprehensive care",
      icon: "👂"
    },
    {
      name: "General Surgery",
      description: "Advanced surgical procedures with minimal invasive techniques",
      icon: "🔪"
    },
    {
      name: "Interventional Pulmonology",
      description: "Specialized respiratory care and advanced pulmonary procedures",
      icon: "🫁"
    },
    {
      name: "Nephrology & Urology",
      description: "Comprehensive kidney and urinary system care",
      icon: "🫘"
    },
    {
      name: "Neuro Sciences",
      description: "Advanced neurological care and brain surgery",
      icon: "🧠"
    }
  ]

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 text-center mb-12">
          Our Specialties
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {specialties.map((specialty, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-200"
            >
              <div className="text-4xl mb-4">{specialty.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {specialty.name}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {specialty.description}
              </p>
              <button className="mt-4 btn-primary">
                Learn More
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Specialties 