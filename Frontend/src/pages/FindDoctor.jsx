import { useState, useEffect } from "react";
import { DOCTORS_API } from "../api/services";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchSpecialties } from "../slices/specialtySlice";
//Frontend\src\slices\specialtySlice.js

const FindDoctor = () => {
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const navigate = useNavigate();

  // Redux
  const dispatch = useDispatch();
  // const { specialties, loading: specialtiesLoading } = useSelector(
  //   (state) => state.specialty
  // );

  // Fetch specialties on mount
  useEffect(() => {
    dispatch(fetchSpecialties());
  }, [dispatch]);

  const fetchDoctors = async () => {
    setIsLoading(true);
    try {
      const response = await axios(DOCTORS_API);
      setDoctors(response.data.data);
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
  console.log("DOCSSSS:::  ", doctors);
  return (
    <div className="container mx-auto px-5 py-5">
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
        <div className="">
          <div className="row m-0 mx-5">
            <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
              <select className="booking-form-input">
                <option>Filter by Specialty</option>
              </select>
            </div>
            <div className="col-lg-8 col-md-8 col-sm-12 col-xs-12">
              <input
                type="text"
                id="searchText"
                name="searchText"
                className="booking-form-input"
                placeholder="Search with Doctor name or Specialty"
              />
            </div>
          </div>
          <div className="row m-0 mx-5 mt-3">
            {doctors.length != 0 ? (
              doctors.map((doctor) => (
                <div
                  key={doctor.ID}
                  className="col-lg-6 col-md-6 col-sm-6 col-xs-12"
                >
                  {/* <div className="card border-1 shadow-xs rounded-4 mb-4"> */}
                  {/* <div className="text-center mb-6">
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
                    )} */}
                  {/* <div className="d-flex">
                      <div className="">
                        <img className='img-thumbnail' src={doctor.profilePicture} />
                      </div>
                      <div className=""></div>
                    </div> */}
                  {/* </div> */}
                  <div className="card border-1 shadow-xs rounded-4 mb-4 p-2">
                    <div className="row g-0">
                      <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 text-center p-2">
                        <img
                          src={doctor.profilePicture}
                          className="img-fluid rounded-3"
                          alt="Doctor"
                        />
                      </div>
                      <div className="col-lg-8 col-md-8 col-sm-12 col-xs-12 pr-0">
                        <div className="card-body">
                          <h5 className="card-title fw-bold mb-1">
                            {doctor.fullName}
                          </h5>
                          <p className="mb-1 text-muted small">
                            {doctor.educationQualification[1]}
                          </p>
                          <p className="text-primary fw-semibold mb-2">
                            {doctor.designation}
                          </p>
                          <ul
                            className="mb-3 small"
                            style={{ listStyle: "inside" }}
                          >
                            <li className="text-muted mb-1">
                              <strong>Experience:</strong>{" "}
                              <span className="text-dark">
                                {doctor.yearsOfExperience} Years
                              </span>
                            </li>
                            <li className="text-muted mb-1">
                              <strong>Speaks:</strong>{" "}
                              <span className="text-dark">
                                Telugu, English, Hindi
                              </span>
                            </li>
                            <li className="text-muted mb-1 d-flex align-items-baseline">
                              <strong className="me-1">Consultation:</strong>
                              <span className="text-clamped-one text-dark">
                                {doctor.opTimings && doctor.opTimings.length > 0
                                  ? doctor.opTimings.join(", ")
                                  : "Not Available"}
                              </span>
                            </li>
                            <li className="text-muted mb-1 d-flex align-items-baseline">
                              <strong className="me-1">Expertise:</strong>{" "}
                              <span className="text-dark text-clamped-one">
                                Liver Intensive Care, Acute Liver Failure…
                              </span>
                            </li>
                          </ul>
                          <div className="d-flex flex-wrap gap-2">
                            <button
                              href="#"
                              className="primary-btn-outline rounded-pill f-12 f-w-700"
                            >
                              View Profile
                            </button>
                            <button
                              className="rounded-pill px-3 book-btn f-12"
                              onClick={() => navigate("/book-appointment")}
                            >
                              Book Appointment
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
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
  );
};

export default FindDoctor;
