const HealthPackagesSection = () => {
  const packages = [
    {
      id: 1,
      name: "Executive Health Check-up Women",
      price: "INR 7,500/-",
      features: [
        "Complete Blood Count",
        "Blood Sugar (Fasting & PP)",
        "Lipid Profile",
        "Liver Function Test",
        "Kidney Function Test",
        "Thyroid Profile",
        "ECG",
        "Chest X-Ray"
      ]
    },
    {
      id: 2,
      name: "Executive Master Health Checkup",
      price: "INR 15,500/-",
      features: [
        "All Basic Tests",
        "Cardiac Markers",
        "Cancer Screening",
        "Bone Density",
        "Stress Test",
        "Echo Cardiogram",
        "Consultation with Specialist"
      ]
    },
    {
      id: 3,
      name: "Senior Citizen Health Package",
      price: "INR 12,000/-",
      features: [
        "Comprehensive Health Assessment",
        "Cardiac Evaluation",
        "Bone Health Check",
        "Vision & Hearing Test",
        "Nutritional Assessment",
        "Geriatric Consultation"
      ]
    }
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-12">
          {/* Left Content */}
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Our Popular Health Check-up Packages
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Comprehensive health check-up packages designed to provide you with a complete 
              assessment of your health status. Our packages include the latest diagnostic 
              tests and consultations with experienced specialists.
            </p>
          </div>

          {/* Right Content - Background Image */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-80 h-64 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">👨‍👩‍👧‍👦</div>
                <p className="text-gray-600">Family health and care</p>
              </div>
            </div>
          </div>
        </div>

        {/* Packages Carousel */}
        <div className="relative">
          {/* Navigation Arrows */}
          <button className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow z-10">
            <span className="text-2xl">←</span>
          </button>
          <button className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow z-10">
            <span className="text-2xl">→</span>
          </button>

          {/* Packages Grid */}
          <div className="flex gap-8 overflow-x-auto pb-4">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className="flex-shrink-0 w-96 bg-white p-8 rounded-lg shadow-lg border border-gray-200"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {pkg.name}
                </h3>
                
                <ul className="space-y-2 mb-6">
                  {pkg.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-500 mr-3 mt-1">✓</span>
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl font-bold text-hospital-blue">
                      {pkg.price}
                    </span>
                  </div>
                  <button className="btn-primary w-full">
                    Book Now
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

export default HealthPackagesSection 