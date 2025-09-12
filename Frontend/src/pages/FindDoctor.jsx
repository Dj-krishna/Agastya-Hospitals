import { useState, useEffect } from "react";
import { DOCTORS_API, SPECIALITIES_API } from "../api/services";
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
  const [specialties, setSpecialties] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fetchSpecialties = async () => {
    try {
      const response = await axios.get(SPECIALITIES_API);
      setSpecialties(response.data);
    } catch (error) {
      console.error("Error fetching specialties:", error);
      setSpecialties([]);
    }
  };

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
    fetchSpecialties();
  }, []);

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSpecialty =
      !selectedSpecialty ||
      (doctor.specialty &&
        doctor.specialty.toLowerCase() === selectedSpecialty.toLowerCase());
    const matchesSearch =
      !searchText ||
      doctor.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
      (doctor.specialty &&
        doctor.specialty.toLowerCase().includes(searchText.toLowerCase()));
    return matchesSpecialty && matchesSearch;
  });

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
                {specialties.map((spec) => (
                  <option key={spec.specialityID} value={spec.specialityID}>
                    {spec.specialityName}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-lg-8 col-md-8 col-sm-12 col-xs-12">
              <input
                type="text"
                id="searchText"
                name="searchText"
                className="booking-form-input"
                placeholder="Search with Doctor name or Specialty"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
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
                            {doctor.educationQualification[1]
                              ? doctor.educationQualification[1]
                              : "NA"}
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
                            <li className="text-muted mb-1">
                              <strong className="me-1">Consultation:</strong>
                              <span className="text-ellipsis-one text-dark">
                                {doctor.opTimings && doctor.opTimings.length > 0
                                  ? doctor.opTimings.join(", ")
                                  : "Not Available"}
                              </span>
                            </li>
                            <li className="text-muted mb-1">
                              <strong className="me-1">Expertise:</strong>{" "}
                              <span className="text-dark text-ellipsis-one">
                                <p
                                  dangerouslySetInnerHTML={{
                                    __html: doctor.experienceDescription,
                                  }}
                                ></p>
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
