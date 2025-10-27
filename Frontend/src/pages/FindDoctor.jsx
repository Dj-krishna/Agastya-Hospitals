import { useState, useEffect } from "react";
import { DOCTORS_API, SPECIALITIES_API } from "../api/services";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { setBreadcrumb } from "../slices/breadcrumbSlice";
import { useDispatch } from "react-redux";

const FindDoctor = () => {
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [specialties, setSpecialties] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  const specialtyOptions = specialties.map((s) => ({
    value: s.specialityID,
    label: s.specialityName,
  }));

  // Filter doctors
  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSpecialty = selectedSpecialty
      ? doctor.speciality.includes(selectedSpecialty.value)
      : true;

    const matchesName = searchText
      ? doctor.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
        doctor.speciality.includes(searchText)
      : true;

    return matchesSpecialty && matchesName;
  });

  const gotoProfile = (doctorID) => {
    navigate("/doctor/profile", { state: { doctorID } });
  };

  return (
    <div className="container py-5">
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
          <div className="row">
            <div className="col-lg-4 col-md-6 col-sm-12 col-xs-12">
              <Select
                options={[...specialtyOptions].sort((a, b) =>
                  a.label.localeCompare(b.label)
                )}
                value={selectedSpecialty}
                onChange={setSelectedSpecialty}
                isClearable
                placeholder="Filter by Specialty"
                styles={{
                  control: (provided) => ({
                    ...provided,
                    padding: "6px 10px",
                    borderRadius: "8px",
                    marginBottom: "15px",
                    border: "1px solid #ddd",
                    fontSize: "14px",
                    boxShadow: "none",
                    "&:hover": {
                      border: "1px solid #aaa",
                    },
                  }),
                  valueContainer: (provided) => ({
                    ...provided,
                    padding: 0,
                  }),
                  input: (provided) => ({
                    ...provided,
                    margin: 0,
                    padding: 0,
                  }),
                  menu: (provided) => ({
                    ...provided,
                    borderRadius: "8px",
                    marginTop: "5px",
                    border: "1px solid #ddd",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                    fontSize: "14px",
                    zIndex: 9999,
                  }),
                }}
              />
            </div>
            <div className="col-lg-8 col-md-6 col-sm-12 col-xs-12">
              <input
                type="text"
                id="searchText"
                name="searchText"
                className="booking-form-input"
                placeholder="Search with Doctor name or Specialty"
                value={searchText}
                onChange={(e) => {
                  setSearchText(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="row mt-3">
            {filteredDoctors.length != 0 ? (
              filteredDoctors.map((doctor) => (
                <div
                  key={doctor.ID}
                  className="col-lg-6 col-md-12 col-sm-12 col-xs-12"
                >
                  <div className="doctor-card">
                    <div className="row g-0">
                      <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 doctor-photo">
                        <img
                          src={doctor.profilePicture}
                          className="img-fluid rounded-3"
                          alt="Doctor"
                          style={{ height: "14rem" }}
                        />
                      </div>
                      <div className="col-lg-8 col-md-8 col-sm-12 col-xs-12">
                        <div className="doctor-info">
                          <h5 className="name">{doctor.fullName}</h5>
                          <p className="qualification">
                            {doctor.qualification.join(", ")}
                          </p>
                          <p className="designation">{doctor.designation}</p>
                          <ul
                            className="detailsgrid"
                            style={{ listStyle: "inside" }}
                          >
                            <li>
                              <span className="label">Experience:</span>{" "}
                              <span className="information">
                                {doctor.yearsOfExperience} Years
                              </span>
                            </li>
                            <li>
                              <span className="label">Speaks:</span>{" "}
                              <span className="information">
                                Telugu, English, Hindi
                              </span>
                            </li>
                            <li>
                              <span className="label">Consultation:</span>{" "}
                              <span className="information text-ellipsis-one">
                                {doctor.opTimings && doctor.opTimings.length > 0
                                  ? doctor.opTimings.join(", ")
                                  : "Not Available"}
                              </span>
                            </li>
                            <li>
                              <span className="label">Expertise:</span>{" "}
                              <span className="information text-ellipsis-one">
                                <p
                                  dangerouslySetInnerHTML={{
                                    __html: doctor.experienceDescription,
                                  }}
                                ></p>
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex justify-end">
                      <button
                        href="#"
                        className="ctabtn viewprofile"
                        onClick={() => gotoProfile(doctor.doctorID)}
                      >
                        View Profile
                      </button>
                      <button
                        className="ctabtn bookappointment"
                        onClick={() => {
                          dispatch(setBreadcrumb(["Home", "Book Appointment"]));
                          window.scrollTo({ top: 0, behavior: "smooth" });
                          navigate("/book-appointment");
                        }}
                      >
                        <span>
                          <img src="https://res.cloudinary.com/sdk28cdn/image/upload/v1758389743/agastya/circlearrow.svg" />
                        </span>{" "}
                        Book Appointment
                      </button>
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
