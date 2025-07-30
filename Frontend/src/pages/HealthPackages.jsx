const HealthPackages = () => {
  const packages = [
    {
      id: 1,
      name: "Basic Health Check-up",
      price: "INR 3,500/-",
      originalPrice: "INR 5,000/-",
      discount: "30% OFF",
      features: [
        "Complete Blood Count",
        "Blood Sugar (Fasting)",
        "Lipid Profile",
        "Liver Function Test",
        "Kidney Function Test",
        "ECG",
        "Chest X-Ray",
        "General Physician Consultation"
      ],
      popular: false
    },
    {
      id: 2,
      name: "Executive Health Check-up Women",
      price: "INR 7,500/-",
      originalPrice: "INR 10,000/-",
      discount: "25% OFF",
      features: [
        "Complete Blood Count",
        "Blood Sugar (Fasting & PP)",
        "Lipid Profile",
        "Liver Function Test",
        "Kidney Function Test",
        "Thyroid Profile",
        "ECG",
        "Chest X-Ray",
        "Mammography",
        "Gynecologist Consultation"
      ],
      popular: true
    },
    {
      id: 3,
      name: "Executive Master Health Checkup",
      price: "INR 15,500/-",
      originalPrice: "INR 20,000/-",
      discount: "22% OFF",
      features: [
        "All Basic Tests",
        "Cardiac Markers",
        "Cancer Screening",
        "Bone Density",
        "Stress Test",
        "Echo Cardiogram",
        "Consultation with Specialist",
        "Nutritional Assessment"
      ],
      popular: false
    },
    {
      id: 4,
      name: "Senior Citizen Health Package",
      price: "INR 12,000/-",
      originalPrice: "INR 16,000/-",
      discount: "25% OFF",
      features: [
        "Comprehensive Health Assessment",
        "Cardiac Evaluation",
        "Bone Health Check",
        "Vision & Hearing Test",
        "Nutritional Assessment",
        "Geriatric Consultation",
        "Home Care Guidance"
      ],
      popular: false
    }
  ]

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 text-center mb-12">
          Health Check-up Packages
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`bg-white p-8 rounded-lg shadow-lg border-2 ${
                pkg.popular ? 'border-hospital-blue' : 'border-gray-200'
              } relative`}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-hospital-blue text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                {pkg.name}
              </h3>
              
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl font-bold text-hospital-blue">
                    {pkg.price}
                  </span>
                  <span className="text-lg text-gray-500 line-through">
                    {pkg.originalPrice}
                  </span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
                    {pkg.discount}
                  </span>
                </div>
              </div>
              
              <ul className="space-y-3 mb-8">
                {pkg.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-500 mr-3 mt-1">✓</span>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button className="w-full btn-primary">
                Book Now
              </button>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Need a custom package? Contact us for personalized health check-up plans.
          </p>
          <button className="btn-secondary">
            Contact Us
          </button>
        </div>
      </div>
    </div>
  )
}

export default HealthPackages 