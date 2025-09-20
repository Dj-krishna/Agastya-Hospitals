const OutstandingCareSection = () => {
  return (
    <section className="outstanding-care">
      {/* <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              We're known for outstanding Care
            </h2>
          
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
            
           
          </div>
        </div>
      </div> */}

      <div className="container">
        <div className="row">
          <div className="col-lg-6">
            <div className="left-section">
              <img src="https://res.cloudinary.com/sdk28cdn/image/upload/v1756662699/agastya/about-agastya.png" alt="Outstanding Care"></img>
              <div className="d-flex mt-5 mx-auto justify-center">
                <a href="#" className="video"><img height={24} src="https://res.cloudinary.com/sdk28cdn/image/upload/v1758302379/agastya/video-icon.svg"></img> Watch Video</a>
                <a href="#" className="locateus"><img height={24} src="https://res.cloudinary.com/sdk28cdn/image/upload/v1758302379/agastya/map-icon.svg"></img> Locate Us</a>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="right-section">
              <h2 className="main-title">We're known for outstanding Care</h2>
              <p className="paragraph-18 mb-5">
                Agastya Hospitals, is a 150 bedded hospital located on converge of 5 most important routes of twin cities, situated at Omakar Nagar, Nagarjuna Sagar Road, L B Nagar, Hyderabad. The project was conceived by 4 of the most enterprising Medical Professionals of the City.
              </p>

              <ul className="list-items">
                <li>Highly qualified team of doctors and specialists</li>
                <li>State-of-the-art facilities and cutting-edge technology</li>
                <li>Commitment to affordable and accessible for all</li>
              </ul>
            </div>
            <div className="accreditation">
                <div className="background"></div>
                <div className="accreds"><p className="paragraph-22 p-3 f-w-700">Accreditation <br/>& Recognition</p><img src="https://res.cloudinary.com/sdk28cdn/image/upload/v1756662699/agastya/accreditation-recognition.png"></img></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default OutstandingCareSection 