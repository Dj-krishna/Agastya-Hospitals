import React, { Fragment, useState } from "react";
import { Breadcrumbs, Btn } from "../../AbstractElements";
import { Button, Container, Row } from "reactstrap";
import SpecialityForm from "./SpecialityForm";
import TableComponent from "../Common/Component/TableComponent";
import { FaEdit, FaTrash, FaTrashAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import { deleteSpeciality } from "../../api/Services";
import { SPECIALITIES_API } from "../../api";
import { fetchDataGet } from "../../api/Services";

const Specialities = () => {
  const [showSpecialityForm, setSpecialityForm] = useState(false);
  const [specialities, setSpecialities] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSpecialities = async () => {
    try {
      setLoading(true);
      const response = await fetchDataGet(SPECIALITIES_API);
      setSpecialities(response);
      console.log("Specialities:", response);
    } catch (error) {
      console.error("Error fetching specialities:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch specialities when the component mounts
  React.useEffect(() => {
    fetchSpecialities();
  }, []);

  return (
    <Fragment>
      {!showSpecialityForm ? (
        <>
          <Breadcrumbs
            mainTitle="Specialities"
            buttonTitle={"Add Speciality"}
            onClick={() => setSpecialityForm(true)}
          />

          <Container fluid={true}>
            <Row className="widget-grid">
              <TableComponent
                // title="Specialities"
                headers={["Name", "Icon", "Description", "Action"]}
                tableBody={
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="4" className="text-center">
                          <div className="spinner-border" role="status">
                            <span className="sr-only">Loading...</span>
                          </div>
                        </td>
                      </tr>
                    ) : specialities?.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center">
                          No Specialities found
                        </td>
                      </tr>
                    ) : (
                      specialities?.map((item, index) => (
                        <tr key={index}>
                          <td>{item.specialityName || "N/A"}</td>
                          <td>{item.icon || "N/A"}</td>
                          <td>{item.pageDescription}</td>
                          <td>
                            <FaEdit
                              onClick={() => setSpecialityForm(true)}
                              className="me-2 text-primary cursor-pointer"
                            />
                            <FaTrashAlt
                              onClick={() => {
                                Swal.fire({
                                  title: "Are you sure?",
                                  text: "You won't be able to revert this!",
                                  icon: "warning",
                                  showCancelButton: true,
                                  confirmButtonColor: "#3085d6",
                                  confirmButtonText: "Yes, delete it!",
                                  cancelButtonText: "Cancel",
                                  reverseButtons: true,
                                  customClass: {
                                    confirmButton: "danger",
                                  },
                                }).then(async (result) => {
                                  if (result.isConfirmed) {
                                    try {
                                      await deleteSpeciality(1); // or whatever your record's id is
                                      Swal.fire("Deleted!", "The record has been deleted.", "success");
                                      // Optionally refresh your data here
                                    } catch (error) {
                                      Swal.fire("Error!", "Failed to delete the record.", "error");
                                    }
                                  }
                                });
                              }}
                              className="text-danger cursor-pointer"
                            />
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                  
                }
              />
            </Row>
          </Container>
        </>
      ) : (
        <SpecialityForm onClose={() => setSpecialityForm(false)} />
      )}
    </Fragment>
  );
};

export default Specialities;
