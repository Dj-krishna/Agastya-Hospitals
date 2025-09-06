import { useState } from "react";
import { DOCTORS_API } from "../api/services";
import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FindDoctor = () => {
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  const fetchDoctors = async () => {
    setIsLoading(true);
    try {
      const response = await axios(DOCTORS_API);
      setDoctors(response.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchDoctors();
  }, []);

  // const doctors = [
  //   {
  //     name: "Dr. Walther White",
  //     specialty: "Cardiology",
  //     title: "Head of Cardiology Department",
  //     affiliation: "University of Florida",
  //     image: "👨‍⚕️",
  //     available: true,
  //   },
  //   {
  //     name: "Dr. Elizabeth",
  //     specialty: "Cardiology",
  //     title: "Senior Cardiologist",
  //     affiliation: "University of Colorado",
  //     image: "👩‍⚕️",
  //     available: true,
  //   },
  //   {
  //     name: "Dr. Michael Chen",
  //     specialty: "Neurology",
  //     title: "Interventional Neurologist",
  //     affiliation: "Johns Hopkins University",
  //     image: "👨‍⚕️",
  //     available: false,
  //   },
  //   {
  //     name: "Dr. Sarah Johnson",
  //     specialty: "Orthopedics",
  //     title: "Joint Replacement Specialist",
  //     affiliation: "Harvard Medical School",
  //     image: "👩‍⚕️",
  //     available: true,
  //   },
  // ];

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-center mb-5 fs-1 fw-bolder">Find a Doctor</h1>
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
          <div className="max-w-6xl mx-auto">
            <div className="row">
              {doctors.length > 0 ? (
                doctors.map((doctor) => (
                  <div key={doctor.ID} className="col-md-4 col-sm-6 col-xs-12">
                    <div className="card border-none shadow-lg rounded-4 mb-4">
                      <div className="text-center mb-6">
                        <div className="w-24 h-24 bg-light rounded-full mx-auto mb-4 d-flex items-center justify-center">
                          <img
                            style={{ width: "5rem" }}
                            src={doctor.profilePicture}
                          />
                        </div>
                        <h3 className="fs-4 font-semibold mb-2 text-center">
                          {doctor.fullName}
                        </h3>
                        <p className="text-hospital-blue fw-semibold mb-1 text-center">
                          {doctor.designation}
                        </p>
                        <p className="text-gray-600 text-sm mb-2 text-center">
                          {doctor.yearsOfExperience} Years of Experience
                        </p>
                        <p className="text-gray-500 text-xs text-center">
                          {doctor.educationQualification[1]}
                        </p>
                      </div>

                      <div className="d-flex justify-center mb-4">
                        <span
                          className={`fs-6 text-center fw-semibold ${
                            doctor.opTimings.length > 0
                              ? "text-success"
                              : "text-danger"
                          }`}
                        >
                          {doctor.opTimings.length > 0
                            ? "Available"
                            : "Not Available"}
                        </span>
                      </div>

                      {doctor.opTimings.length > 0 && (
                        <button
                          className={`w-full py-2 px-4 rounded-3 text-center font-medium ${
                            doctor.opTimings.length > 0
                              ? "bg-info text-white"
                              : "bg-light fw-500 pe-none"
                          } transition-colors duration-200 border-1`}
                          disabled={!doctor.opTimings.length > 0}
                          onClick={() => navigate("/book-appointment")}
                        >
                          {doctor.opTimings.length > 0
                            ? "Book Appointment"
                            : "Not Available"}
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div>No doctors found...</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FindDoctor;
