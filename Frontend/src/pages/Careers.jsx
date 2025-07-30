const Careers = () => {
  const positions = [
    {
      id: 1,
      title: "Senior Cardiologist",
      department: "Cardiology",
      location: "Hyderabad",
      type: "Full-time",
      experience: "5+ years",
      description: "We are looking for an experienced cardiologist to join our cardiac team."
    },
    {
      id: 2,
      title: "Registered Nurse",
      department: "Nursing",
      location: "Hyderabad",
      type: "Full-time",
      experience: "2+ years",
      description: "Join our nursing team to provide excellent patient care."
    },
    {
      id: 3,
      title: "Medical Technologist",
      department: "Laboratory",
      location: "Hyderabad",
      type: "Full-time",
      experience: "3+ years",
      description: "Work with advanced medical equipment in our state-of-the-art laboratory."
    },
    {
      id: 4,
      title: "Administrative Assistant",
      department: "Administration",
      location: "Hyderabad",
      type: "Full-time",
      experience: "1+ years",
      description: "Support our administrative team in managing hospital operations."
    }
  ]

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 text-center mb-12">
          Careers at Agastya Hospitals
        </h1>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-8 rounded-lg shadow-lg mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Join Our Team
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              At Agastya Hospitals, we believe in fostering a culture of excellence, innovation, and compassion. 
              We are always looking for talented healthcare professionals who share our commitment to providing 
              the best possible care to our patients.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Join us in our mission to transform lives and restore health through advanced medical care 
              and compassionate service.
            </p>
          </div>

          <h2 className="text-2xl font-semibold text-gray-900 mb-8">
            Current Openings
          </h2>
          
          <div className="space-y-6">
            {positions.map((position) => (
              <div
                key={position.id}
                className="bg-white p-6 rounded-lg shadow-lg border border-gray-200"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {position.title}
                    </h3>
                    <p className="text-gray-600 mb-2">
                      {position.description}
                    </p>
                  </div>
                  <button className="btn-primary">
                    Apply Now
                  </button>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Department:</span>
                    <p className="font-medium">{position.department}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Location:</span>
                    <p className="font-medium">{position.location}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Type:</span>
                    <p className="font-medium">{position.type}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Experience:</span>
                    <p className="font-medium">{position.experience}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              Don't see a position that matches your skills? Send us your resume!
            </p>
            <button className="btn-secondary">
              Submit Resume
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Careers 