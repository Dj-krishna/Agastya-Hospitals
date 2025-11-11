import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
// import { fetchSpecialties } from "../slices/specialtySlice";
import { useEffect } from "react";
import axios from "axios";
import { DOCTORS_API, SPECIALITIES_API } from "../api/services";
import { useState } from "react";
import EnquiryForm from "./EnquiryForm";
import { setBreadcrumb } from "../slices/breadcrumbSlice";

const SpecialtyDetails = () => {
  const location = useLocation();
  const [specialties, setSpecialties] = useState();
  const [doctorData, setDoctorData] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: specialityName } = useParams();

  const formatSpecialtyTitle = (name) => {
    return name
      .replace(/-/g, " ")
      .toLowerCase()
      .split(" ")
      .map((word) =>
        word === "and" ? "and" : word.charAt(0).toUpperCase() + word.slice(1)
      )
      .join(" ");
  };

  // const fetchSpecialties = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await axios.get(
  //       `${SPECIALITIES_API}?specialityID=${specialityID}`
  //     );
  //     if (response.data.doctor.length > 0) {
  //       let doctorsList = response.data.doctor?.map((doc) => {
  //         const docResponse = axios.get(`${DOCTORS_API}?doctorID=${doc}`);
  //         return docResponse.then((res) => res.data);
  //       });
  //       const allDoctors = await Promise.all(doctorsList);
  //       const doctorDataList = allDoctors.map((doc) => doc.data);
  //       setDoctorData(doctorDataList.length > 0 ? doctorDataList : []);
  //       setLoading(false);
  //     }
  //     setSpecialties(response.data);
  //   } catch (error) {}
  // };

  const fetchSpecialties = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${SPECIALITIES_API}?specialityName=${formatSpecialtyTitle(
          specialityName
        )}`
      );
      if (response.data[0].doctor.length > 0) {
        // Fetch all doctor data in parallel
        const doctorsList = await Promise.all(
          response.data[0].doctor.map(async (doc) => {
            try {
              const docResponse = await axios.get(
                `${DOCTORS_API}?doctorID=${doc}`
              );
              // Only return doctor data if available
              return docResponse.data?.data || null;
            } catch {
              // If doctor not found or error, return null
              return null;
            }
          })
        );
        // Filter out null values (doctors not found)
        const doctorDataList = doctorsList.filter(Boolean);
        setDoctorData(doctorDataList);
      } else {
        setDoctorData([]);
      }
      setSpecialties(response.data[0]);
      setLoading(false);
    } catch (error) {
      setDoctorData([]);
      setSpecialties(null);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchSpecialties();
  }, [specialityName]);

  const gotoProfile = (doctorID) => {
    dispatch(setBreadcrumb(["Home", "Doctor Profile"]));
    navigate("/doctor/profile", { state: { doctorID } });
  };

  return (
    <div className="container">
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
            <div className="mt-5">
              <h2 className="f-30 f-w-700 mb-3">Our Specialist Doctors</h2>
            </div>
            <div className="row">
              {doctorData?.length != 0 ? (
                doctorData?.map((doctor) => (
                  <div
                    key={doctor.doctorID}
                    className="col-lg-12 col-md-12 col-sm-12 col-xs-12"
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
                                  {doctor.opTimings &&
                                  doctor.opTimings.length > 0
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
                            dispatch(
                              setBreadcrumb(["Home", "Book Appointment"])
                            );
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
        </div>
      )}
    </div>
  );
};

export default SpecialtyDetails;
