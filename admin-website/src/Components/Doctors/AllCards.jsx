import React, { Fragment, useEffect, useState } from "react";
import { Card, CardBody, Col } from "reactstrap";
import { H5, Image } from "../../AbstractElements";
import { DOCTORS_API } from "../../api";
import { fetchDataGet } from "../../api/Services";
import CardSkeleton from "../Common/Component/CardSkeleton";

const AllCards = ({ onEditDoctor, refreshTrigger = 0 }) => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const data = await fetchDataGet(DOCTORS_API);
      setDoctors(data.data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [refreshTrigger]);

  console.log("DOCTOR CARDS ", doctors);

  const handleCardClick = (doctor) => {
    if (onEditDoctor) {
      onEditDoctor(doctor);
    }
  };

  if (loading) {
    return <CardSkeleton count={6} />;
  }

  return (
    <Fragment>
      {doctors.map((doctor) => {
        return (
          <Col
            key={doctor.id}
            xl="6"
            sm="12"
            xxl="4"
            className="col-ed-6 box-col-6"
          >
            {/* <Card
              className="social-profile"
              style={{ cursor: "pointer" }}
              onClick={() => handleCardClick(item)}
            >
              <CardBody>
                <div className="social-img-wrap">
                  <div className="social-img">
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 60,
                        height: 60,
                        borderRadius: "50%",
                        background: "#e0e0e0",
                        fontWeight: "bold",
                        fontSize: 22,
                        color: "#333",
                        margin: "0 auto",
                      }}
                    >
                      {(
                        item.fullName.split(" ")[1]?.split("")[0] +
                        item.fullName.split(" ")[2]?.split("")[0]
                      ).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="social-details">
                  <H5 attrH5={{ className: "mb-3" }}>{item.fullName}</H5>
                  <div className="d-flex justify-content-between my-2">
                    <span className="font-lite f-12">Designation:</span>
                    <span className="font-lite f-12">{item.designation}</span>
                  </div>
                  <div className="d-flex justify-content-between my-2">
                    <span className="font-lite f-12">Years of Experience:</span>
                    <span className="font-lite f-12">
                      {item.yearsOfExperience || "-"} Years
                    </span>
                  </div>
                  <div className="d-flex justify-content-between my-2">
                    <span className="font-lite f-12">Gender:</span>
                    <span className="font-lite f-12">{item.gender}</span>
                  </div>
                  <div className="d-flex justify-content-between my-2">
                    <span className="font-lite f-12">Contact Number:</span>
                    <span className="font-lite f-12">
                      {item?.countryCode}
                      {item?.countryCode && " - "}
                      {item.mobile}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between my-2">
                    <span className="font-lite f-12">Email Address:</span>
                    <span className="font-lite f-12">{item.email}</span>
                  </div>
                </div>
              </CardBody>
            </Card> */}
            <div className="card border-1 shadow-xs rounded-4 mb-4 p-2" onClick={() => handleCardClick(doctor)} style={{ cursor: "pointer" }} >
              <div className="row g-0">
                <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 text-center p-2">
                  <img
                    src={doctor.profilePicture}
                    className="img-fluid rounded-3"
                    alt="Doctor"
                  />
                </div>
                <div className="col-lg-8 col-md-8 col-sm-12 col-xs-12 pr-0 pt-2">
                  <div className="card-body pl-1 p-0">
                    <h5 className="card-title fw-bold mb-1">
                      {doctor.fullName}
                    </h5>
                    <p className="mb-1 text-muted small">
                      {doctor.educationQualification[1] ? doctor.educationQualification[1] : "NA"}
                    </p>
                    <p className="text-primary fw-semibold mb-2">
                      {doctor.designation}
                    </p>
                    <ul className="mb-3 small" style={{ listStyle: "inside" }}>
                      <li className="text-muted mb-1">
                        <strong>Gender:</strong> <span className="text-dark">{doctor.gender}</span>
                      </li>
                      <li className="text-muted mb-1">
                        <strong>Contact:</strong>{" "}
                        <span className="text-dark">
                          {doctor?.countryCode}
                          {doctor?.countryCode && " - "}
                          {doctor.mobile}
                        </span>
                      </li>
                      <li className="text-muted mb-1">
                        <strong>Email:</strong>{" "}
                        <span className="text-dark">{doctor.email}</span>
                      </li>
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
                        <span
                          className="text-clamped-one text-dark"
                          style={{
                            display: "inline-block",
                            maxWidth: "50%",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            verticalAlign: "bottom",
                          }}
                        >
                          {doctor.opTimings && doctor.opTimings.length > 0
                            ? doctor.opTimings.join(", ")
                            : "Not Available"}
                        </span>
                      </li>
                      <li className="text-muted mb-1">
                        <strong className="me-1">Expertise:</strong>{" "}
                        <span
                          className="text-dark text-clamped-one"
                          style={{
                            display: "inline-block",
                            maxWidth: "60%",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            verticalAlign: "bottom",
                          }}
                        >
                          Liver Intensive Care, Acute Liver Failure…
                        </span>
                      </li>
                    </ul>
                    {/* <div className="d-flex flex-wrap gap-2">
                            <button
                              href="#"
                              className="btn btn-light rounded-pill f-12 f-w-700"
                            >
                              View Profile
                            </button>
                            <button
                              className="btn btn-primary rounded-pill px-3 book-btn f-12"
                              //onClick={() => navigate("/book-appointment")}
                            >
                              Book Appointment
                            </button>
                          </div> */}
                  </div>
                </div>
              </div>
            </div>
          </Col>
        );
      })}
    </Fragment>
  );
};
export default AllCards;
