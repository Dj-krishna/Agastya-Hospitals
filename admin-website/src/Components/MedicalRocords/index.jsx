import React, { Fragment, useEffect, useState } from "react";
import { Breadcrumbs } from "../../AbstractElements";
import { Button, Container, Row } from "reactstrap";
import TableComponent from "../Common/Component/TableComponent";
import { fetchDataGet } from "../../api/Services";
import { PATIENTS_API } from "../../api";
import PatientDetails from "../Patients/PatientDetails";
import UploadForm from "./UploadForm";
import { toast } from "react-toastify";
import TableSkeleton from "../Common/Component/TableSkeleton";
import PaginationComponent from "../Common/Component/PaginationComponent";
import { FaPenAlt, FaPencilAlt } from "react-icons/fa";


const ITEMS_PER_PAGE = 7;
const MedicalRecords = () => {
  const [patients, setPatients] = useState([]);
  const [patientData, setPatientData] = useState(null);
  const [viewPatientDetails, setViewPatientDetails] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openUploadForm, setOpenUploadForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [editRecordData, setEditRecordData] = useState(false);
  const [patientID, setPatientID] = useState("");

  const handleViewDetails = (data) => {
    setPatientData(data);
    setPatientID(data.patientID);
    setEditRecordData(true);
    setOpenUploadForm(true);
  };

  const fetchPatients = async () => {
    try {
      setLoading(true);
      // Get roleid, email, mobile from localStorage.userDetails
      let userDetails = {};
      try {
        userDetails = JSON.parse(localStorage.getItem('userDetails')) || {};
      } catch (e) {
        userDetails = {};
      }
      const roleid = Number(userDetails.roleID);
      const allowedRoles = [1, 2, 3];
      let url = PATIENTS_API;
      if (!allowedRoles.includes(roleid)) {
        // For other roles, filter by email or mobile
        if (userDetails.email) {
          url = `${PATIENTS_API}?email=${encodeURIComponent(userDetails.email)}`;
        } else if (userDetails.mobile) {
          url = `${PATIENTS_API}?mobile=${encodeURIComponent(userDetails.mobile)}`;
        }
      }
      const data = await fetchDataGet(url);
      if (data) {
        setPatients(data);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching packages:", error);
      toast.error("Error fetching packages");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const totalPages = Math.ceil(patients.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentData = patients.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <Fragment>
      {!openUploadForm ? (
        <>
          <Breadcrumbs
            mainTitle={
              viewPatientDetails ? "Patient Details" : "Medical Records"
            }
            buttonTitle={viewPatientDetails ? "Back to list" : "Upload Records"}
            onClick={
              viewPatientDetails
                ? () => setViewPatientDetails(false)
                : () => setOpenUploadForm(true)
            }
            btnColor={viewPatientDetails ? "secondary" : "primary"}
          />

          <Container fluid={true}>
            {loading ? (
              <TableSkeleton columns={5} rows={5} />
            ) : (
              <Row className="widget-grid">
                {!viewPatientDetails ? (
                  <>
                    <TableComponent
                      headers={[
                        "UHID",
                        "Name",
                        "Phone Number",
                        "Email",
                        "Action",
                      ]}
                      tableBody={
                        <tbody>
                          {patients.map((data, index) => (
                            <tr key={index}>
                              <td>{data.patientID}</td>
                              <td>{data.fullName}</td>
                              <td>{data.mobile}</td>
                              <td>{data.email}</td>
                              <td>
                                <FaPencilAlt
                                  color="#7366ff"
                                  onClick={() => handleViewDetails(data)}
                                  className="me-2 text-primary cursor-pointer"
                                  title="Edit Medical Records"
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      }
                    />
                    {/* <PaginationComponent
                      currentPage={currentPage}
                      totalPages={totalPages}
                      handlePageChange={handlePageChange}
                    /> */}
                  </>
                ) : (
                  <PatientDetails patientDetails={patientData} />
                )}
              </Row>
            )}
          </Container>
        </>
      ) : (
        <UploadForm
          onClose={() => setOpenUploadForm(false)}
          patientID={patientID}
        />
      )}
    </Fragment>
  );
};

export default MedicalRecords;
