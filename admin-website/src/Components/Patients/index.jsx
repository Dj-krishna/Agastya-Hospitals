import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Breadcrumbs } from "../../AbstractElements";
import { Button, Container, Row } from "reactstrap";
import TableComponent from "../Common/Component/TableComponent";
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import PatientForm from "./PatientForm";
import PatientDetails from "./PatientDetails";
import { fetchPatients } from "../../slices/patientSlice";
import TableSkeleton from "../Common/Component/TableSkeleton";
import { deletePatient as deletePatientAPI } from "../../api/Services";
import { toasterConfig } from "../../utils";
import Swal from "sweetalert2";

const Patients = () => {
  const [showPatientsForm, setShowPatientsForm] = useState(false);
  const [formType, setFormType] = useState("Create");
  const [viewPatientDetails, setViewPatientDetails] = useState(false);
  const [patientData, setPatientData] = useState(null);
  const [searchText, setSearchText] = useState("");

  const dispatch = useDispatch();
  const {
    data: patients,
    error,
    loading,
  } = useSelector((state) => {
    return state.patients;
  });

  const handleViewDetails = (data) => {
    setPatientData(data);
    setViewPatientDetails(!viewPatientDetails);
  };

  const openPatientForm = (formType, data) => {
    setFormType(formType);
    if (formType === "Edit") {
      setPatientData(data);
    } else {
      setPatientData({});
    }
    setShowPatientsForm(!showPatientsForm);
  };

  useEffect(() => {
    dispatch(fetchPatients());
  }, [dispatch]);

  const handleDeletePatient = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this patient?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#fc4438",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await deletePatientAPI(id);
          if (response) {
            toasterConfig(
              "success",
              response.message || "Patient deleted successfully"
            );
            dispatch(fetchPatients()); // Refresh the list
          } else {
            toasterConfig("error", "Something went wrong");
          }
        } catch (error) {
          console.error("Error deleting patient:", error);
          toasterConfig("error", "Something went wrong");
        }
      }
    });
  };

  const filteredPatients = patients?.length
    ? patients.filter(
        (patient) =>
          patient.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
          patient.UHID.toLowerCase().includes(searchText.toLowerCase()) ||
          patient.email.toLowerCase().includes(searchText.toLowerCase()) ||
          patient.mobile.toLowerCase().includes(searchText.toLowerCase())
      )
    : [];

  return (
    <>
      <Fragment>
        {!showPatientsForm ? (
          <>
            <Breadcrumbs
              mainTitle={viewPatientDetails ? "Patient Details" : "Patients"}
              buttonTitle={viewPatientDetails ? "Back to list" : "Add Patient"}
              onClick={
                viewPatientDetails
                  ? () => setViewPatientDetails(false)
                  : () => openPatientForm("Create")
              }
              btnColor={viewPatientDetails ? "secondary" : "primary"}
            />

            <Container fluid={true}>
              {!viewPatientDetails ? (
                <Row className="widget-grid">
                  {loading ? (
                    <TableSkeleton rows={patients?.length} columns={5} />
                  ) : (
                    <TableComponent
                      headers={[
                        "UHID",
                        "Name",
                        "Phone Number",
                        "Email",
                        "Action",
                      ]}
                      isSearch={true}
                      searchText={searchText}
                      onSearch={(e) => setSearchText(e.target.value)}
                      tableBody={
                        <tbody>
                          {filteredPatients.map((data, index) => (
                            <tr key={index}>
                              <td>{data.UHID}</td>
                              <td>{data.fullName}</td>
                              <td>{data.mobile}</td>
                              <td>{data.email}</td>
                              <td>
                                <FaPencilAlt
                                  color="#7366ff"
                                  onClick={() => openPatientForm("Edit", data)}
                                />
                                &nbsp;&nbsp;
                                <span className="text-muted">|</span>
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
                                &nbsp;&nbsp;
                                <span className="text-muted">|</span>
                                &nbsp;&nbsp;
                                <FaTrashAlt
                                  color="#fc4438"
                                  style={{ cursor: 'pointer' }}
                                  onClick={() => handleDeletePatient(data.patientID)}
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      }
                    />
                  )}
                </Row>
              ) : (
                <PatientDetails patientDetails={patientData} />
              )}
            </Container>
          </>
        ) : (
          <PatientForm
            onClose={() => {
              setShowPatientsForm(false);
              dispatch(fetchPatients()); // Refresh the list after form submission
            }}
            patientData={patientData}
            formType={formType}
          />
        )}
      </Fragment>
    </>
  );
};

export default Patients;
