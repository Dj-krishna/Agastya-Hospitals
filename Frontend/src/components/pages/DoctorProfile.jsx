import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { DOCTORS_API } from "../../api/services";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setBreadcrumb } from "../../slices/breadcrumbSlice";

const DoctorProfile = () => {
  const [doctorProfile, setDoctorProfile] = useState({});
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const doctorID = location.state?.doctorID;

  const fetchDoctorById = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${DOCTORS_API}/?doctorID=${doctorID}`);
      if (response.data) {
        setDoctorProfile(response.data.data);
        setLoading(false);
      }
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    fetchDoctorById();
  }, []);
  return (
    <div className="container p-5">
      {loading ? (
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
        <div className="row mx-5">
          <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
            <div className="rounded-0 bg-light p-4">
              <img
                src={doctorProfile.profilePicture}
                className="img-fluid rounded-4"
                alt="Doctor"
                style={{ width: "60%", objectFit: "cover" }}
              />
              <div className="mt-3 border-bottom pb-3">
                <h4 className="f-24 f-w-700">{doctorProfile.fullName}</h4>
                <ul className="mt-2">
                  {doctorProfile.qualification
                    ? doctorProfile.qualification?.map((edu) => (
                        <li className="f-12 text-muted mb-n1">{edu}</li>
                      ))
                    : "N/A"}
                </ul>
              </div>
              <div className="mt-3">
                <ul>
                  {[
                    { label: "Designation", value: doctorProfile.designation },
                    {
                      label: "Specialty",
                      value: doctorProfile.specialityNames,
                    },
                    {
                      label: "Med Reg No",
                      value: doctorProfile.medicalRegNumber,
                    },
                    {
                      label: "Years of Exp",
                      value: doctorProfile.yearsOfExperience,
                    },
                    {
                      label: "Languages Speack",
                      value: doctorProfile.languagesKnown,
                    },
                    { label: "OPD Timings", value: doctorProfile.opTimings },
                  ].map((list) => (
                    <li className="mb-2">
                      <label className="f-12 text-muted">{list.label}:</label>
                      <br />
                      {Array.isArray(list.value) ? (
                        list.value.map((subList) =>
                          list.label === "OPD Timings" ? (
                            <p className="f-12 f-w-700">{subList}, </p>
                          ) : (
                            <span className="f-12 f-w-700">{subList}, </span>
                          )
                        )
                      ) : (
                        <p className="f-12 f-w-700">{list.value}</p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-4 text-center">
                <button
                  className="btn rounded-pill px-3 py-2 book-btn f-12"
                  onClick={() => {
                    dispatch(setBreadcrumb(["Home", "Book Appointment"]));
                    navigate("/book-appointment");
                  }}
                >
                  Book Appointment
                </button>
              </div>
            </div>
          </div>
          <div className="col-md-8 col-lg-8 col-sm-12 col-xs-12 pt-2">
            <div className="pl-2 border-bottom pb-3">
              <h3 className="f-w-700 f-18 mb-2">Overview</h3>
              <p
                className="text-justify f-14"
                dangerouslySetInnerHTML={{
                  __html: doctorProfile.experienceDescription,
                }}
              ></p>
              <p
                className="text-justify f-14"
                dangerouslySetInnerHTML={{ __html: doctorProfile.expertise }}
              />
            </div>
            <div className="pl-2 border-bottom py-3">
              <h3 className="f-w-700 f-18 mb-2">Educational Qualifications</h3>
              <ul>
                {doctorProfile.educationQualification
                  ? doctorProfile.educationQualification?.map((edu) => (
                      <li className="f-14 mb-1">{edu}</li>
                    ))
                  : "N/A"}
              </ul>
            </div>
            <div className="pl-2 border-bottom py-3">
              <h3 className="f-w-700 f-18 mb-2">Work Experience</h3>
              <p
                className="text-justify f-14"
                dangerouslySetInnerHTML={{
                  __html: doctorProfile.experienceDescription,
                }}
              />
            </div>
            <div className="pl-2 border-bottom py-3">
              <h3 className="f-w-700 f-18 mb-2">Services offered</h3>
              <ul>
                {doctorProfile.servicesOffered
                  ? doctorProfile.servicesOffered?.map((service) => (
                      <li className="f-14 mb-1">{service}</li>
                    ))
                  : "N/A"}
              </ul>
            </div>
            <div className="pl-2 border-bottom py-3">
              <h3 className="f-w-700 f-18 mb-2">Awards and Achievements</h3>
              <p
                className="text-justify f-14"
                dangerouslySetInnerHTML={{
                  __html: doctorProfile.awardsAndAchievements,
                }}
              />
            </div>{" "}
            <div className="pl-2 py-3">
              <h3 className="f-w-700 f-18 mb-2">Research & Publications</h3>
              <p
                className="text-justify f-14"
                dangerouslySetInnerHTML={{
                  __html: doctorProfile.researchAndPublications,
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorProfile;
