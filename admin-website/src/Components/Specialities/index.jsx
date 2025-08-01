import React, { Fragment, useState } from "react";
import { Breadcrumbs, Btn } from "../../AbstractElements";
import { Button, Container, Row } from "reactstrap";
import SpecialityForm from "./SpecialityForm";
import TableComponent from "../Common/Component/TableComponent";
import { FaEdit, FaTrash, FaTrashAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import { deleteSpeciality } from "../../api/Services";

const Specialities = () => {
  const [showSpecialityForm, setSpecialityForm] = useState(false);



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
                    <tr>
                      <td>Cardiology</td>
                      <td>
                        <i className="fa fa-heartbeat"></i>
                      </td>
                      <td>
                        <span>
                          Cardiology is a branch of medicine that deals with the
                          diagnosis and treatment of diseases of the heart and
                          blood vessels.
                        </span>
                      </td>
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
