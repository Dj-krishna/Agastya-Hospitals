import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchSpecialties } from "../slices/specialtySlice";
import { DOCTORS_API, SPECIALITIES_API } from "../api/services";
import axios from "axios";
import { setBreadcrumb } from "../slices/breadcrumbSlice";

const DoctorsSection = () => {
  const [activeIndex, setActiveIndex] = useState();
  const [activeCard, setActiveCard] = useState("");
  const [doctorList, setDoctorList] = useState([]);
  const scrollRef = React.useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { specialties, loading: isLoading } = useSelector(
    (state) => state.specialties
  );

  useEffect(() => {
    dispatch(fetchSpecialties());
  }, [dispatch]);

  const sortedData = Array.isArray(specialties?.data)
    ? [...specialties?.data].sort((a, b) => a.specialityID - b.specialityID)
    : [];
  const specialtiesData = sortedData?.map((specialty) => {
    return {
      specialityName: specialty.specialityName,
      specialityID: specialty.specialityID,
    };
  });

  const fetchDoctorsBySpecialty = async (specialityID) => {
    try {
      const response = await axios.get(
        `${SPECIALITIES_API}?specialityID=${specialityID}`
      );
      if (response.data.doctor.length > 0) {
        let doctorsList = response.data.doctor?.map((doc) => {
          const docResponse = axios.get(`${DOCTORS_API}?doctorID=${doc}`);
          return docResponse.then((res) => res.data);
        });
        const allDoctors = await Promise.all(doctorsList);
        const doctorDataList = allDoctors.map((doc) => doc.data);
        setDoctorList(doctorDataList);
        setActiveIndex(specialityID);
      } else {
        setDoctorList([]);
        setActiveIndex(specialityID);
      }
    } catch (error) {
      console.error("Error fetching doctors by specialty:", error);
      setDoctorList([]);
    }
  };

  console.log("DOCTORS:: ", doctorList);
  const handleDotClick = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300; // adjust for card width
      if (direction === "left") {
        scrollRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      } else {
        scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };

  useEffect(() => {
    if (specialtiesData.length > 0) {
      setActiveIndex(specialtiesData[0].specialityID);
      fetchDoctorsBySpecialty(specialtiesData[0].specialityID);
    }
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="row">
          <div className="col-lg-12 text-center mb-12">
            <h2 className="main-title-center">
              Our Expert Doctors For The Patients
            </h2>
          </div>
        </div>

        {/* Specialty Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12 ">
          {specialtiesData?.map((specialty, index) => (
            <button
              key={specialty.specialityID}
              className={`specialty-tabpill py-2 px-3 ${
                specialty.specialityID === activeIndex
                  ? "active"
                  : "specialty-tabpill"
              }`}
              onClick={() => fetchDoctorsBySpecialty(specialty.specialityID)}
            >
              {specialty.specialityName}
            </button>
          ))}
        </div>

        {/* Doctors Carousel */}
        <div className="relative mt-12">
          {/* Navigation Arrows */}
          {doctorList.length > 0 && (
            <>
              <button
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow z-10"
                onClick={() => handleDotClick("left")}
              >
                <span className="text-2xl">←</span>
              </button>
              <button
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow z-10"
                onClick={() => handleDotClick("right")}
              >
                <span className="text-2xl">→</span>
              </button>
            </>
          )}
          {/* Doctors Grid */}
          <div
            className="flex gap-8 justify-content-center"
            style={{ overflowX: "auto" }}
            ref={scrollRef}
          >
            {doctorList.length > 0 ? (
              doctorList.map((doctor) => (
                <div
                  key={doctor.doctorID}
                  className="flex-shrink-0 w-80 bg-white rounded-lg "
                >
                  <div className="text-center">
                    <div className="mb-4">
                      <img className="rounded-5" src={doctor.profilePicture} />
                      <button
                        className="shadow-sm border-1 rounded-5 d-flex align-items-center mt-3 ctabtn bookappointment"
                        onClick={() => {
                          dispatch(setBreadcrumb(["Home", "Book Appointment"]));
                          window.scrollTo({ top: 0, behavior: "smooth" });
                          navigate("/book-appointment");
                        }}
                      >
                        <span>
                          <img src="https://res.cloudinary.com/sdk28cdn/image/upload/v1758389743/agastya/circlearrow.svg" />
                        </span>{" "}
                        <span>Book Appointment</span>
                      </button>
                    </div>
                    <h3 className="f-20 mb-3 f-w-700 text-center">
                      {doctor.fullName}
                    </h3>
                    <p className="text-center text-muted f-16">
                      {doctor.designation}
                    </p>
                    <p className="text-center mb-2 text-muted f-16">
                      {doctor.educationQualification[1]
                        ? doctor.educationQualification[1]
                        : "NA"}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-danger f-18 f-w-600">
                No Doctors Available
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DoctorsSection;
