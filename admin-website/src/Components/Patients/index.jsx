import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Breadcrumbs } from "../../AbstractElements";
import { Button, Container, Row } from "reactstrap";
import TableComponent from "../Common/Component/TableComponent";
import { PATIENTS_API } from "../../api";
import { fetchDataGet } from "../../api/Services";
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import PatientForm from "./PatientForm";
import PatientDetails from "./PatientDetails";
import { fetchPatients } from "../../slices/patientSlice";

const Patients = () => {
  const [showPatientsForm, setShowPatientsForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [viewPatientDetails, setViewPatientDetails] = useState(false);
  const [patientData, setPatientData] = useState(null);

  const dispatch = useDispatch();
  const {
    data: patients,
    error,
  } = useSelector((state) => {
    return state.patients;
  });

  const handleViewDetails = (data) => {
    setPatientData(data);
    setViewPatientDetails(!viewPatientDetails);
  };

  useEffect(() => {
    dispatch(fetchPatients());
  }, [dispatch]);

  return (
    <Fragment>
      {!showPatientsForm ? (
        <>
          <Breadcrumbs
            mainTitle={viewPatientDetails ? "Patient Details" : "Patients"}
            buttonTitle={viewPatientDetails ? "Back to list" : "Add Patient"}
            onClick={
              viewPatientDetails
                ? () => setViewPatientDetails(false)
                : () => setShowPatientsForm(true)
            }
            btnColor={viewPatientDetails ? "secondary" : "primary"}
          />

          <Container fluid={true}>
            {!viewPatientDetails ? (
              <Row className="widget-grid">
                <TableComponent
                  headers={["UHID", "Name", "Phone Number", "Email", "Action"]}
                  tableBody={
                    <tbody>
                      {patients.map((data, index) => (
                        <tr key={index}>
                          <td>{data.patientID}</td>
                          <td>{data.fullName}</td>
                          <td>{data.mobile}</td>
                          <td>{data.email}</td>
                          <td>
                            <FaPencilAlt color="#7366ff" />
                            &nbsp;&nbsp;<span className="text-muted">|</span>
                            &nbsp;&nbsp;
                            <Button
                              color="success"
                              outline
                              className="px-1"
                              size="sm"
                              onClick={() => handleViewDetails(data)}
                            >
                              View Patient
                            </Button>
                            &nbsp;&nbsp;<span className="text-muted">|</span>
                            &nbsp;&nbsp;
                            <FaTrashAlt color="#fc4438" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  }
                />
              </Row>
            ) : (
              <PatientDetails patientDetails={patientData} />
            )}
          </Container>
        </>
      ) : (
        <PatientForm
          onClose={() => setShowPatientsForm(false)}
          initialData={editingPatient}
          isEditMode={isEditMode}
        />
      )}
    </Fragment>
  );
};

export default Patients;
