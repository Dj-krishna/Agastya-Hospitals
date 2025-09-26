import React from "react";
import { Card, Col, Label, Row } from "reactstrap";
import TableComponent from "../Common/Component/TableComponent";

const PatientDetails = ({ patientDetails }) => {
  return (
    <>
      <Card className="px-3 py-4">
        <h6 className="b-b-light pb-3">Personal Info</h6>
        <Row className="m-0 widget-grid">
          <Col md="6">
            <ul>
              <li className="mb-2 d-flex justify-content-between">
                <Label className="form-label text-muted">UHID:</Label>
                <span className="f-w-500">
                  {patientDetails.patientID ? patientDetails.patientID : "---"}
                </span>
              </li>
              <li className="mb-2 d-flex justify-content-between">
                <Label className="form-label text-muted">Full Name:</Label>
                <span className="f-w-500">
                  {patientDetails.fullName ? patientDetails.fullName : "---"}
                </span>
              </li>
              <li className="mb-2 d-flex justify-content-between">
                <Label className="form-label text-muted">Phone Number:</Label>
                <span className="f-w-500">
                  {patientDetails.mobile ? patientDetails.mobile : "---"}
                </span>
              </li>
              <li className="mb-2 d-flex justify-content-between">
                <Label className="form-label text-muted">Email:</Label>
                <span className="f-w-500">
                  {patientDetails.email ? patientDetails.email : "---"}
                </span>
              </li>
              <li className="mb-2 d-flex justify-content-between">
                <Label className="form-label text-muted">Address:</Label>
                <span className="f-w-500">
                  {patientDetails.address ? patientDetails.address : "---"}
                </span>
              </li>
              <li className="mb-2 d-flex justify-content-between">
                <Label className="form-label text-muted">Past History:</Label>
                <span className="f-w-500">
                  {patientDetails.pastHistory
                    ? patientDetails.pastHistory
                    : "---"}
                </span>
              </li>
              <li className="d-flex justify-content-between">
                <Label className="form-label text-muted">Date of Birth:</Label>
                <span className="f-w-500">
                  {patientDetails.dob
                    ? new Date(patientDetails.dob).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })
                    : "---"}
                </span>
              </li>
            </ul>
          </Col>
          <Col md="6 bg-light rounded"></Col>
        </Row>
      </Card>
      <Card className="px-3 py-4">
        <h6 className="b-b-light pb-3">Medical Records</h6>
        <Row className="widget-grid">
          <Col md="12 px-0"></Col>
        </Row>
      </Card>
      <Card className="px-3 pt-4 pb-0 bg-none">
        <h6 className="b-b-light pb-3">Appointments or Health Checkups</h6>
        <Row className="widget-grid">
          <Col md="12 px-0">
            <TableComponent
              headers={["Record ID", "Date", "Reason", "Description", "Doctor"]}
              tableBody={
                <tbody>
                  {patientDetails.medicalRecords?.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center">
                        No medical records found.
                      </td>
                    </tr>
                  ) : (
                    patientDetails.visits.map((record, index) => (
                      <tr key={index}>
                        <td>{record.recordID ? record.recordID : "-"}</td>
                        <td>
                          {new Date(record.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                          })}
                        </td>
                        <td>{record.reason}</td>
                        <td>{record.description}</td>
                        <td>{record.doctor}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              }
            />
          </Col>
        </Row>
      </Card>
    </>
  );
};

export default PatientDetails;
