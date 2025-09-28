import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
// import { fetchSpecialties } from "../slices/specialtySlice";
import { useEffect } from "react";
import axios from "axios";
import { SPECIALITIES_API } from "../api/services";
import { useState } from "react";
import EnquiryForm from "./EnquiryForm";

const SpecialtyDetails = () => {
  const location = useLocation();
  const [specialties, setSpecialties] = useState();
  const [doctorData, setDoctorData] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const specialityID = location.state?.specialityID;

  const fetchSpecialties = async () => {
    try {
      const response = await axios.get(
        `${SPECIALITIES_API}?specialityID=${specialityID}`
      );
      if (response.data.doctor.length > 0) {
        
      }
      setSpecialties(response.data);
    } catch (error) {}
  };
  useEffect(() => {
    fetchSpecialties();
  }, []);

  return (
    <div className="container">
      <div className="row m-0">
        <div className="col-md-4">
          <EnquiryForm />
        </div>
        <div className="col-md-8 p-4">
          <img
            className="rounded-5 border-1 shadow-sm"
            src={specialties?.banner[0]}
            style={{ height: "200px", width: "100%" }}
          />
          <h2 className="f-30 f-w-700 mt-4 mb-3">Overview</h2>
          <div
            dangerouslySetInnerHTML={{ __html: specialties?.pageDescription }}
          />
          <div className="my-5">
            <h2 className="f-30 f-w-700 mb-3">Our Specialist Doctors</h2>
          </div>
          {/* <div className="row mt-3">
            <div className="col-lg-6 col-md-12 col-sm-12 col-xs-12">
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
                        {doctor.educationQualification[1]
                          ? doctor.educationQualification[1]
                          : "NA"}
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
                    onClick={() => navigate("/book-appointment")}
                  >
                    <span>
                      <img src="https://res.cloudinary.com/sdk28cdn/image/upload/v1758389743/agastya/circlearrow.svg" />
                    </span>{" "}
                    Book Appointment
                  </button>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default SpecialtyDetails;
