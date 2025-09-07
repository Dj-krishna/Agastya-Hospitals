import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { SPECIALITIES_API } from "../api/services";
import { Link } from "react-router-dom";

const Specialties = () => {
  const [specialties, setSpecialties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSpecialties = async () => {
    setIsLoading(true);
    try {
      const response = await axios(SPECIALITIES_API);
      setSpecialties(response.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchSpecialties();
  }, []);

  return (
    <div>
       <div class="container-fluid">
        <div class="banner mb-12">
          <div class="container mx-auto">
            <div class="row">
              <div class="col-lg-12">
                <h2 class="banner-title">Our Specialties</h2>
                <div class="breadcrumb">
                  <a href="/">Home</a> <span>/</span>
                  <span>Our Specialties</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4">
        {/* <h1 className="text-4xl font-bold text-gray-900 text-center mb-12">
          Our Specialties
        </h1> */}

        {isLoading ? (
          <div className="text-center">
            <div
              className="spinner-grow text-primary"
              style={{ width: "3rem", height: "3rem" }}
              role="status"
            >
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-center">Loading...</p>
          </div>
        ) : (
          <div className="row">
            {specialties.length > 0 ? (
              specialties.map((specialty, index) => (
                <div key={index} className="col-md-4">
                  <div className="bg-white p-6 rounded-4 mb-4 specialty-card">
                    <div className="text-4xl mb-4">
                      {/* <img src={specialty.icon} alt={specialty.name} /> */}
                      <svg
                        class="bd-placeholder-img rounded-4"
                        width="40"
                        height="40"
                        xmlns="http://www.w3.org/2000/svg"
                        role="img"
                        aria-label="Example larger rounded image: 75x75"
                        preserveAspectRatio="xMidYMid slice"
                        focusable="false"
                      >
                        <title>Example larger rounded image</title>
                        <rect
                          width="100%"
                          height="100%"
                          fill="#6c757d61"
                        ></rect>
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {specialty.specialityName}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {specialty.shortDescription}
                    </p>
                    <button className="mt-4 learn-more">Learn More</button>
                  </div>
                </div>
              ))
            ) : (
              <div>No Specialties available...</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Specialties;
