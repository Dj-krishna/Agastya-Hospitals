import React, { useEffect, useState } from "react";
import { Breadcrumbs } from "../../AbstractElements";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Form,
  Input,
  Row,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchPatients } from "../../slices/patientSlice";

const UploadForm = ({ onClose }) => {
  const [patientName, setPatientName] = useState("");
  const [record, setRecord] = useState("");
  const [patientData, setPatientData] = useState({});
  const dispatch = useDispatch();
  const {
    data: patients,
    error,
    loading,
  } = useSelector((state) => {
    return state.patients;
  });

  useEffect(() => {
    dispatch(fetchPatients());
  }, [dispatch]);

  const handlePatientChange = (e) => {
    const value = e.target.value.split(" ");
    const selectedPatient = patients.find(
      (patient) => String(patient.patientID) === value[0]
    );
    setPatientData(selectedPatient);
    setPatientName(e.target.value);
  };

  function hasValues(patientData) {
    return Object.values(patientData).some(
      (v) => v !== null && v !== "" && v !== undefined
    );
  }

  return (
    <>
      <Breadcrumbs
        mainTitle={"Upload Medical Records"}
        buttonTitle={"Back to list"}
        btnColor={"secondary"}
        onClick={onClose}
      />
      <Container fluid={true}>
        <Form>
          <Row>
            <Col sm="6">
              <Card>
                <CardBody>
                  <h6 className="b-b-light pb-2">Select Patient</h6>
                  <Input
                    type="select"
                    className="mt-3"
                    placeholder="Select Patient"
                    name="patientSelect"
                    value={patientName}
                    onChange={handlePatientChange}
                  >
                    <option value="">Select a Patient</option>
                    {patients.length > 0 &&
                      patients.map((patient) => (
                        <option
                          key={patient.patientID}
                          value={patient.patientID + " " + patient.fullName}
                        >
                          {patient.patientID} - {patient.fullName}
                        </option>
                      ))}
                  </Input>
                </CardBody>
              </Card>
              <Card>
                <CardBody>
                  <h6 className="b-b-light pb-2">Upload Medical Records</h6>
                  <Input
                    type="file"
                    className="mt-3"
                    name="medicalRecords"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={(e) => setRecord(e.target.files[0])}
                  />
                </CardBody>
              </Card>
            </Col>
            <Col sm="6">
              <Card>
                <CardBody>
                  <h6 className="b-b-light pb-2">Patient Details</h6>
                  {patientData && hasValues(patientData) ? (
                    <div>
                      <p className="d-flex justify-content-between">
                        <strong className="text-muted">Patient ID:</strong>{" "}
                        {patientData.patientID}
                      </p>
                      <p className="d-flex justify-content-between">
                        <strong className="text-muted">Name:</strong>{" "}
                        {patientData.fullName}
                      </p>
                      <p className="d-flex justify-content-between">
                        <strong className="text-muted">Gender:</strong>{" "}
                        {patientData.gender}
                      </p>
                      <p className="d-flex justify-content-between">
                        <strong className="text-muted">Email:</strong>{" "}
                        {patientData.email}
                      </p>
                      <p className="d-flex justify-content-between">
                        <strong className="text-muted">Phone:</strong>{" "}
                        {patientData.mobile}
                      </p>
                      <p className="d-flex justify-content-between">
                        <strong className="text-muted">Date of Birth:</strong>{" "}
                        {new Date(patientData.dob).toLocaleDateString()}
                      </p>
                    </div>
                  ) : (
                    <p className="text-muted pt-3">
                      Select a patient to view details
                    </p>
                  )}
                </CardBody>
              </Card>
            </Col>
            <Col md="12" className="text-center mt-1">
              <Button
                color="primary"
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  console.log("Form submitted with patient data:", patientData);
                }}
              >
                Save
              </Button>
            </Col>
          </Row>
        </Form>
      </Container>
    </>
  );
};

export default UploadForm;
