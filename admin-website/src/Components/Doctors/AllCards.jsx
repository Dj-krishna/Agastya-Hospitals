import React, { Fragment, useEffect, useState } from "react";
import { Button, Card, CardBody, Col } from "reactstrap";
import { DOCTORS_API } from "../../api";
import { fetchDataGet } from "../../api/Services";
import CardSkeleton from "../Common/Component/CardSkeleton";
import { deleteDoctor, fetchDoctors } from "../../slices/doctorsSlice";
import { toasterConfig } from "../../utils";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { FaTrashAlt } from "react-icons/fa";

const AllCards = ({ onEditDoctor, refreshTrigger = 0 }) => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  const fetchDoctorsData = async () => {
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
    fetchDoctorsData();
  }, [refreshTrigger]);

  const handleCardClick = (doctor) => {
    if (onEditDoctor) {
      onEditDoctor(doctor);
    }
  };

  const handleDeleteDoctor = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this doctor?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#fc4438",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await dispatch(deleteDoctor(id)); //await deleteSpeciality(id);
          if (response) {
            toasterConfig(
              "success",
              response.data?.message || "Deleted successfully"
            );
            dispatch(fetchDoctorsData()); // fetchSpecialities(); // Refresh the list
          } else {
            toasterConfig("error", "Something went wrong");
          }
        } catch (error) {
          toasterConfig("error", "Something went wrong");
        }
      }
    });
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
            <div
              className="card border-1 shadow-xs rounded-4 mb-4 p-2"
              onClick={() => handleCardClick(doctor)}
              style={{ cursor: "pointer" }}
            >
              <div className="row g-0">
                <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 text-center p-2">
                  <img
                    src={doctor.profilePicture}
                    className="img-fluid rounded-3"
                    alt="Doctor"
                  />
                  <div>
                    <FaTrashAlt
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteDoctor(doctor.doctorID);
                      }}
                      className="text-danger cursor-pointer"
                      title="Delete Doctor"
                      style={{
                        position: "absolute",
                        left: "10px",
                        bottom: "10px",
                      }}
                    />
                  </div>
                </div>
                <div className="col-lg-8 col-md-8 col-sm-12 col-xs-12 pr-0 pt-2">
                  <div className="card-body pl-1 p-0">
                    <h5 className="card-title fw-bold mb-1">
                      {doctor.fullName}
                    </h5>
                    <p
                      className="mb-1 text-muted small"
                      style={{
                        display: "inline-block",
                        maxWidth: "100%",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        verticalAlign: "bottom",
                        fontSize: "12px !important",
                      }}
                      title={doctor.qualification.join(", ")}
                    >
                      {doctor.qualification.join(", ")}
                    </p>
                    <p
                      className="text-primary fw-semibold mb-2"
                      style={{
                        display: "inline-block",
                        maxWidth: "100%",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        verticalAlign: "bottom",
                        fontSize: "12px !important",
                      }}
                      title={doctor.designation}
                    >
                      {doctor.designation}
                    </p>
                    <ul className="mb-3 small" style={{ listStyle: "inside" }}>
                      <li className="text-muted mb-1">
                        <strong>Gender:</strong>{" "}
                        <span className="text-dark">{doctor.gender}</span>
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
                          {doctor.languagesKnown.join(", ")}
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
                            fontSize: "12px !important",
                          }}
                          dangerouslySetInnerHTML={{
                            __html: doctor.expertise,
                          }}
                        />
                      </li>
                    </ul>
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
