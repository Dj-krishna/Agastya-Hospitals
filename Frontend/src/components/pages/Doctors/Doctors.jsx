import React, { useState } from "react";
import PageHeader from "../../common/PageHeader";
import ContainerCard from "../../common/ContainerCard";
import { Card, Row, Col, Button } from "react-bootstrap";
import { BsThreeDotsVertical } from "react-icons/bs";
import DoctorsForm from "./DoctorsForm";

// Doctors page
const mockDoctors = [
  {
    id: 1,
    name: "Victoria Lynch",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    initials: null,
    role: "Doctor",
    badgeColor: "#16c784",
    qualifications: "FCPS",
    department: "Gastroenterology",
    joinDate: "24 Jun 2015",
    contact: "+88 01713-123656",
    email: "info@softnio.com",
    experience: "10 Years",
  },
  {
    id: 2,
    name: "Abu Bin Isthiyak",
    avatar: null,
    initials: "AB",
    role: "Doctor",
    badgeColor: "#16c784",
    qualifications: "MBBS, FCPS",
    department: "Medicine",
    joinDate: "24 Jun 2015",
    contact: "+88 01713-123656",
    email: "info@softnio.com",
    experience: "10 Years",
  },
  {
    id: 3,
    name: "Ashley Lawson",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    initials: null,
    role: "Doctor",
    badgeColor: "#16c784",
    qualifications: "MBBS, FCPS, Surgon",
    department: "Orthopaedics",
    joinDate: "24 Jun 2015",
    contact: "+88 01713-123656",
    email: "info@softnio.com",
    experience: "10 Years",
  },
];

const Doctors = () => {
  const [showForm, setShowForm] = useState(false);
  return (
    <ContainerCard bgNone={!showForm} className="container_card">
      <PageHeader
        title={showForm ? "Add Doctor" : "Doctors"}
        buttonText={showForm ? "" : "Add Doctor"}
        onButtonClick={() => setShowForm(!showForm)}
      />
      {!showForm && (
        <Row className="gy-4">
          {mockDoctors.map((doctor) => (
            <Col key={doctor.id} md={4} sm={6}>
              <Card className="doctor-card border-0 position-relative p-3 rounded-4 shadow-sm h-100 bg-white text-center">
                {/* Badge at top right */}
                <span
                  className="position-absolute top-0 end-0 m-2 badge"
                  style={{
                    backgroundColor: doctor.badgeColor,
                    color: "#fff",
                    fontSize: "1rem",
                    borderRadius: "50%",
                    width: "28px",
                    height: "28px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <i className="bi bi-heart-fill"></i>
                </span>
                {/* Avatar or Initials */}
                <div className="d-flex justify-content-center mb-3">
                  {doctor.avatar ? (
                    <img
                      src={doctor.avatar}
                      alt={doctor.name}
                      className="rounded-circle"
                      style={{
                        width: "60px",
                        height: "60px",
                        objectFit: "cover",
                        border: "3px solid #f0f0f0",
                      }}
                    />
                  ) : (
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center"
                      style={{
                        width: "60px",
                        height: "60px",
                        background: "#f5f6fa",
                        color: "#a0a0a0",
                        fontWeight: "bold",
                        fontSize: "1.2rem",
                        border: "3px solid #f0f0f0",
                      }}
                    >
                      {doctor.initials}
                    </div>
                  )}
                </div>
                {/* Name and Role */}
                <div className="text-center">
                  <h6
                    className="mb-1 text-uppercase text-center"
                    style={{ fontWeight: 600 }}
                  >
                    DR. {doctor.name}
                  </h6>
                  <div
                    className="text-muted mb-1 text-center"
                    style={{ fontSize: "0.95rem" }}
                  >
                    {doctor.qualifications}&nbsp;|&nbsp;
                    <span style={{ fontSize: "0.95rem", color: "#888" }}>
                      {doctor.department}
                    </span>
                  </div>
                  <div
                    className="mb-2 text-center"
                    style={{ fontSize: "0.85rem", color: "#b0b0b0" }}
                  >
                    {doctor.role} | {doctor.experience}
                  </div>
                  
                  <div
                    className="mb-3"
                    style={{ fontSize: "0.92rem", color: "#b0b0b0" }}
                  >
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry.
                  </div>
                  <Button
                    variant="primary"
                    className="w-100"
                    style={{
                      borderRadius: "6px",
                      fontWeight: 500,
                      fontSize: "1rem",
                    }}
                    size="sm"
                  >
                    BOOK APPOINTMENT
                  </Button>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}
      {showForm && <DoctorsForm handleClose={() => setShowForm(false)} />}
    </ContainerCard>
  );
};

export default Doctors;
