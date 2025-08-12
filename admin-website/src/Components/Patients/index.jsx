import React, { Fragment, useEffect } from "react";
import { Breadcrumbs } from "../../AbstractElements";
import { Button, Container, Row } from "reactstrap";
import TableComponent from "../Common/Component/TableComponent";
import { PATIENTS_API } from "../../api";
import { fetchDataGet } from "../../api/Services";
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import PatientForm from "./PatientForm";

const Patients = () => {
  const [showPatientsForm, setShowPatientsForm] = React.useState(false);
  const [patients, setPatients] = React.useState([]);
  const [editingPatient, setEditingPatient] = React.useState(null);
  const [isEditMode, setIsEditMode] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const data = await fetchDataGet(PATIENTS_API);
      setPatients(data);
    } catch (error) {
      console.error("Error fetching packages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleAddPatient = () => {
    setEditingPatient(null);
    setIsEditMode(false);
    setShowPatientsForm(true);
  };

  return (
    <Fragment>
      {!showPatientsForm ? (
        <>
          <Breadcrumbs
            mainTitle="Patients"
            buttonTitle={"Add Patient"}
            onClick={() => setShowPatientsForm(true)}
          />

          <Container fluid={true}>
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
