const Careers = () => {
  const positions = [
    {
      id: 1,
      title: "Senior Cardiologist",
      department: "Cardiology",
      location: "Hyderabad",
      type: "Full-time",
      experience: "5+ years",
      description:
        "We are looking for an experienced cardiologist to join our cardiac team.",
    },
    {
      id: 2,
      title: "Registered Nurse",
      department: "Nursing",
      location: "Hyderabad",
      type: "Full-time",
      experience: "2+ years",
      description: "Join our nursing team to provide excellent patient care.",
    },
    {
      id: 3,
      title: "Medical Technologist",
      department: "Laboratory",
      location: "Hyderabad",
      type: "Full-time",
      experience: "3+ years",
      description:
        "Work with advanced medical equipment in our state-of-the-art laboratory.",
    },
    {
      id: 4,
      title: "Administrative Assistant",
      department: "Administration",
      location: "Hyderabad",
      type: "Full-time",
      experience: "1+ years",
      description:
        "Support our administrative team in managing hospital operations.",
    },
  ];

  return (
    <div className="container py-5">
      {/* <h1 className="text-4xl font-bold text-gray-900 text-center mb-12">
          Careers at Agastya Hospitals
        </h1> */}

      <div className="row">
        <div className="col-lg-12">
          <h2 className="heading-22">Join Our Team</h2>
          <p className="paragraph-16">
            At Agastya Hospitals, we believe in fostering a culture of
            excellence, innovation, and compassion. We are always looking for
            talented healthcare professionals who share our commitment to
            providing the best possible care to our patients.
          </p>
          <p className="paragraph-16">
            Join us in our mission to transform lives and restore health through
            advanced medical care and compassionate service.
          </p>
        </div>
      </div>

      <div className="row mt-5">
        <div className="col-lg-12">
          <h2 className="heading-22 mb-3">Current Openings</h2>

          <div className="space-y-6">
            {positions.map((position) => (
              <div key={position.id} className="bg-white careers-card">
                <div className="">
                  <div>
                    <h3 className="position-title">{position.title}</h3>
                    <p className="position-desc">{position.description}</p>
                  </div>
                  <button className="applynow">Apply Now</button>
                </div>

                <div className="careers-category">
                  <div>
                    <span className="label">Department:</span>
                    <p className="information">{position.department}</p>
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

          <div className="col-lg-12 text-center pt-3 m-5">
            <p className="paragraph-16 text-center">
              Don't see a position that matches your skills? Send us your
              resume!
            </p>
            <button className="primary-btn mb-5 mt-2">Submit Resume</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Careers;
