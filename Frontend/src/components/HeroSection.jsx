import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();
  return (
  <div>


      {/* <section className="bg-gradient-to-r from-blue-50 to-white py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div>
            <h1 className="hero-title">
              Transforming lives, <span className="thin">Restoring</span>{" "}
              <span className="regular">your</span> health
            </h1>
            <div className="flex flex-wrap gap-4">
              <button
                className="btn-primary"
                onClick={() => navigate("/book-appointment")}
              >
                Book a Doctor
              </button>
              <button className="btn-primary">Consultation</button>
              <button className="btn-primary">View All</button>
              <button className="btn-primary">Get a Quote</button>
            </div>
          </div>

          
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <div className="w-80 h-96 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-4xl">👨‍⚕️</span>
                  </div>
                  <p className="text-gray-600">Doctor with stethoscope</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Professional healthcare provider
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section> */}


      <section className="container-fluid">
        <div className="herosection-bg">
          <div className="container hero-container">
            <div className="row">
              <div className="col-lg-6 hero-content">
                <h1 className="hero-title">
                  Transforming lives, <span className="thin">Restoring</span>{" "}
                  <span className="regular">your</span> health
                </h1>
              </div>
              <div className="col-lg-6">
                <img src={"https://res.cloudinary.com/sdk28cdn/image/upload/v1756659932/agastya/doctor-image.png"} alt="Transofrm Health Care" />
              </div>
            </div>
            <div className="herobanner-quicklinks">
              <a href="#" className="quicklink">Book a Doctor's <br />Appointment</a>
              <a href="#" className="quicklink">Explore Our <br />Health Packages</a>
              <a href="#" className="quicklink">View Your <br />Medical Reports</a>
              <a href="#" className="quicklink">Get a Free <br />Second Opinion</a>
            </div>
          </div>
           
        </div>
      </section>








  
</div>
  );
};

export default HeroSection;
